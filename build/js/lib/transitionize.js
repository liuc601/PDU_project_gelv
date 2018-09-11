define(function() {
    function Transitionize(element, props) {
        if (!(this instanceof Transitionize))
            return new Transitionize(element,props);
        this.element = element;
        this.props = props || {};
        this.init()
    }
    Transitionize.prototype.isSafari = function() {
        return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
    }
    ;
    Transitionize.prototype.init = function() {
        var transitions = [];
        for (var key in this.props) {
            transitions.push(key + " " + this.props[key])
        }
        this.element.style.transition = transitions.join(", ");
        if (this.isSafari())
            this.element.style.webkitTransition = transitions.join(", ")
    };

    return Transitionize;
});
