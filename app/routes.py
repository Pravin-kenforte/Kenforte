
from flask import Blueprint, current_app, render_template, request, redirect, url_for  # type: ignore
from jinja2 import ChoiceLoader, FileSystemLoader  # type: ignore
from .common.constants import TEMPLATE_INDEX_HTML_FILE_NAME

main = Blueprint('main', __name__)

# 🔹 Get layout info based on current host or fallback
def get_layout_data():
    host_name = request.host.split(":")[0]
    layout_key = current_app.config.get("WEBSITE_LAYOUT", {}).get(host_name) \
                 or current_app.config.get("ACTIVE_LAYOUT", "2")

    layout_info = current_app.config.get("LAYOUT_OPTIONS", {}).get(layout_key)

    if not layout_info:
        return None, None, None

    template_dir = layout_info.get("template_dir")
    context_data = {k: v for k, v in layout_info.items() if k != "template_dir"}
    context_data["theme"] = layout_key  # Optional: expose current layout key
    context_data["css_files"] = layout_info.get("css_files", [])
    context_data["title"] = f"{layout_key.upper()} - Kenforte Portal"

    return layout_key, template_dir, context_data

# 🔹 Reusable dynamic template renderer
def render_dynamic_template(template_name):
    layout_key, template_dir, context = get_layout_data()

    if not template_dir:
        return "Invalid layout", 404

    old_loader = current_app.jinja_loader
    current_app.jinja_loader = ChoiceLoader([
        FileSystemLoader(template_dir),
        FileSystemLoader("app/templates")
    ])
    try:
        return render_template(template_name, **context)
    finally:
        current_app.jinja_loader = old_loader

# 🔹 Route for homepage and any dynamic pages
@main.route("/", methods=["GET"])
@main.route("/<path>", methods=["GET"])
def index(path=None):
    if path == TEMPLATE_INDEX_HTML_FILE_NAME:
        return "Page not found", 404

    if not path:
        path = TEMPLATE_INDEX_HTML_FILE_NAME

    layout_key, _, _ = get_layout_data()
    html_to_render = f"{layout_key}/{path}.html"
    return render_dynamic_template(html_to_render)

# 🔹 Serve empty favicon
@main.route("/favicon.ico")
def favicon():
    return "", 304

# 🔹 Theme CSS served via Jinja2 with layout context
@main.route("/theme.css", endpoint="theme_css")
def theme_css():
    _, _, context = get_layout_data()
    return render_template("css/theme.css", **(context or {})), 200, {"Content-Type": "text/css"}

# 🔹 Optional route to set theme (only if used, else remove)
@main.route("/set-theme/<theme>")
def set_theme(theme):
    # This route is only useful if you want to change theme manually
    return redirect(request.referrer or url_for("main.index"))


