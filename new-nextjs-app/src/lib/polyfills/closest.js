// Polyfill for Element.closest() method
// This ensures compatibility across all browsers
// Only run on client side

if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector) {
      var element = this;
      
      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }
        element = element.parentElement;
      }
      
      return null;
    };
  }

  // Polyfill for Element.matches() method
  if (!Element.prototype.matches) {
    Element.prototype.matches = 
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(selector) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(selector);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }
}

export default {};