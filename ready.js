/*
 * ready
 * Watch for when an element becomes available in the DOM
 * @param {String} selector
 * @param {Function} fn
 */

(function(win){
	'use strict';
	
	var listeners = [], 
	doc = win.document, 
	MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
	observer;
	
	function ready(selector, fn){
		// Append the selector and function to an array so 
		// that it may be monitored
		listeners.push({
			selector: selector,
			fn: fn
		});
		// Create observer once
		if(!observer){
			// Watch for changes in the document including
			// all child nodes
			observer = new MutationObserver(check);
			observer.observe(doc.documentElement, {
				childList: true,
				subtree: true
			});
			// disconnect on `unload` to avoid memory leaks
			win.addEventListener('unload', observer.disconnect.bind(observer), false);
		}
		// Check elements currently in the DOM
		check();
	}
		
	// Check if any elements being watched have been 
	// added to the DOM
	function check(){
		for(var i = 0, len = listeners.length, listener, elements; i < len; i++){
			listener = listeners[i];
			// Query for elements matching the specified selector
			elements = doc.querySelectorAll(listener.selector);
			for(var j = 0, jLen = elements.length, element; j < jLen; j++){
				element = elements[j];
				// Make sure the callback isn't invoked with the 
				// same element more than once
				if(!element.ready){
					element.ready = true;
					// Invoke the callback with the element
					listener.fn.call(element, element);
				}
			}
		}
	}

	// Expose `ready`
	win.ready = ready;
	    	
})(this);