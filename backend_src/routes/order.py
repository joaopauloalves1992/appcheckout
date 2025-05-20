from flask import Blueprint, request, jsonify
from src.models.order import db, Order
from src.models.product import Product

order_bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['GET'])
def get_orders():
    """Retorna todos os pedidos"""
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders]), 200

@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Retorna um pedido específico pelo ID"""
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict()), 200

@order_bp.route('/', methods=['POST'])
def create_order():
    """Cria um novo pedido"""
    data = request.json
    
    if not data or not data.get('product_id') or not data.get('customer_name') or not data.get('customer_email') or not data.get('payment_method'):
        return jsonify({'error': 'Dados incompletos para o pedido'}), 400
    
    # Verifica se o produto existe
    product = Product.query.get_or_404(data.get('product_id'))
    
    order = Order(
        product_id=data.get('product_id'),
        customer_name=data.get('customer_name'),
        customer_email=data.get('customer_email'),
        customer_phone=data.get('customer_phone'),
        customer_document=data.get('customer_document'),
        shipping_address=data.get('shipping_address'),
        shipping_number=data.get('shipping_number'),
        shipping_complement=data.get('shipping_complement'),
        shipping_neighborhood=data.get('shipping_neighborhood'),
        shipping_city=data.get('shipping_city'),
        shipping_state=data.get('shipping_state'),
        shipping_zipcode=data.get('shipping_zipcode'),
        shipping_method=data.get('shipping_method'),
        shipping_cost=data.get('shipping_cost', 0),
        payment_method=data.get('payment_method'),
        payment_status='pending',
        total_amount=product.price + (data.get('shipping_cost', 0)),
        status='pending'
    )
    
    db.session.add(order)
    db.session.commit()
    
    # Aqui seria o local para integrar com APIs de pagamento
    # Dependendo do método de pagamento (PIX, boleto, cartão)
    
    return jsonify({
        'message': 'Pedido criado com sucesso',
        'order': order.to_dict()
    }), 201

@order_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Atualiza o status de um pedido"""
    order = Order.query.get_or_404(order_id)
    data = request.json
    
    if not data or not data.get('status'):
        return jsonify({'error': 'Status não fornecido'}), 400
    
    valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled']
    if data.get('status') not in valid_statuses:
        return jsonify({'error': 'Status inválido'}), 400
    
    order.status = data.get('status')
    db.session.commit()
    
    return jsonify({
        'message': 'Status do pedido atualizado com sucesso',
        'order': order.to_dict()
    }), 200

@order_bp.route('/<int:order_id>/payment', methods=['PUT'])
def update_payment_status(order_id):
    """Atualiza o status de pagamento de um pedido"""
    order = Order.query.get_or_404(order_id)
    data = request.json
    
    if not data or not data.get('payment_status'):
        return jsonify({'error': 'Status de pagamento não fornecido'}), 400
    
    valid_statuses = ['pending', 'paid', 'failed', 'refunded']
    if data.get('payment_status') not in valid_statuses:
        return jsonify({'error': 'Status de pagamento inválido'}), 400
    
    order.payment_status = data.get('payment_status')
    if data.get('payment_id'):
        order.payment_id = data.get('payment_id')
    
    # Se o pagamento foi confirmado, atualiza o status do pedido
    if data.get('payment_status') == 'paid' and order.status == 'pending':
        order.status = 'processing'
    
    db.session.commit()
    
    return jsonify({
        'message': 'Status de pagamento atualizado com sucesso',
        'order': order.to_dict()
    }), 200

@order_bp.route('/product/<int:product_id>', methods=['GET'])
def get_orders_by_product(product_id):
    """Retorna todos os pedidos de um produto específico"""
    orders = Order.query.filter_by(product_id=product_id).all()
    return jsonify([order.to_dict() for order in orders]), 200
