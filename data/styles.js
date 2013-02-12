var svgns = "http://www.w3.org/2000/svg";
var xhtmlns = "http://www.w3.org/1999/xhtml";
self.on("message", function(settings) {
  var head = document.getElementsByTagName("svg")[0];
  if(!head) return;
  var xmlnsAttr = head.getAttribute("xmlns");
  if(xmlnsAttr != svgns) return;
  if(settings.shallCenter) {
      var linkElm = document.createElementNS(xhtmlns, "link");
      linkElm.setAttribute("href", settings.centerCSSPath);
      linkElm.setAttribute("type", "text/css");
      linkElm.setAttribute("rel", "stylesheet");
      head.appendChild(linkElm);
  }
  if(settings.shallBackground) {
      var linkElm = document.createElementNS(xhtmlns, "link");
      linkElm.setAttribute("href", settings.backgroundCSSPath);
      linkElm.setAttribute("type", "text/css");
      linkElm.setAttribute("rel", "stylesheet");
      head.appendChild(linkElm);
  }
});