from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    stock = db.Column(db.Integer, default=0)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    # Campos para personalização do checkout
    checkout_title = db.Column(db.String(100), nullable=True)
    checkout_description = db.Column(db.Text, nullable=True)
    checkout_urgency_message = db.Column(db.String(255), nullable=True)
    checkout_header_color = db.Column(db.String(20), default="#ffffff")
    checkout_button_color = db.Column(db.String(20), default="#007bff")
    checkout_accent_color = db.Column(db.String(20), default="#28a745")
    show_countdown = db.Column(db.Boolean, default=False)
    show_stock = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'stock': self.stock,
            'active': self.active,
            'checkout_title': self.checkout_title,
            'checkout_description': self.checkout_description,
            'checkout_urgency_message': self.checkout_urgency_message,
            'checkout_header_color': self.checkout_header_color,
            'checkout_button_color': self.checkout_button_color,
            'checkout_accent_color': self.checkout_accent_color,
            'show_countdown': self.show_countdown,
            'show_stock': self.show_stock,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
