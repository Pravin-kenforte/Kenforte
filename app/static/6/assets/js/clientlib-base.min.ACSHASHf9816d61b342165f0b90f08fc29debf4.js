(function (document) {
    window.CMP = window.CMP || {}; window.CMP.utils = function () {
        var NS = "cmp"; var readData = function (element, is) {
            var data = element.dataset; var options = []; var capitalized = is; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var reserved = ["is", "hook" + capitalized]; for (var key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key]; if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length); key = key.charAt(0).toLowerCase() + key.substring(1); if (reserved.indexOf(key) ===
                        -1) options[key] = value
                }
            } return options
        }; var setupProperties = function (options, properties) { var transformedProperties = {}; for (var key in properties) if (Object.prototype.hasOwnProperty.call(properties, key)) { var property = properties[key]; if (options && options[key] != null) if (property && typeof property.transform === "function") transformedProperties[key] = property.transform(options[key]); else transformedProperties[key] = options[key]; else transformedProperties[key] = properties[key]["default"] } return transformedProperties };
        return { readData: readData, setupProperties: setupProperties }
    }()
})(window.document);
(function () {
    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined; if (!containerUtils) console.warn("Tabs: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page."); var dataLayerEnabled; var dataLayer; var NS = "cmp"; var IS =
        "carousel"; var keyCodes = { SPACE: 32, END: 35, HOME: 36, ARROW_LEFT: 37, ARROW_UP: 38, ARROW_RIGHT: 39, ARROW_DOWN: 40 }; var selectors = { self: "[data-" + NS + '-is\x3d"' + IS + '"]' }; var properties = { "autoplay": { "default": false, "transform": function (value) { return !(value === null || typeof value === "undefined") } }, "delay": { "default": 5E3, "transform": function (value) { value = parseFloat(value); return !isNaN(value) ? value : null } }, "autopauseDisabled": { "default": false, "transform": function (value) { return !(value === null || typeof value === "undefined") } } };
    function Carousel(config) {
        var that = this; if (config && config.element) init(config); function init(config) {
            that._config = config; config.element.removeAttribute("data-" + NS + "-is"); setupProperties(config.options); cacheElements(config.element); that._active = 0; that._paused = false; if (that._elements.item) { initializeActive(); bindEvents(); resetAutoplayInterval(); refreshPlayPauseActions(); scrollToDeepLinkIdInCarousel() } if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                window.CQ = window.CQ ||
                    {}; window.CQ.CoreComponents = window.CQ.CoreComponents || {}; window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window); window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function (message) { if (message.data && message.data.type === "cmp-carousel" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) if (message.data.operation === "navigate") navigate(message.data.index) })
            }
        } function scrollToDeepLinkIdInCarousel() {
            if (containerUtils) {
                var deepLinkItemIdx =
                    containerUtils.getDeepLinkItemIdx(that, "item", "item"); if (deepLinkItemIdx > -1) { var deepLinkItem = that._elements["item"][deepLinkItemIdx]; if (deepLinkItem && that._elements["item"][that._active].id !== deepLinkItem.id) { navigateAndFocusIndicator(deepLinkItemIdx, true); pause() } var hashId = window.location.hash.substring(1); if (hashId) { var hashItem = document.querySelector("[id\x3d'" + hashId + "']"); if (hashItem) hashItem.scrollIntoView() } }
            }
        } function cacheElements(wrapper) {
            that._elements = {}; that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]"); for (var i = 0; i < hooks.length; i++) { var hook = hooks[i]; var capitalized = IS; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var key = hook.dataset[NS + "Hook" + capitalized]; if (that._elements[key]) { if (!Array.isArray(that._elements[key])) { var tmp = that._elements[key]; that._elements[key] = [tmp] } that._elements[key].push(hook) } else that._elements[key] = hook }
        } function setupProperties(options) {
            that._properties = {}; for (var key in properties) if (Object.prototype.hasOwnProperty.call(properties,
                key)) { var property = properties[key]; var value = null; if (options && options[key] != null) { value = options[key]; if (property && typeof property.transform === "function") value = property.transform(value) } if (value === null) value = properties[key]["default"]; that._properties[key] = value }
        } function bindEvents() {
            window.addEventListener("hashchange", scrollToDeepLinkIdInCarousel, false); if (that._elements["previous"]) that._elements["previous"].addEventListener("click", function () {
                var index = getPreviousIndex(); navigate(index); if (dataLayerEnabled) dataLayer.push({
                    event: "cmp:show",
                    eventInfo: { path: "component." + getDataLayerId(that._elements.item[index]) }
                })
            }); if (that._elements["next"]) that._elements["next"].addEventListener("click", function () { var index = getNextIndex(); navigate(index); if (dataLayerEnabled) dataLayer.push({ event: "cmp:show", eventInfo: { path: "component." + getDataLayerId(that._elements.item[index]) } }) }); var indicators = that._elements["indicator"]; if (indicators) for (var i = 0; i < indicators.length; i++)(function (index) {
                indicators[i].addEventListener("click", function (event) {
                    navigateAndFocusIndicator(index);
                    pause()
                })
            })(i); if (that._elements["pause"]) if (that._properties.autoplay) that._elements["pause"].addEventListener("click", onPauseClick); if (that._elements["play"]) if (that._properties.autoplay) that._elements["play"].addEventListener("click", onPlayClick); that._elements.self.addEventListener("keydown", onKeyDown); if (!that._properties.autopauseDisabled) { that._elements.self.addEventListener("mouseenter", onMouseEnter); that._elements.self.addEventListener("mouseleave", onMouseLeave) } var items = that._elements["item"];
            if (items) for (var j = 0; j < items.length; j++) { items[j].addEventListener("focusin", onMouseEnter); items[j].addEventListener("focusout", onMouseLeave) }
        } function onKeyDown(event) {
            var index = that._active; var lastIndex = that._elements["indicator"].length - 1; switch (event.keyCode) {
                case keyCodes.ARROW_LEFT: case keyCodes.ARROW_UP: event.preventDefault(); if (index > 0) navigateAndFocusIndicator(index - 1); break; case keyCodes.ARROW_RIGHT: case keyCodes.ARROW_DOWN: event.preventDefault(); if (index < lastIndex) navigateAndFocusIndicator(index +
                    1); break; case keyCodes.HOME: event.preventDefault(); navigateAndFocusIndicator(0); break; case keyCodes.END: event.preventDefault(); navigateAndFocusIndicator(lastIndex); break; case keyCodes.SPACE: if (that._properties.autoplay && (event.target !== that._elements["previous"] && event.target !== that._elements["next"])) { event.preventDefault(); if (!that._paused) pause(); else play() } if (event.target === that._elements["pause"]) that._elements["play"].focus(); if (event.target === that._elements["play"]) that._elements["pause"].focus();
                    break; default: return
            }
        } function onMouseEnter(event) { clearAutoplayInterval() } function onMouseLeave(event) { resetAutoplayInterval() } function onPauseClick(event) { pause(); that._elements["play"].focus() } function onPlayClick() { play(); that._elements["pause"].focus() } function pause() { that._paused = true; clearAutoplayInterval(); refreshPlayPauseActions() } function play() {
            that._paused = false; var hovered = false; if (that._elements.self.parentElement) hovered = that._elements.self.parentElement.querySelector(":hover") ===
                that._elements.self; if (that._properties.autopauseDisabled || !hovered) resetAutoplayInterval(); refreshPlayPauseActions()
        } function refreshPlayPauseActions() { setActionDisabled(that._elements["pause"], that._paused); setActionDisabled(that._elements["play"], !that._paused) } function initializeActive() { var items = that._elements["item"]; if (items && Array.isArray(items)) for (var i = 0; i < items.length; i++)if (items[i].classList.contains("cmp-carousel__item--active")) { that._active = i; break } } function refreshActive() {
            var items =
                that._elements["item"]; var indicators = that._elements["indicator"]; if (items) if (Array.isArray(items)) for (var i = 0; i < items.length; i++)if (i === parseInt(that._active)) { items[i].classList.add("cmp-carousel__item--active"); items[i].removeAttribute("aria-hidden"); indicators[i].classList.add("cmp-carousel__indicator--active"); indicators[i].setAttribute("aria-selected", true); indicators[i].setAttribute("tabindex", "0") } else {
                    items[i].classList.remove("cmp-carousel__item--active"); items[i].setAttribute("aria-hidden",
                        true); indicators[i].classList.remove("cmp-carousel__indicator--active"); indicators[i].setAttribute("aria-selected", false); indicators[i].setAttribute("tabindex", "-1")
                } else { items.classList.add("cmp-carousel__item--active"); indicators.classList.add("cmp-carousel__indicator--active") }
        } function focusWithoutScroll(element) { var x = window.scrollX || window.pageXOffset; var y = window.scrollY || window.pageYOffset; element.focus(); window.scrollTo(x, y) } function getNextIndex() {
            return that._active === that._elements["item"].length -
                1 ? 0 : that._active + 1
        } function getPreviousIndex() { return that._active === 0 ? that._elements["item"].length - 1 : that._active - 1 } function navigate(index, keepHash) {
            if (index < 0 || index > that._elements["item"].length - 1) return; that._active = index; refreshActive(); if (!keepHash && containerUtils) containerUtils.updateUrlHash(that, "item", index); if (dataLayerEnabled) {
                var carouselId = that._elements.self.id; var activeItem = getDataLayerId(that._elements.item[index]); var updatePayload = { component: {} }; updatePayload.component[carouselId] =
                    { shownItems: [activeItem] }; var removePayload = { component: {} }; removePayload.component[carouselId] = { shownItems: undefined }; dataLayer.push(removePayload); dataLayer.push(updatePayload)
            } if (that._elements.self.parentElement) if (that._elements.self.parentElement.querySelector(":hover") !== that._elements.self) resetAutoplayInterval()
        } function navigateAndFocusIndicator(index, keepHash) {
            navigate(index, keepHash); focusWithoutScroll(that._elements["indicator"][index]); if (dataLayerEnabled) dataLayer.push({
                event: "cmp:show",
                eventInfo: { path: "component." + getDataLayerId(that._elements.item[index]) }
            })
        } function resetAutoplayInterval() {
            if (that._paused || !that._properties.autoplay) return; clearAutoplayInterval(); that._autoplayIntervalId = window.setInterval(function () { if (document.visibilityState && document.hidden) return; var indicators = that._elements["indicators"]; if (indicators !== document.activeElement && indicators.contains(document.activeElement)) navigateAndFocusIndicator(getNextIndex(), true); else navigate(getNextIndex(), true) },
                that._properties.delay)
        } function clearAutoplayInterval() { window.clearInterval(that._autoplayIntervalId); that._autoplayIntervalId = null } function setActionDisabled(action, disable) { if (!action) return; if (disable !== false) { action.disabled = true; action.classList.add("cmp-carousel__action--disabled") } else { action.disabled = false; action.classList.remove("cmp-carousel__action--disabled") } }
    } function getDataLayerId(item) {
        if (item) if (item.dataset.cmpDataLayer) return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
        else return item.id; return null
    } function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled"); dataLayer = dataLayerEnabled ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined; var elements = document.querySelectorAll(selectors.self); for (var i = 0; i < elements.length; i++)new Carousel({ element: elements[i], options: CMP.utils.readData(elements[i], IS) }); var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; var body = document.querySelector("body");
        var observer = new MutationObserver(function (mutations) { mutations.forEach(function (mutation) { var nodesArray = [].slice.call(mutation.addedNodes); if (nodesArray.length > 0) nodesArray.forEach(function (addedNode) { if (addedNode.querySelectorAll) { var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self)); elementsArray.forEach(function (element) { new Carousel({ element: element, options: CMP.utils.readData(element, IS) }) }) } }) }) }); observer.observe(body, { subtree: true, childList: true, characterData: true })
    }
    var documentReady = document.readyState !== "loading" ? Promise.resolve() : new Promise(function (resolve) { document.addEventListener("DOMContentLoaded", resolve) }); Promise.all([documentReady]).then(onDocumentReady); if (containerUtils) window.addEventListener("load", containerUtils.scrollToAnchor, false)
})();
if (window.Element && !Element.prototype.closest) Element.prototype.closest = function (s) { var matches = (this.document || this.ownerDocument).querySelectorAll(s); var el = this; var i; do { i = matches.length; while (--i >= 0 && matches.item(i) !== el); } while (i < 0 && (el = el.parentElement)); return el };
if (window.Element && !Element.prototype.matches) Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) { var matches = (this.document || this.ownerDocument).querySelectorAll(s); var i = matches.length; while (--i >= 0 && matches.item(i) !== this); return i > -1 };
if (!Object.assign) Object.assign = function (target, varArgs) { if (target === null) throw new TypeError("Cannot convert undefined or null to object"); var to = Object(target); for (var index = 1; index < arguments.length; index++) { var nextSource = arguments[index]; if (nextSource !== null) for (var nextKey in nextSource) if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) to[nextKey] = nextSource[nextKey] } return to };
(function (arr) { arr.forEach(function (item) { if (Object.prototype.hasOwnProperty.call(item, "remove")) return; Object.defineProperty(item, "remove", { configurable: true, enumerable: true, writable: true, value: function remove() { this.parentNode.removeChild(this) } }) }) })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
(function (document) {
    window.CMP = window.CMP || {}; window.CMP.utils = function () {
        var NS = "cmp"; var readData = function (element, is) {
            var data = element.dataset; var options = []; var capitalized = is; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var reserved = ["is", "hook" + capitalized]; for (var key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key]; if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length); key = key.charAt(0).toLowerCase() + key.substring(1); if (reserved.indexOf(key) ===
                        -1) options[key] = value
                }
            } return options
        }; var setupProperties = function (options, properties) { var transformedProperties = {}; for (var key in properties) if (Object.prototype.hasOwnProperty.call(properties, key)) { var property = properties[key]; if (options && options[key] != null) if (property && typeof property.transform === "function") transformedProperties[key] = property.transform(options[key]); else transformedProperties[key] = options[key]; else transformedProperties[key] = properties[key]["default"] } return transformedProperties };
        return { readData: readData, setupProperties: setupProperties }
    }()
})(window.document);
(function (document) {
    window.CMP = window.CMP || {}; window.CMP.image = window.CMP.image || {}; window.CMP.image.dynamicMedia = function () {
        var autoSmartCrops = {}; var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}"; var SRC_URI_TEMPLATE_DPR_VAR = "{dpr}"; var SRC_URI_DPR_OFF = "dpr\x3doff"; var SRC_URI_DPR_ON = "dpr\x3don,{dpr}"; var dpr = window.devicePixelRatio || 1; var config = { minWidth: 20 }; var getAutoSmartCrops = function (src) {
            var request = new XMLHttpRequest; var url = src.split(SRC_URI_TEMPLATE_WIDTH_VAR)[0] + "?req\x3dset,json"; request.open("GET",
                url, false); request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                        var responseText = request.responseText; var rePayload = new RegExp(/^(?:\/\*jsonp\*\/)?\s*([^()]+)\(([\s\S]+),\s*"[0-9]*"\);?$/gmi); var rePayloadJSON = new RegExp(/^{[\s\S]*}$/gmi); var resPayload = rePayload.exec(responseText); var payload; if (resPayload) { var payloadStr = resPayload[2]; if (rePayloadJSON.test(payloadStr)) payload = JSON.parse(payloadStr) } if (payload && payload.set.relation && payload.set.relation.length > 0) for (var i = 0; i < payload.set.relation.length; i++)autoSmartCrops[parseInt(payload.set.relation[i].userdata.SmartCropWidth)] =
                            ":" + payload.set.relation[i].userdata.SmartCropDef
                    } else;
                }; request.send(); return autoSmartCrops
        }; var getSrcSet = function (src, smartCrops) { var srcset; var keys = Object.keys(smartCrops); if (keys.length > 0) { srcset = []; for (var key in autoSmartCrops) srcset.push(src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, smartCrops[key]) + " " + key + "w") } return srcset.join(",") }; function getOptimalWidth(sizes, width) {
            var len = sizes.length; var key = 0; while (key < len - 1 && sizes[key] < width) key++; return sizes[key] !== undefined ? sizes[key].toString() :
                width
        } var getWidth = function (component, parent) { var width = component.offsetWidth; while (width < config.minWidth && parent && !component._autoWidth) { width = parent.offsetWidth; parent = parent.parentNode } return width }; var setDMAttributes = function (component, properties) {
            var src = properties.src.replace(SRC_URI_DPR_OFF, SRC_URI_DPR_ON); src = src.replace(SRC_URI_TEMPLATE_DPR_VAR, dpr); var smartCrops = {}; var width; if (properties["smartcroprendition"] === "SmartCrop:Auto") smartCrops = getAutoSmartCrops(src); var hasWidths = properties.widths &&
                properties.widths.length > 0 || Object.keys(smartCrops).length > 0; if (hasWidths) {
                    var image = component.querySelector("img"); var elemWidth = getWidth(component, component.parentNode); if (properties["smartcroprendition"] === "SmartCrop:Auto") { image.setAttribute("srcset", CMP.image.dynamicMedia.getSrcSet(src, smartCrops)); width = getOptimalWidth(Object.keys(smartCrops, elemWidth)); image.setAttribute("src", CMP.image.dynamicMedia.getSrc(src, smartCrops[width])) } else {
                        width = getOptimalWidth(properties.widths, elemWidth); image.setAttribute("src",
                            CMP.image.dynamicMedia.getSrc(src, width))
                    }
                }
        }; var getSrc = function (src, width) { if (src.indexOf(SRC_URI_TEMPLATE_WIDTH_VAR) > -1) src = src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, width); return src }; return { getAutoSmartCrops: getAutoSmartCrops, getSrcSet: getSrcSet, getSrc: getSrc, setDMAttributes: setDMAttributes, getWidth: getWidth }
    }(); document.dispatchEvent(new CustomEvent("core.wcm.components.commons.site.image.dynamic-media.loaded"))
})(window.document);
(function () {
    var NS = "cmp"; var IS = "image"; var EMPTY_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; var LAZY_THRESHOLD_DEFAULT = 0; var SRC_URI_TEMPLATE_WIDTH_VAR = "{.width}"; var SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY = "width\x3d{width}"; var SRC_URI_TEMPLATE_DPR_VAR = "{dpr}"; var selectors = { self: "[data-" + NS + '-is\x3d"' + IS + '"]', image: '[data-cmp-hook-image\x3d"image"]', map: '[data-cmp-hook-image\x3d"map"]', area: '[data-cmp-hook-image\x3d"area"]' }; var lazyLoader = {
        "cssClass": "cmp-image__image--is-loading",
        "style": { "height": 0, "padding-bottom": "" }
    }; var properties = {
        "widths": { "default": [], "transform": function (value) { var widths = []; value.split(",").forEach(function (item) { item = parseFloat(item); if (!isNaN(item)) widths.push(item) }); return widths } }, "lazy": { "default": false, "transform": function (value) { return !(value === null || typeof value === "undefined") } }, "dmimage": { "default": false, "transform": function (value) { return !(value === null || typeof value === "undefined") } }, "lazythreshold": {
            "default": 0, "transform": function (value) {
                var val =
                    parseInt(value); if (isNaN(val)) return LAZY_THRESHOLD_DEFAULT; return val
            }
        }, "src": { "transform": function (value) { return decodeURIComponent(value) } }
    }; var devicePixelRatio = window.devicePixelRatio || 1; function Image(config) {
        var that = this; var smartCrops = {}; var useAssetDelivery = false; var srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR; function init(config) {
            config.element.removeAttribute("data-" + NS + "-is"); if (config.options.src && config.options.src.indexOf(SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY) >= 0) {
                useAssetDelivery =
                true; srcUriTemplateWidthVar = SRC_URI_TEMPLATE_WIDTH_VAR_ASSET_DELIVERY
            } that._properties = CMP.utils.setupProperties(config.options, properties); cacheElements(config.element); if (config.options.src && Object.prototype.hasOwnProperty.call(config.options, "dmimage") && config.options["smartcroprendition"] === "SmartCrop:Auto") smartCrops = CMP.image.dynamicMedia.getAutoSmartCrops(config.options.src); if (!that._elements.noscript) return; that._elements.container = that._elements.link ? that._elements.link : that._elements.self;
            unwrapNoScript(); if (that._properties.lazy) addLazyLoader(); if (that._elements.map) that._elements.image.addEventListener("load", onLoad); window.addEventListener("resize", onWindowResize);["focus", "click", "load", "transitionend", "animationend", "scroll"].forEach(function (name) { document.addEventListener(name, that.update) }); that._elements.image.addEventListener("cmp-image-redraw", that.update); that._interSectionObserver = new IntersectionObserver(function (entries, interSectionObserver) {
                entries.forEach(function (entry) {
                    if (entry.intersectionRatio >
                        0) that.update()
                })
            }); that._interSectionObserver.observe(that._elements.self); that.update()
        } function loadImage() {
            var hasWidths = that._properties.widths && that._properties.widths.length > 0 || Object.keys(smartCrops).length > 0; var replacement; if (Object.keys(smartCrops).length > 0) { var optimalWidth = getOptimalWidth(Object.keys(smartCrops), false); replacement = smartCrops[optimalWidth] } else replacement = hasWidths ? (that._properties.dmimage ? "" : ".") + getOptimalWidth(that._properties.widths, true) : ""; if (useAssetDelivery) replacement =
                replacement !== "" ? "width\x3d" + replacement.substring(1) : ""; var url = that._properties.src.replace(srcUriTemplateWidthVar, replacement); url = url.replace(SRC_URI_TEMPLATE_DPR_VAR, devicePixelRatio); var imgSrcAttribute = that._elements.image.getAttribute("src"); if (url !== imgSrcAttribute) if (imgSrcAttribute === null || imgSrcAttribute === EMPTY_PIXEL) that._elements.image.setAttribute("src", url); else {
                    var urlTemplateParts = that._properties.src.split(srcUriTemplateWidthVar); var isImageRefSame = imgSrcAttribute.startsWith(urlTemplateParts[0]);
                    if (isImageRefSame && urlTemplateParts.length > 1) isImageRefSame = imgSrcAttribute.endsWith(urlTemplateParts[urlTemplateParts.length - 1]); if (isImageRefSame) { that._elements.image.setAttribute("src", url); if (!hasWidths) window.removeEventListener("scroll", that.update) }
                } if (that._lazyLoaderShowing) that._elements.image.addEventListener("load", removeLazyLoader); that._interSectionObserver.unobserve(that._elements.self)
        } function getOptimalWidth(widths, useDevicePixelRatio) {
            var container = that._elements.self; var containerWidth =
                container.clientWidth; while (containerWidth === 0 && container.parentNode) { container = container.parentNode; containerWidth = container.clientWidth } var dpr = useDevicePixelRatio ? devicePixelRatio : 1; var optimalWidth = containerWidth * dpr; var len = widths.length; var key = 0; while (key < len - 1 && widths[key] < optimalWidth) key++; return widths[key].toString()
        } function addLazyLoader() {
            var width = that._elements.image.getAttribute("width"); var height = that._elements.image.getAttribute("height"); if (width && height) {
                var ratio = height / width *
                    100; var styles = lazyLoader.style; styles["padding-bottom"] = ratio + "%"; for (var s in styles) if (Object.prototype.hasOwnProperty.call(styles, s)) that._elements.image.style[s] = styles[s]
            } that._elements.image.setAttribute("src", EMPTY_PIXEL); that._elements.image.classList.add(lazyLoader.cssClass); that._lazyLoaderShowing = true
        } function unwrapNoScript() {
            var markup = decodeNoscript(that._elements.noscript.textContent.trim()); var parser = new DOMParser; var temporaryDocument = parser.parseFromString(markup, "text/html");
            var imageElement = temporaryDocument.querySelector(selectors.image); imageElement.removeAttribute("src"); that._elements.container.insertBefore(imageElement, that._elements.noscript); var mapElement = temporaryDocument.querySelector(selectors.map); if (mapElement) that._elements.container.insertBefore(mapElement, that._elements.noscript); that._elements.noscript.parentNode.removeChild(that._elements.noscript); if (that._elements.container.matches(selectors.image)) that._elements.image = that._elements.container; else that._elements.image =
                that._elements.container.querySelector(selectors.image); that._elements.map = that._elements.container.querySelector(selectors.map); that._elements.areas = that._elements.container.querySelectorAll(selectors.area)
        } function removeLazyLoader() {
            that._elements.image.classList.remove(lazyLoader.cssClass); for (var property in lazyLoader.style) if (Object.prototype.hasOwnProperty.call(lazyLoader.style, property)) that._elements.image.style[property] = ""; that._elements.image.removeEventListener("load", removeLazyLoader);
            that._lazyLoaderShowing = false
        } function isLazyVisible() { if (that._elements.container.offsetParent === null) return false; var wt = window.pageYOffset; var wb = wt + document.documentElement.clientHeight; var et = that._elements.container.getBoundingClientRect().top + wt; var eb = et + that._elements.container.clientHeight; return eb >= wt - that._properties.lazythreshold && et <= wb + that._properties.lazythreshold } function resizeAreas() {
            if (that._elements.areas && that._elements.areas.length > 0) for (var i = 0; i < that._elements.areas.length; i++) {
                var width =
                    that._elements.image.width; var height = that._elements.image.height; if (width && height) { var relcoords = that._elements.areas[i].dataset.cmpRelcoords; if (relcoords) { var relativeCoordinates = relcoords.split(","); var coordinates = new Array(relativeCoordinates.length); for (var j = 0; j < coordinates.length; j++)if (j % 2 === 0) coordinates[j] = parseInt(relativeCoordinates[j] * width); else coordinates[j] = parseInt(relativeCoordinates[j] * height); that._elements.areas[i].coords = coordinates } }
            }
        } function cacheElements(wrapper) {
            that._elements =
            {}; that._elements.self = wrapper; var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]"); for (var i = 0; i < hooks.length; i++) { var hook = hooks[i]; var capitalized = IS; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var key = hook.dataset[NS + "Hook" + capitalized]; that._elements[key] = hook }
        } function onWindowResize() { that.update(); resizeAreas() } function onLoad() { resizeAreas() } that.update = function () { if (that._properties.lazy) { if (isLazyVisible()) loadImage() } else loadImage() }; if (config &&
            config.element) init(config)
    } function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self); for (var i = 0; i < elements.length; i++)new Image({ element: elements[i], options: CMP.utils.readData(elements[i], IS) }); var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; var body = document.querySelector("body"); var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) nodesArray.forEach(function (addedNode) { if (addedNode.querySelectorAll) { var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self)); elementsArray.forEach(function (element) { new Image({ element: element, options: CMP.utils.readData(element, IS) }) }) } })
            })
        }); observer.observe(body, { subtree: true, childList: true, characterData: true })
    } var documentReady = document.readyState !== "loading" ? Promise.resolve() : new Promise(function (resolve) {
        document.addEventListener("DOMContentLoaded",
            resolve)
    }); Promise.all([documentReady]).then(onDocumentReady); function decodeNoscript(text) { text = text.replace(/&(amp;)*lt;/g, "\x3c"); text = text.replace(/&(amp;)*gt;/g, "\x3e"); return text }
})();
(function () {
    var NS = "cmp"; var IS = "formText"; var IS_DASH = "form-text"; var selectors = { self: "[data-" + NS + '-is\x3d"' + IS + '"]' }; var properties = { constraintMessage: "", requiredMessage: "" }; function readData(element) {
        var data = element.dataset; var options = []; var capitalized = IS; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var reserved = ["is", "hook" + capitalized]; for (var key in data) if (Object.prototype.hasOwnProperty.call(data, key)) {
            var value = data[key]; if (key.indexOf(NS) === 0) {
                key = key.slice(NS.length);
                key = key.charAt(0).toLowerCase() + key.substring(1); if (reserved.indexOf(key) === -1) options[key] = value
            }
        } return options
    } function FormText(config) { if (config.element) config.element.removeAttribute("data-" + NS + "-is"); this._cacheElements(config.element); this._setupProperties(config.options); this._elements.input.addEventListener("invalid", this._onInvalid.bind(this)); this._elements.input.addEventListener("input", this._onInput.bind(this)) } FormText.prototype._onInvalid = function (event) {
        event.target.setCustomValidity("");
        if (event.target.validity.typeMismatch) { if (this._properties.constraintMessage) event.target.setCustomValidity(this._properties.constraintMessage) } else if (event.target.validity.valueMissing) if (this._properties.requiredMessage) event.target.setCustomValidity(this._properties.requiredMessage)
    }; FormText.prototype._onInput = function (event) { event.target.setCustomValidity("") }; FormText.prototype._cacheElements = function (wrapper) {
        this._elements = {}; this._elements.self = wrapper; var hooks = this._elements.self.querySelectorAll("[data-" +
            NS + "-hook-" + IS_DASH + "]"); for (var i = 0; i < hooks.length; i++) { var hook = hooks[i]; var capitalized = IS; capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1); var key = hook.dataset[NS + "Hook" + capitalized]; this._elements[key] = hook }
    }; FormText.prototype._setupProperties = function (options) {
        this._properties = {}; for (var key in properties) if (Object.prototype.hasOwnProperty.call(properties, key)) {
            var property = properties[key]; if (options && options[key] != null) if (property && typeof property.transform === "function") this._properties[key] =
                property.transform(options[key]); else this._properties[key] = options[key]; else this._properties[key] = properties[key]["default"]
        }
    }; function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self); for (var i = 0; i < elements.length; i++)new FormText({ element: elements[i], options: readData(elements[i]) }); var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; var body = document.querySelector("body"); var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var nodesArray =
                    [].slice.call(mutation.addedNodes); if (nodesArray.length > 0) nodesArray.forEach(function (addedNode) { if (addedNode.querySelectorAll) { var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self)); elementsArray.forEach(function (element) { new FormText({ element: element, options: readData(element) }) }) } })
            })
        }); observer.observe(body, { subtree: true, childList: true, characterData: true })
    } if (document.readyState !== "loading") onDocumentReady(); else document.addEventListener("DOMContentLoaded", onDocumentReady)
})();
(function () {
    var NS = "cmp"; var IS = "pdfviewer"; var SDK_URL = "https://documentservices.adobe.com/view-sdk/viewer.js"; var SDK_READY_EVENT = "adobe_dc_view_sdk.ready"; var selectors = { self: "[data-" + NS + '-is\x3d"' + IS + '"]', sdkScript: 'script[src\x3d"' + SDK_URL + '"]' }; function initSDK() { var sdkIncluded = document.querySelectorAll(selectors.sdkScript).length > 0; if (!window.adobe_dc_view_sdk && !sdkIncluded) { var dcv = document.createElement("script"); dcv.type = "text/javascript"; dcv.src = SDK_URL; document.body.appendChild(dcv) } }
    function previewPdf(component) { component.removeAttribute("data-" + NS + "-is"); initSDK(); if (component.dataset && component.id) if (window.AdobeDC && window.AdobeDC.View) dcView(component); else document.addEventListener(SDK_READY_EVENT, function () { dcView(component) }) } function dcView(component) {
        var adobeDCView = new window.AdobeDC.View({ clientId: component.dataset.cmpClientId, divId: component.id + "-content", reportSuiteId: component.dataset.cmpReportSuiteId }); adobeDCView.previewFile({
            content: { location: { url: component.dataset.cmpDocumentPath } },
            metaData: { fileName: component.dataset.cmpDocumentFileName }
        }, JSON.parse(component.dataset.cmpViewerConfigJson))
    } function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self); for (var i = 0; i < elements.length; i++)previewPdf(elements[i]); var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver; var body = document.querySelector("body"); var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) nodesArray.forEach(function (addedNode) { if (addedNode.querySelectorAll) { var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self)); elementsArray.forEach(function (element) { previewPdf(element) }) } })
            })
        }); observer.observe(body, { subtree: true, childList: true, characterData: true })
    } if (document.readyState !== "loading") onDocumentReady(); else document.addEventListener("DOMContentLoaded", onDocumentReady)
})();