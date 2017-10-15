var CenterSVG = {
    /**
     * Path to the CSS file packaged with this add-on
     * that contains all of the styles
     */
    cssPath: browser.runtime.getURL("data/styles.css"),

    previousWidth: 0,
    previousHeight: 0,
    previousClasses: [],

    /**
     * The current zoom level
     */
    currentZoomLevel: 1.0,

    /**
     * Show background image
     */
    showBackdrop: true,

    /**
     * Was CenterSVG init'ed?
     */
    wasInit: false,

    /**
     * Initialization function, executed on page load
     */
    init: function()
    {
        if(this.wasInit)
        {
            return;
        }
        this.saveClasses();
        this.saveSize();
        this.insertStyleSheet(this.cssPath);
        this.resizeToView();
        this.addClasses();

        // Adapt SVG's size to window size once changed:
        window.addEventListener("resize", CenterSVG.resizeToView, true);
        this.wasInit = true;
    },

    /**
     * Uninitialization function
     */
    uninit: function()
    {
        if(!this.wasInit)
        {
            return;
        }
        this.restoreSize();
        this.removeClasses();
        this.restoreClasses();

        // Remove previously added event listener:
        this.previousClasses = [];
        window.removeEventListener("resize", CenterSVG.resizeToView);
        this.wasInit = false;
    },

    /**
     * Adds relevant CSS classes to this XML file
     */
    addClasses: function() {
        let svgRoot = this.getSVGRoot();
        svgRoot.classList.add("centersvg_centered");
        if(this.showBackdrop === true)
        {
            svgRoot.classList.add("centersvg_background");
        }
    },

    /**
     * Removes the class attribute from the SVG root node.
     */
    removeClasses: function() {
        let svgRoot = this.getSVGRoot();
        svgRoot.classList.remove("centersvg_centered");
        svgRoot.classList.remove("centersvg_background");
    },

    /**
     * Saves contents of SVG root node's class attribute.
     */
    saveClasses: function() {
        let svgRoot = this.getSVGRoot();
        CenterSVG.previousClasses = svgRoot.classList;
    },

    /**
     * Restores the previous content of the class attribute.
     */
    restoreClasses: function() {
        if(CenterSVG.previousClasses === null || CenterSVG.previousClasses.length === 0)
        {
            return;
        }
        let svgRoot = this.getSVGRoot();
        svgRoot.classList = CenterSVG.previousClasses;
    },

    /**
     * Returns the SVG root element
     * @returns The SVG root tag
     */
    getSVGRoot: function() {
        return document.getElementsByTagName("svg")[0] || null;
    },

    /**
     * Inserts a stylesheet into the current SVG document
     * @param path The Path to the stylesheet to insert
     */
    insertStyleSheet: function(path)
    {
        let attributes = "href=\"" + path + "\" type=\"text/css\"";
        let newPI = document.createProcessingInstruction("xml-stylesheet", attributes);
        document.insertBefore(newPI, document.firstChild);
    },

    /**
     * Saves the previous size of the SVG root element
     */
    saveSize: function()
    {
        let svgRoot = CenterSVG.getSVGRoot();
        CenterSVG.previousHeight = svgRoot.getAttribute("height");
        CenterSVG.previousWidth = svgRoot.getAttribute("width");
    },

    /**
     * Restores the previous size of the SVG root element
     */
    restoreSize: function() {
        let svgRoot = CenterSVG.getSVGRoot();
        if(CenterSVG.previousHeight === 0 || CenterSVG.previousWidth === 0)
        {
            return;
        }
        svgRoot.setAttribute("height", CenterSVG.previousHeight);
        svgRoot.setAttribute("width", CenterSVG.previousWidth);
    },

    /**
     * Resizes the SVG file to the current visible viewport
     */
    resizeToView: function() {
        var svgRoot = CenterSVG.getSVGRoot();
        var zoomLevel = CenterSVG.currentZoomLevel;
        svgRoot.setAttribute("height", zoomLevel * window.innerHeight + "px");
        svgRoot.setAttribute("width", zoomLevel * window.innerWidth + "px");
    },

}

browser.storage.onChanged.addListener(function(changes) {
    if(changes["centersvg_show_backdrop"] !== undefined)
    {
        CenterSVG.showBackdrop = changes["centersvg_show_backdrop"].newValue;
        CenterSVG.restoreClasses();
        if(CenterSVG.showBackdrop === true)
        {
            CenterSVG.addClasses();
        }
    }
    if(changes["centersvg_zoom_level"] !== undefined)
    {
        CenterSVG.currentZoomLevel = changes["centersvg_zoom_level"].newValue;
        CenterSVG.resizeToView();
    }
    if(changes["centersvg_fit_to_page"] !== undefined)
    {
        if(changes["centersvg_fit_to_page"].newValue === true)
        {
          CenterSVG.currentZoomLevel = 1.0;
          CenterSVG.resizeToView();
        }
    }
    if(changes["centersvg_enabled"] !== undefined)
    {
       var enabled = changes["centersvg_enabled"].newValue;
       if(enabled)
       {
           CenterSVG.init();
       }
       else
       {
           CenterSVG.uninit();
       }
    }
});

browser.runtime.sendMessage({reason: "request_state"});
browser.runtime.onMessage.addListener(function(m) {
    if(m.reason == "state_change")
    {
      if(m.show_backdrop !== undefined)
      {
        CenterSVG.showBackdrop = m.show_backdrop;
      }
      if(m.zoom_level)
      {
          CenterSVG.currentZoomLevel = m.zoom_level;
      }
      if(m.enabled)
      {
        CenterSVG.init();
      }
      else
      {
        CenterSVG.uninit();
      }
    }
});