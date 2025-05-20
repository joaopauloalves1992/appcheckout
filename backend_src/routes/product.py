from flask import Blueprint, request, jsonify
from src.models.product import db, Product
import os

product_bp = Blueprint('product', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    """Retorna todos os produtos ativos"""
    products = Product.query.filter_by(active=True).all()
    return jsonify([product.to_dict() for product in products]), 200

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Retorna um produto específico pelo ID"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict()), 200

@product_bp.route('/', methods=['POST'])
def create_product():
    """Cria um novo produto"""
    data = request.json
    
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({'error': 'Nome e preço são obrigatórios'}), 400
    
    product = Product(
        name=data.get('name'),
        description=data.get('description'),
        price=data.get('price'),
        image_url=data.get('image_url'),
        stock=data.get('stock', 0),
        active=data.get('active', True),
        checkout_title=data.get('checkout_title'),
        checkout_description=data.get('checkout_description'),
        checkout_urgency_message=data.get('checkout_urgency_message'),
        checkout_header_color=data.get('checkout_header_color', '#ffffff'),
        checkout_button_color=data.get('checkout_button_color', '#007bff'),
        checkout_accent_color=data.get('checkout_accent_color', '#28a745'),
        show_countdown=data.get('show_countdown', False),
        show_stock=data.get('show_stock', False)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Atualiza um produto existente"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    if data.get('name'):
        product.name = data.get('name')
    if data.get('description') is not None:
        product.description = data.get('description')
    if data.get('price') is not None:
        product.price = data.get('price')
    if data.get('image_url') is not None:
        product.image_url = data.get('image_url')
    if data.get('stock') is not None:
        product.stock = data.get('stock')
    if data.get('active') is not None:
        product.active = data.get('active')
    if data.get('checkout_title') is not None:
        product.checkout_title = data.get('checkout_title')
    if data.get('checkout_description') is not None:
        product.checkout_description = data.get('checkout_description')
    if data.get('checkout_urgency_message') is not None:
        product.checkout_urgency_message = data.get('checkout_urgency_message')
    if data.get('checkout_header_color') is not None:
        product.checkout_header_color = data.get('checkout_header_color')
    if data.get('checkout_button_color') is not None:
        product.checkout_button_color = data.get('checkout_button_color')
    if data.get('checkout_accent_color') is not None:
        product.checkout_accent_color = data.get('checkout_accent_color')
    if data.get('show_countdown') is not None:
        product.show_countdown = data.get('show_countdown')
    if data.get('show_stock') is not None:
        product.show_stock = data.get('show_stock')
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Desativa um produto (soft delete)"""
    product = Product.query.get_or_404(product_id)
    product.active = False
    db.session.commit()
    
    return jsonify({'message': 'Produto desativado com sucesso'}), 200

@product_bp.route('/<int:product_id>/checkout-url', methods=['GET'])
def get_checkout_url(product_id):
    """Retorna a URL única para o checkout do produto"""
    product = Product.query.get_or_404(product_id)
    
    # Aqui você pode implementar lógica para gerar URLs únicas
    # Por exemplo, usando um token ou hash
    checkout_url = f"/checkout/{product_id}"
    
    return jsonify({'checkout_url': checkout_url}), 200
