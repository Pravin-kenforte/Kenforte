# app/template_data/theme.py
from app.template_data.template1_data import TEMPLATE_1
from app.template_data.template2_data import TEMPLATE_2
from app.template_data.template3_data import TEMPLATE_3
from app.template_data.template4_data import TEMPLATE_4
from app.template_data.template5_data import TEMPLATE_5
from app.template_data.template6_data import TEMPLATE_6



THEME_CONFIG = {
    '1': {
        **TEMPLATE_1,
        'primary_color': '#ffffff',
        'secondary_color': '#1a1a1a',
        'button_color': '#007bff',
        'font_family': 'Poppins, sans-serif',
        'logo_path': '/static/images/logo1.png',
        'static_css_file': 'styles/styles.css'
    },
    '2': {
        **TEMPLATE_2,
        'primary_color': '#f5f5f5',
        'secondary_color': '#333333',
        'button_color': '#17a2b8',
        'font_family': 'Poppins, sans-serif',
        'logo_path': '/static/images/logo2.png',
        'static_css_file': 'styles/styles2.css'
    },
    '3': {
        **TEMPLATE_3,
        'primary_color': '#004aad',
        'secondary_color': '#ffffff',
        'button_color': '#ff9900',
        'font_family': 'Roboto, sans-serif',
        'logo_path': '/static/images/logo3.png',
        'static_css_file': 'styles/styles3.css'
    },
    '4': {
        **TEMPLATE_4,
        'primary_color': '#222831',
        'secondary_color': '#eeeeee',
        'button_color': '#00adb5',
        'font_family': 'Open Sans, sans-serif',
        'logo_path': '/static/images/logo4.png',
        'static_css_file': 'styles/styles4.css'
    },
    '5': {
        **TEMPLATE_5,
        'primary_color': '#222831',
        'secondary_color': '#eeeeee',
        'button_color': '#00adb5',
        'font_family': 'Open Sans, sans-serif',
        'logo_path': '/static/images/logo4.png',
        'static_css_file': 'styles/styles4.css'
    },
    '6': {
        **TEMPLATE_6,
        'primary_color': '#222831',
        'secondary_color': '#eeeeee',
        'button_color': '#00adb5',
        'font_family': 'Open Sans, sans-serif',
        'logo_path': '/static/images/logo4.png',
        'static_css_file': 'styles/styles4.css'
    },
    'light': {
        'primary_color': '#ffffff',
        'secondary_color': '#222222',
        'button_color': '#007bff',
        'font_family': 'Poppins, sans-serif',
        'logo_path': '/static/images/logo-light.png',
        'static_css_file': 'styles/light.css'
    },
    'dark': {
        'primary_color': '#121212',
        'secondary_color': '#f5f5f5',
        'button_color': '#17a2b8',
        'font_family': 'Poppins, sans-serif',
        'logo_path': '/static/images/logo-dark.png',
        'static_css_file': 'styles/dark.css'
    }
}
