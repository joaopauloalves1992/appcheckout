from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=True)
    customer_document = db.Column(db.String(20), nullable=True)  # CPF/CNPJ
    
    # Endereço de entrega
    shipping_address = db.Column(db.String(255), nullable=True)
    shipping_number = db.Column(db.String(20), nullable=True)
    shipping_complement = db.Column(db.String(100), nullable=True)
    shipping_neighborhood = db.Column(db.String(100), nullable=True)
    shipping_city = db.Column(db.String(100), nullable=True)
    shipping_state = db.Column(db.String(2), nullable=True)
    shipping_zipcode = db.Column(db.String(10), nullable=True)
    shipping_method = db.Column(db.String(50), nullable=True)
    shipping_cost = db.Column(db.Float, default=0)
    
    # Pagamento
    payment_method = db.Column(db.String(20), nullable=False)  # pix, boleto, credit_card
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed, refunded
    payment_id = db.Column(db.String(100), nullable=True)  # ID externo do pagamento
    
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, processing, shipped, delivered, canceled
    
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Relações
    product = db.relationship('Product', backref='orders')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'customer_name': self.customer_name,
            'customer_email': self.customer_email,
            'customer_phone': self.customer_phone,
            'customer_document': self.customer_document,
            'shipping_address': self.shipping_address,
            'shipping_number': self.shipping_number,
            'shipping_complement': self.shipping_complement,
            'shipping_neighborhood': self.shipping_neighborhood,
            'shipping_city': self.shipping_city,
            'shipping_state': self.shipping_state,
            'shipping_zipcode': self.shipping_zipcode,
            'shipping_method': self.shipping_method,
            'shipping_cost': self.shipping_cost,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'payment_id': self.payment_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
