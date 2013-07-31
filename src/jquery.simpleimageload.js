/**
* @name             Simple Image Load
* @descripton       Determines when an image element has loaded and executes a
*                   callback function on complete.
*
* @version          0.1.0
* @requires         jQuery 1.6+
* 
*                   jQuery Simple Timer Plugin
*                   https://raw.github.com/YodaPop/jquery-simple-timer/master/
*                   jquery.simpletimer.min.js
*
* @author           Ben Gullotti
* @author-email     ben@bengullotti.com
*
* @license          MIT License -
*                   http://www.opensource.org/licenses/mit-license.php
**/

(function($) {

	// private

	/**
	 * Checks the image.complete property to see if the image had been loaded.
	 *
	 * @method _check
	 * @private
	 **/
	var _check = function() {
		// is the image completely loaded
		if ( $(this).get(0).complete ) {
			// call complete
			_load.apply(this);
		}
	},

	/**
	 * The load method executed upon completion of the simple timer. Checks to
	 * see whether the image has completed. The onLoad event fires if the image
	 * has finished loading, otherwise the onError event fires. The image load
	 * plugin is automatically destroyed.
	 *
	 * @method _load
	 * @private
	 **/
	_load = function() {
		// get the loader settings
		var settings = $(this).data('SimpleImageLoad.settings');
		// onLoad event
		settings.onLoad.apply(this);
		// destroy image load
		methods.destroy.call($(this));
	},

	/**
	 * The error method is executed in the event of an image error executed by
	 * the browser or if the image did not load within the specified duration.
	 * automatically destroyed.
	 *
	 * @method _error
	 * @private
	 **/
	_error = function() {
		// get the loader settings
		var settings = $(this).data('SimpleImageLoad.settings');
		// onError event
		settings.onError.apply(this);
		// destroy image load
		methods.destroy.call($(this));
	},

	// public

	filters = {

		/**
		 * A filter applied before the plugin is initialized. The filter checks
		 * to see that the selected element is an image.
		 *
		 * @method filters.init
		 * @param {Object} settings The settings for the plugin
		 * @return {Object} The jQuery object from which the method was called
		 **/
		init : function( options ) {
			// filter out the uninitialized
			var filtered = this.filter(function() {
				if ( !$(this).is('img') ) {
					$.error('Simple Image Load Error: the selected element ' +
						'must be an image.');

					return false;
				}

				return true;
			});

			// check filtered before proceeding
			if( filtered.length > 0 ) {
				// call method
				methods.init.call( filtered, options );
			}

			// return the jQuery object to keep the method chainable
			return this;
		},

		/**
		 * A filter applied before all methods are called. The filter ensures
		 * that all of the jQuery objects selected were initialized.
		 *
		 * @method filters.methods
		 * @param {Object} method The method about to be filtered
		 * @return {Object} The jQuery object from which the method was called
		 **/
		methods : function( method ) {
			// filter out the uninitialized
			var filtered = this.filter(function() {
				if( $(this).data('SimpleImageLoad.settings') === undefined ) {
					$.error('Simple Image Load Error: method "' + method + '" was ' +
						'called on an element which has not been initialized.');

					return false;
				}

				return true;
			});

			// check filtered before proceeding
			if( filtered.length > 0 ) {
				// call method
				methods[method].apply( filtered,
					Array.prototype.slice.call( arguments, 1 ) );
			}

			// return the jQuery object to keep the method chainable
			return this;
		},

	},

	methods = {

		/**
		 * The initialization method. Used to set the properties of the loader
		 * and attach the data to the selected jQuery objects.
		 *
		 * @method methods.init
		 * @param {Object} options An object used to set publicly accessible
		 * options such as the timer's increment, duration, and callbacks (see
		 * README.md for details)
		 * @return {Object} The jQuery object's from which the method was called
		 **/
		init : function( options ) {

			/*
			* Create some defaults. Extend them with any options that were
			* provided.
			*/
			var settings = $.extend( true, {
				increment   :   100,
				duration    :   10000,
				onLoad      :   false,
				onError     :   false,
			}, options,
			// private settings
			{
				loaded      :   false,
			});

			return this.each(function(){
				// save data
				$(this).data('SimpleImageLoad.settings', settings)
				// check periodically via the image.complete property
				.simpleTimer({
					increment       :   settings.increment,
					duration        :   settings.duration,
					autostart       :   true,
					onIncrement     :   _check,
					onComplete      :   _error,
				});
				// check via the onLoad event
				//this.onload = _check;
				// check for an image error
				//this.onerror = _error;
			});
		},

		/**
		 * Destroys the loader by deleting the settings attached to the DOM
		 * element.
		 *
		 * @method methods.destroy
		 * @return {Object} The jQuery object's from which the method was called
		 **/
		destroy : function() {
			// apply to each element
			return this.each( function() {
				// clear javascript events
				this.onload = null;
				this.onerror = null;
				// destroy the timer
				if ( $(this).data('SimpleTimer.settings') !== undefined ) {
					$(this).simpleTimer('destroy');
				}
				// remove previously stored data
				$(this).removeData('SimpleImageLoad.settings');
			});
		},

	};

	// jQuery plugin

	$.fn.simpleImageLoad = function( method ) {
		//call the methods from the methods variable
		if ( methods[method] ) {
			return filters.methods.apply( this, arguments );
		} else if ( typeof method === 'object' || ! method ) {
			return filters.init.call( this, arguments[0] );
		} else {
			$.error( 'Simple Image Load Error: method ' +  method +
				' does not exist.' );
		}
	};

})(jQuery);