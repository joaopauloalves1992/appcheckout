from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class BankAccount(db.Model):
    __tablename__ = 'bank_accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bank_name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(50), nullable=False)  # corrente, poupança, etc.
    agency = db.Column(db.String(20), nullable=False)
    account_number = db.Column(db.String(20), nullable=False)
    pix_key = db.Column(db.String(100), nullable=True)
    pix_key_type = db.Column(db.String(20), nullable=True)  # CPF, CNPJ, email, telefone, aleatória
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bank_name': self.bank_name,
            'account_type': self.account_type,
            'agency': self.agency,
            'account_number': self.account_number,
            'pix_key': self.pix_key,
            'pix_key_type': self.pix_key_type,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
