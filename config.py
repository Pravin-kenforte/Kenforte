import os
from app.template_data.template1_data import TEMPLATE_1
from app.template_data.template2_data import TEMPLATE_2
from app.template_data.template3_data import TEMPLATE_3
from app.template_data.template4_data import TEMPLATE_4
from app.template_data.template5_data import TEMPLATE_5
from app.template_data.template6_data import TEMPLATE_6

# Static paths
STATIC_FOLDER = 'app/static'
IMAGE_FOLDER = os.path.join(STATIC_FOLDER, 'images')

# Layout configuration
LAYOUT_OPTIONS = {
    '1': TEMPLATE_1,
    '2': TEMPLATE_2,
    '3': TEMPLATE_3,
    '4': TEMPLATE_4,
    '5': TEMPLATE_5,
    '6': TEMPLATE_6
}

# Default layout
ACTIVE_LAYOUT = '2'

# Domain to layout mapping
WEBSITE_LAYOUT = {
    "ws1.test.com": "1",
    "ws2.test.com": "2",
    "ws3.test.com": "3",
    "ws4.test.com": "4",
    "ws5.test.com": "5",
    "ws6.test.com": "6"
}
