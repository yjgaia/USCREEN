/**
 * SURFACE(Dom or Canvas) class
 */
USCREEN.SURFACE = CLASS({

	preset : function() {'use strict';

		var
		// is on canvas
		isOnCanvas = (BROWSER_CONFIG.USCREEN === undefined || BROWSER_CONFIG.USCREEN.isLayerOnCanvas === true);

		return isOnCanvas === true ? CANVAS : DIV;
	},

	init : function(inner, self, params) {'use strict';
		//OPTIONAL: params
		//OPTIONAL: params.scale
		//OPTIONAL: params.canvasScale

		var
		// is on canvas
		isOnCanvas = (BROWSER_CONFIG.USCREEN === undefined || BROWSER_CONFIG.USCREEN.isLayerOnCanvas === true),

		// is support hd
		isSupportingHD = BROWSER_CONFIG.isSupportingHD === true && INFO.checkIsDisplayHD() === true,

		// scale
		scale = params === undefined || params.scale === undefined ? 1 : params.scale,

		// canvas scale
		canvasScale = params === undefined || params.canvasScale === undefined ? 1 : params.canvasScale,

		// width
		width,

		// height
		height,

		// set size.
		setSize,

		// set scale.
		setScale,

		// get canvas scale.
		getCanvasScale;

		if (isOnCanvas === true) {

			if (isSupportingHD === true) {
				canvasScale *= 2;
			}

			OVERRIDE(self.setSize, function(origin) {

				self.setSize = setSize = function(size) {
					//REQUIRED: size
					//REQUIRED: size.width
					//REQUIRED: size.height

					width = size.width;
					height = size.height;

					origin({
						width : width * canvasScale,
						height : height * canvasScale
					});
					self.addStyle({
						width : width * scale,
						height : height * scale
					});
				};
			});

			if (canvasScale !== 1) {
				self.getContext().setScale({
					scaleWidth : canvasScale,
					scaleHeight : canvasScale
				});
			}

			self.setScale = setScale = function(newScale) {
				//REQUIRED: newScale

				var
				// size
				size;

				scale = newScale;

				size = {
					width : width * scale,
					height : height * scale
				};

				self.addStyle(size);

				return size;
			};

			self.getCanvasScale = getCanvasScale = function() {
				return canvasScale;
			};

		} else {

			self.setSize = setSize = function(size) {
				//REQUIRED: size
				//REQUIRED: size.width
				//REQUIRED: size.height

				width = size.width;
				height = size.height;

				self.addStyle({
					width : width,
					height : height
				});
			};

			self.setScale = setScale = function(newScale) {
				//REQUIRED: newScale

				scale = newScale;

				self.addStyle({
					transform : 'scale(' + scale + ',' + scale + ')',
					transformOrigin : '0 0'
				});

				return {
					width : width * scale,
					height : height * scale
				};
			};

			self.addStyle({
				overflow : 'hidden'
			});
		}
	}
});
