from flask import Flask  # type: ignore
import config
from app.template_data.theme import THEME_CONFIG  # ✅ Import your theme settings

def create_app():
    app = Flask(__name__)

    # 🔐 Required for session to work
    app.secret_key = 'your-very-secret-key'  # Use env variable in production

    # Load configuration from config.py
    app.config.from_object(config)

    # 🔄 Layout / Theme Setup
    app.config['LAYOUT_OPTIONS'] = THEME_CONFIG
    app.config['ACTIVE_LAYOUT'] = 'template1'  # fallback if session isn't set

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app
