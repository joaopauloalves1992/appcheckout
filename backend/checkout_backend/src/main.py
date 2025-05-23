import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from src.models.user import db
from src.routes.user import user_bp
from src.routes.product import product_bp
from src.routes.order import order_bp
from flask_cors import CORS

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app)  # Habilita CORS para todas as rotas
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Registra os blueprints
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(order_bp, url_prefix='/api/orders')

# Habilita o banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Substituindo o before_first_request que foi removido em versões mais recentes do Flask
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se a API está funcionando"""
    return jsonify({'status': 'ok', 'message': 'API is running'}), 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serve os arquivos estáticos do frontend"""
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
