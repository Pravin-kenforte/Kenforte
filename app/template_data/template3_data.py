TEMPLATE_FOLDER_3 = 'app/templates/3'
TEMPLATE_3={
        'template_dir': TEMPLATE_FOLDER_3,
                'header': {
        'logo': 'KENFORTE ',
        'subtext': 'CNC Tools & Equipments Pvt. Ltd coimbatore.',
        'nav_links': [
            {'name': 'Home', 'icon': 'fas fa-home', 'url': '/'},
            {'name': 'About Us', 'icon': 'fas fa-users', 'url': '/about_us'},
            {'name': 'Testimonials', 'icon': 'fas fa-comments', 'url': '/testimonials'},
        ],
        'dropdowns': [
            {
                'title': 'Products',
                'icon': 'fas fa-sitemap',
                'items': [
                    {'icon': 'fa-solid fa-book', 'name': 'Product catalog and Library', 'url': '/Product_catalog'},
                    {'icon': 'fa-solid fa-boxes-stacked', 'name': 'Material Handling / Storage', 'url': '/material_handling'},
                    {'icon': 'fa-solid fa-ruler-combined', 'name': 'Measuring Instruments', 'url': '/measuring'},
                    {'icon': 'fa-solid fa-scissors', 'name': 'Metal Cutting Tools', 'url': '/metal'},
                    {'icon': 'fa-solid fa-calculator', 'name': 'Gauges', 'url': '/gauge'},
                    {'icon': 'fa-solid fa-clipboard-check', 'name': 'Inspection Equipment', 'url': '/inspection'},
                ]
            },
            {
                'title': 'Services',
                'icon': 'fas fa-folder-open',
                'items': [
                    {'icon': 'fa-solid fa-clipboard-check', 'name': 'Metrology lab and NABL calibration lab', 'url': '/metrology'},
                    {'icon': 'fa-solid fa-dollar-sign', 'name': 'Customized softwrare', 'url': '/software'},
                ]
            },

        ],
        'contact_link': {'name': 'Contact Us', 'icon': 'fas fa-envelope', 'url': '/contact_us'}
    },

'hero_section': {
    'heading': 'Trusted and Reliable<br>Merchant Exporter',
    'paragraph': (
        'we are merchant exporter and supplier of CNC/VMC Cutting tools, '
        'Material Handling Equipments and spares, Gauges and Measuring instruments, '
        'Inspection Equipment, Drill and Endmill Resharpening machine & Tapping machine '
        'and more information Kindly check catalog.'
    ),
    'button_text': 'Click Here',
    'button_link': '#'
},
'hero_sections': [
    {
        'class': 'hero-section_2',
        'background': '/static/images/cnc_1.jpg',
        'heading': 'CNC & VMC Cutting<br>Tools & Accessories',
        'paragraph': (
            'We are the Authorized dealer and supplier of high quality CNC – VMC Cutting tools. '
            'Its product range Includes Milling tools, Turning, Holemaking, Threading, Tapping, '
            'Drilling and Tooling Holders and Accessories.'
        ),
        'button_text': 'More Information',
        'button_link': '#'
    },
    {
        'class': 'hero-section_1',
        'background': '/static/images/jcb.jpg',
        'heading': 'Material Handling<br>Tools & Accessories',
        'paragraph': (
            'Mascot CNC is the leading distributor and official partner for Godrej Material Handling Equipment. '
            'We supply various Material Handling Equipment, including Forklifts, Stackers, Mobi Stack equipment, '
            'Hand/ Power Pallet Truck, and Pallet Racking Systems.'
        ),
        'button_text': 'More Information',
        'button_link': '#'
    },
    {
        'class': 'hero-section_2',
        'background': '/static/images/cnc_2.jpg',
        'heading': 'Thread Gauges,<br>Measuring Instruments &<br>Inspections Equipments',
        'paragraph': (
            'Mascot offer an extensive range of high-precision and efficient product including Thread Gauge, '
            'Taper Gauge, Plain Plug, Taper and Ring Gauge, and Adjustable/Fixed/Dial Snap Gauge. '
            'Measuring instruments including Micrometer, Vernier, Height Gauge, and Dial Gauge. '
            'Inspection Equipments Including Surface plate, V-block.'
        ),
        'button_text': 'More Information',
        'button_link': '#'
    },
    {
        'class': 'hero-section_1',
        'background': '/static/images/cnc_3.jpg',
        'heading': 'Cutting oil and Value<br>saving Products',
        'paragraph': (
            'We are the Authorized dealer and supplier of high quality CNC – VMC Cutting tools. '
            'Its product range Includes Milling tools, Turning, Holemaking, Threading, Tapping, '
            'Drilling and Tooling Holders and Accessories.'
        ),
        'button_text': 'More Information',
        'button_link': '#'
    }
],
'customers_section': {
        'title': 'Our Customers',
        'customers': [
            {'img_src': '/static/images/logo_1.jpg', 'alt': 'Customer 1'},
            {'img_src': '/static/images/logo_2.jpg', 'alt': 'Customer 2'},
            {'img_src': '/static/images/logo_3.jpg', 'alt': 'Customer 3'},
            {'img_src': '/static/images/logo_4.png', 'alt': 'Customer 1'},
            {'img_src': '/static/images/logo_5.png', 'alt': 'Customer 2'},
            {'img_src': '/static/images/logo_6.jpg', 'alt': 'Customer 3'},
            {'img_src': '/static/images/logo_7.jpg', 'alt': 'Customer 1'},
            {'img_src': '/static/images/logo_1.jpg', 'alt': 'Customer 2'},
            {'img_src': '/static/images/logo_2.jpg', 'alt': 'Customer 3'},
            # Add up to 200 customers here similarly
        ]
    },

 'blog_section': {
        'subtitle': 'Our News and Articles',
        'title': 'Latest From Blog',
        'blogs': [
            {
                'img_src': '/static/images/bolg.jpg',
                'alt': 'Blog 1',
                'heading': 'Drill Resharpening tips & techniques:',
                'category': 'Uncategorized',
                'category_class': '',
                'excerpt': 'Getting ahead in the infinite game; the game of constant improvement. 📘. 🛠. As we live out our core',
                'read_more_symbol': '+'
            },
            {
                'img_src': '/static/images/new-image.jpg',
                'alt': 'Blog 2',
                'heading': 'Combicham',
                'category': 'Success Case Story',
                'category_class': 'success',
                'excerpt': 'Application: Drilling Tool<br>Material: Group 10 – high alloyed steel, cast steel and tool',
                'read_more_symbol': '+'
            }
        ],
        'pagination': [
            {'page': '1', 'active': True, 'link': '#'},
            {'page': '2', 'active': False, 'link': '#'},
            {'page': '3', 'active': False, 'link': '#'},
            {'page': '»', 'active': False, 'link': '#'},
        ]
    },
    'footer': {
        'footer_note': (
            "“The brand names in mentioned in this entire documents belong to the respective owners. "
            "We have been use for reference purpose only”"
        ),
        'about': {
            'text': (
                "aadhira CNC Tools and Equipment Pvt. Ltd. is one of Gujarat’s most prominent industrial products and "
                "solutions trading groups."
            ),
            'read_more': "Read More..",
            'social_icons': [
                'fab fa-twitter',
                'fab fa-facebook-f',
                'fab fa-linkedin-in',
                'fab fa-instagram',
            ]
        },
        'services': [
            "Material Handling / Storage",
            "Work Center Solutions",
            "Value Saving Products",
            "Thread Dies & Rolls",
        ],
        'recent_posts': [
            {
                'img_src': '/static/images/cnc.jpg',
                'alt': 'Post Image',
                'title': 'Drill Resharpening tips & tech',
                'date': 'Nov 22, 2022',
                'icon_class': 'far fa-clock',
            },
            {
                'img_src': '/static/images/cnc.jpg',
                'alt': 'Post Image',
                'title': 'Combicham',
                'date': 'Feb 25, 2022',
                'icon_class': 'far fa-clock',
            }
        ],
        'footer_bottom': {
            'copyright': (
                "Copyright © 2023 "
                "<strong>aadhira CNC Tools & Equipment Pvt. Ltd.</strong> All Rights Reserved"
            ),
            'credits': (
                'Proudly Made with <span class="heart">❤️</span> in India by '
                '<span class="credits">Kenforte Infosystems</span>'
            )
        }
    }


            }
        
     