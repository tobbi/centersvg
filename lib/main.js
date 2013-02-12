// Import the page-mod API
var pageMod = require("page-mod");
var data = require("self").data;
var prefs = require("sdk/simple-prefs").prefs;

pageMod.PageMod({
  include: "*",
  contentScriptFile: data.url("styles.js"),
  contentScriptWhen: "start",
  onAttach: function onAttach(worker) {
    worker.postMessage({
        centerCSSPath: data.url("styles_center.css"),
        shallCenter: prefs.centerSVGcenter,
        backgroundCSSPath: data.url("styles_background.css"),
        shallBackground: prefs.centerSVGbackground
    });
  }
});