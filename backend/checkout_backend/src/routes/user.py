from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.bank_account import BankAccount
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

user_bp = Blueprint('user', __name__)

# Função auxiliar para gerar token JWT
def generate_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT'),
        algorithm='HS256'
    )

# Decorator para verificar token
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token não fornecido!'}), 401
        
        try:
            data = jwt.decode(token, os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT'), algorithms=["HS256"])
            current_user = User.query.get(data['sub'])
        except:
            return jsonify({'message': 'Token inválido!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

@user_bp.route('/register', methods=['POST'])
def register():
    """Registra um novo usuário"""
    data = request.json
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'error': 'Nome, email e senha são obrigatórios'}), 400
    
    # Verifica se o usuário já existe
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'error': 'Email já cadastrado'}), 400
    
    # Cria o usuário
    user = User(
        name=data.get('name'),
        email=data.get('email'),
        password=generate_password_hash(data.get('password')),
        is_admin=data.get('is_admin', False)
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Usuário registrado com sucesso',
        'user': user.to_dict()
    }), 201

@user_bp.route('/login', methods=['POST'])
def login():
    """Autentica um usuário"""
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email e senha são obrigatórios'}), 400
    
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not check_password_hash(user.password, data.get('password')):
        return jsonify({'error': 'Credenciais inválidas'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'message': 'Login realizado com sucesso',
        'token': token,
        'user': user.to_dict()
    }), 200

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Retorna o perfil do usuário autenticado"""
    return jsonify(current_user.to_dict()), 200

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Atualiza o perfil do usuário autenticado"""
    data = request.json
    
    if data.get('name'):
        current_user.name = data.get('name')
    if data.get('email'):
        # Verifica se o email já está em uso
        if User.query.filter_by(email=data.get('email')).first() and data.get('email') != current_user.email:
            return jsonify({'error': 'Email já cadastrado'}), 400
        current_user.email = data.get('email')
    if data.get('password'):
        current_user.password = generate_password_hash(data.get('password'))
    
    db.session.commit()
    
    return jsonify({
        'message': 'Perfil atualizado com sucesso',
        'user': current_user.to_dict()
    }), 200

@user_bp.route('/bank-accounts', methods=['GET'])
@token_required
def get_bank_accounts(current_user):
    """Retorna as contas bancárias do usuário autenticado"""
    bank_accounts = BankAccount.query.filter_by(user_id=current_user.id).all()
    return jsonify([account.to_dict() for account in bank_accounts]), 200

@user_bp.route('/bank-accounts', methods=['POST'])
@token_required
def create_bank_account(current_user):
    """Cria uma nova conta bancária para o usuário autenticado"""
    data = request.json
    
    if not data or not data.get('bank_name') or not data.get('account_type') or not data.get('agency') or not data.get('account_number'):
        return jsonify({'error': 'Dados bancários incompletos'}), 400
    
    # Se for definida como padrão, desativa as outras
    if data.get('is_default', False):
        BankAccount.query.filter_by(user_id=current_user.id, is_default=True).update({'is_default': False})
    
    bank_account = BankAccount(
        user_id=current_user.id,
        bank_name=data.get('bank_name'),
        account_type=data.get('account_type'),
        agency=data.get('agency'),
        account_number=data.get('account_number'),
        pix_key=data.get('pix_key'),
        pix_key_type=data.get('pix_key_type'),
        is_default=data.get('is_default', False)
    )
    
    db.session.add(bank_account)
    db.session.commit()
    
    return jsonify({
        'message': 'Conta bancária cadastrada com sucesso',
        'bank_account': bank_account.to_dict()
    }), 201

@user_bp.route('/bank-accounts/<int:account_id>', methods=['PUT'])
@token_required
def update_bank_account(current_user, account_id):
    """Atualiza uma conta bancária do usuário autenticado"""
    bank_account = BankAccount.query.filter_by(id=account_id, user_id=current_user.id).first_or_404()
    data = request.json
    
    if data.get('bank_name'):
        bank_account.bank_name = data.get('bank_name')
    if data.get('account_type'):
        bank_account.account_type = data.get('account_type')
    if data.get('agency'):
        bank_account.agency = data.get('agency')
    if data.get('account_number'):
        bank_account.account_number = data.get('account_number')
    if data.get('pix_key') is not None:
        bank_account.pix_key = data.get('pix_key')
    if data.get('pix_key_type') is not None:
        bank_account.pix_key_type = data.get('pix_key_type')
    if data.get('is_default') is not None:
        if data.get('is_default'):
            BankAccount.query.filter_by(user_id=current_user.id, is_default=True).update({'is_default': False})
        bank_account.is_default = data.get('is_default')
    
    db.session.commit()
    
    return jsonify({
        'message': 'Conta bancária atualizada com sucesso',
        'bank_account': bank_account.to_dict()
    }), 200

@user_bp.route('/bank-accounts/<int:account_id>', methods=['DELETE'])
@token_required
def delete_bank_account(current_user, account_id):
    """Remove uma conta bancária do usuário autenticado"""
    bank_account = BankAccount.query.filter_by(id=account_id, user_id=current_user.id).first_or_404()
    
    db.session.delete(bank_account)
    db.session.commit()
    
    return jsonify({'message': 'Conta bancária removida com sucesso'}), 200
