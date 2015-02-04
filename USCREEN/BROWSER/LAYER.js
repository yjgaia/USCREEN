/**
 * LAYER(Dom or Canvas) class
 */
USCREEN.LAYER = CLASS(function(cls) {'use strict';

	return {

		init : function(inner, self, params) {
			//OPTIONAL: params
			//OPTIONAL: params.img
			//OPTIONAL: params.isOnCanvas
			//OPTIONAL: params.isHide
			//OPTIONAL: params.left
			//OPTIONAL: params.top
			//OPTIONAL: params.zIndex
			//OPTIONAL: params.clipLeft
			//OPTIONAL: params.clipTop
			//OPTIONAL: params.clipWidth
			//OPTIONAL: params.clipHeight
			//OPTIONAL: params.width
			//OPTIONAL: params.height

			var
			// img
			img = params !== undefined ? params.img : undefined,

			// is on canvas
			isOnCanvas = params !== undefined && params.isOnCanvas !== undefined ? params.isOnCanvas : (BROWSER_CONFIG.USCREEN === undefined || BROWSER_CONFIG.USCREEN.isLayerOnCanvas === true),

			// is hide
			isHide = params !== undefined ? params.isHide : undefined,

			// left
			left = params !== undefined && params.left !== undefined ? params.left : 0,

			// top
			top = params !== undefined && params.top !== undefined ? params.top : 0,

			// z index
			zIndex = params !== undefined ? params.zIndex : undefined,

			// clip left
			clipLeft = params !== undefined && params.clipLeft !== undefined ? params.clipLeft : 0,

			// clip top
			clipTop = params !== undefined && params.clipTop !== undefined ? params.clipTop : 0,

			// clip width
			clipWidth = params !== undefined ? params.clipWidth : undefined,

			// clip height
			clipHeight = params !== undefined ? params.clipHeight : undefined,

			// width
			width = params !== undefined ? params.width : undefined,

			// height
			height = params !== undefined ? params.height : undefined,

			// center left
			centerLeft = 0,

			// center top
			centerTop = 0,

			// degree
			degree = 0,

			// parent
			parent,

			// context
			context,

			// div
			div,

			// children
			children = [],

			// img loaded evt
			imgLoadedEvt,

			// is right side
			isRightSide,

			// doms
			doms = [],

			// after remove proces
			afterRemoveProces = [],

			// add after remove proc.
			addRemoveHandler,

			// get div.
			getDiv,

			// append to.
			appendTo,

			// get children
			getChildren,

			// remove.
			remove,

			// move to.
			moveTo,

			// hide.
			hide,

			// show.
			show,

			// check is show.
			checkIsShow,

			// turn left.
			turnLeft,

			// turn right.
			turnRight,

			// set img.
			setImg,

			// append dom.
			appendDom,

			// find real img infos for draw.
			findRealImgInfosForDraw,

			// update canvas.
			updateCanvas,

			// set clip left.
			setClipLeft,

			// set clip top.
			setClipTop,

			// set clip width.
			setClipWidth,

			// set clip height.
			setClipHeight,

			// rotate.
			rotate;

			// on canvas
			if (isOnCanvas === true) {

				self.addRemoveHandler = addRemoveHandler = function(proc) {
					//REQUIRED: proc

					afterRemoveProces.push(proc);
				};

				self.getDiv = getDiv = function() {
					// ignore.
				};

				self.appendTo = appendTo = function(_parent) {
					//REQUIRED: _parent

					parent = _parent;

					if (parent.type === cls) {

						parent.getChildren().push(self);

					} else {

						parent.addRemoveHandler(function() {
							remove();
						});
					}

					return self;
				};

				self.getChildren = getChildren = function() {
					return children;
				};

				self.remove = remove = function() {

					EACH(children, function(child) {
						child.remove();
					});

					EACH(afterRemoveProces, function(proc) {
						proc();
					});

					REMOVE({
						data : parent.getChildren(),
						value : self
					});
				};

				self.moveTo = moveTo = function(position) {
					//REQUIRED: position
					//OPTIONAL: position.left
					//OPTIONAL: position.top
					//OPTIONAL: position.zIndex

					if (position.left !== undefined) {
						left = position.left;
					}

					if (position.top !== undefined) {
						top = position.top;
					}

					if (position.zIndex !== undefined) {
						zIndex = position.zIndex;
					}
				};

				self.hide = hide = function() {
					isHide = true;
				};

				self.show = show = function() {
					isHide = false;
				};

				self.checkIsShow = checkIsShow = function() {
					return isHide !== true;
				};

				self.turnLeft = turnLeft = function() {
					isRightSide = false;
				};

				self.turnRight = turnRight = function() {
					isRightSide = true;
				};

				self.setImg = setImg = function(_img) {
					//REQUIRED: _img

					if (img !== undefined) {
						img.remove();
					}

					img = _img;
				};

				self.appendDom = appendDom = function(dom) {
					//REQUIRED: dom

					doms.push(dom);

					dom.addStyle({
						position : 'absolute'
					});
					dom.appendTo(BODY);

					dom.addRemoveHandler(function() {
						REMOVE({
							data : doms,
							dom : dom
						});
					});
				};

				self.findRealImgInfosForDraw = findRealImgInfosForDraw = function(parentData) {
					//REQUIRED: parentData
					//REQUIRED: parentData.left
					//REQUIRED: parentData.top
					//REQUIRED: parentData.degree
					//OPTIONAL: parentData.isRightSide
					//REQUIRED: parentData.realImgInfos
					//REQUIRED: parentData.rootLeft
					//REQUIRED: parentData.rootTop
					//REQUIRED: parentData.canvasScale

					var
					// parent left
					parentLeft = parentData.left,

					// parent top
					parentTop = parentData.top,

					// parent degree
					parentDegree = parentData.degree,

					// parent is right side
					parentIsRightSide = parentData.isRightSide,

					// real img infos
					realImgInfos = parentData.realImgInfos,

					// root left
					rootLeft = parentData.rootLeft,

					// root top
					rootTop = parentData.rootTop,

					// canvas scale
					canvasScale = parentData.canvasScale,

					// child infos
					childInfos,

					// real is right side
					realIsRightSide,

					// real left
					realLeft,

					// real top
					realTop,

					// real z index
					realZIndex,

					// real degree
					realDegree,

					// real img info
					realImgInfo,

					// i
					i;

					if (isHide !== true) {

						realIsRightSide = parentIsRightSide === true ? isRightSide !== true : isRightSide === true;
						realLeft = realIsRightSide === true ? -(parentLeft + left) - (clipWidth === undefined ? (img === undefined ? 0 : img.getWidth()) : clipWidth) : parentLeft + left;
						realTop = parentTop + top;
						realZIndex = zIndex === undefined ? 0 : zIndex;
						realDegree = parentDegree + degree;

						if (img !== undefined) {

							realImgInfo = {
								img : img,
								left : canvasScale * realLeft,
								top : canvasScale * realTop,
								zIndex : realZIndex,
								degree : realDegree,
								isRightSide : realIsRightSide,
								clipLeft : clipLeft,
								clipTop : clipTop,
								clipWidth : clipWidth,
								clipHeight : clipHeight,
								width : canvasScale * (width === undefined ? (clipWidth === undefined ? img.getWidth() : clipWidth) : width),
								height : canvasScale * (height === undefined ? (clipHeight === undefined ? img.getHeight() : clipHeight) : height)
							};

							if (realDegree !== 0) {
								realImgInfo.centerLeft = canvasScale * (realLeft + centerLeft);
								realImgInfo.centerTop = canvasScale * (realTop + centerTop);
							}

						} else {

							realImgInfo = {
								zIndex : realZIndex
							};
						}

						for ( i = 0; i < doms.length; i += 1) {
							doms[i].addStyle({
								left : rootLeft + realLeft,
								top : rootTop + realTop
							});
						}

						if (zIndex !== undefined) {
							realImgInfo.childInfos = childInfos = [];
						} else {
							childInfos = realImgInfos;
						}

						realImgInfos.push(realImgInfo);

						for ( i = 0; i < children.length; i += 1) {
							children[i].findRealImgInfosForDraw({
								left : realLeft,
								top : realTop,
								degree : realDegree,
								isRightSide : realIsRightSide,
								realImgInfos : childInfos,
								rootLeft : rootLeft,
								rootTop : rootTop,
								canvasScale : canvasScale
							});
						}
					}
				};

				self.updateCanvas = updateCanvas = function() {

					var
					// real img infos
					realImgInfos = [],

					// f.
					f;

					if (context === undefined) {
						context = parent.getContext();
					}

					context.clear();

					findRealImgInfosForDraw({
						left : 0,
						top : 0,
						zIndex : 0,
						degree : 0,
						isRightSide : isRightSide,
						realImgInfos : realImgInfos,
						rootLeft : parent.getLeft(),
						rootTop : parent.getTop(),
						canvasScale : parent.getCanvasScale()
					});

					f = function(realImgInfos) {

						var
						// real img info
						realImgInfo,

						// i
						i;

						realImgInfos.sort(function(a, b) {
							return a.zIndex - b.zIndex;
						});

						for ( i = 0; i < realImgInfos.length; i += 1) {
							realImgInfo = realImgInfos[i];

							if (realImgInfo.img !== undefined) {

								context.save();

								if (realImgInfo.isRightSide === true) {
									context.setScale({
										scaleWidth : -1,
										scaleHeight : 1
									});
								}

								if (realImgInfo.degree !== 0) {
									context.rotate(realImgInfo);
								}

								context.drawImg(realImgInfo);

								context.restore();
							}

							if (realImgInfo.childInfos !== undefined) {
								f(realImgInfo.childInfos);
							}
						}
					};
					f(realImgInfos);
				};

				self.setClipLeft = setClipLeft = function(_clipLeft) {
					//REQUIRED: _clipLeft

					clipLeft = _clipLeft;
				};

				self.setClipTop = setClipTop = function(_clipTop) {
					//REQUIRED: _clipTop

					clipTop = _clipTop;
				};

				self.setClipWidth = setClipWidth = function(_clipWidth) {
					//REQUIRED: _clipWidth

					clipWidth = _clipWidth;
				};

				self.setClipHeight = setClipHeight = function(_clipHeight) {
					//REQUIRED: _clipHeight

					clipHeight = _clipHeight;
				};

				self.rotate = rotate = function(params) {
					//REQUIRED: params
					//REQUIRED: params.centerLeft
					//REQUIRED: params.centerTop
					//REQUIRED: params.degree

					centerLeft = params.centerLeft;
					centerTop = params.centerTop;
					degree = params.degree;
				};
			}

			// not canvas
			else {

				div = DIV({
					style : {
						position : 'absolute',
						left : left,
						top : top,
						zIndex : zIndex,
						display : isHide === true ? 'none' : 'block'
					}
				});

				self.addRemoveHandler = addRemoveHandler = function(proc) {
					//REQUIRED: proc

					div.addRemoveHandler(proc);
				};

				addRemoveHandler(function() {
					REMOVE({
						data : parent.getChildren(),
						value : self
					});
				});

				self.getDiv = getDiv = function() {
					return div;
				};

				self.appendTo = appendTo = function(_parent) {
					//REQUIRED: _parent

					parent = _parent;

					if (parent.type === cls) {

						parent.getChildren().push(self);
						parent.getDiv().append(div);

					} else {
						parent.append(div);
					}

					return self;
				};

				self.getChildren = getChildren = function() {
					return children;
				};

				self.remove = remove = function() {
					div.remove();
				};

				self.moveTo = moveTo = function(position) {
					//REQUIRED: position
					//OPTIONAL: position.left
					//OPTIONAL: position.top
					//OPTIONAL: position.zIndex

					if (position.left !== undefined) {
						left = position.left;
					}

					if (position.top !== undefined) {
						top = position.top;
					}

					if (position.zIndex !== undefined) {
						zIndex = INTEGER(position.zIndex);
					}

					div.addStyle({
						left : left,
						top : top,
						zIndex : zIndex
					});
				};

				self.hide = hide = function() {

					isHide = true;

					div.hide();
				};

				self.show = show = function() {

					isHide = false;

					div.show();
				};

				self.checkIsShow = checkIsShow = function() {
					return isHide !== true;
				};

				self.turnLeft = turnLeft = function() {

					isRightSide = false;

					div.addStyle({
						transform : 'none',
						filter : 'none'
					});
				};

				self.turnRight = turnRight = function() {

					isRightSide = true;

					div.addStyle({
						transform : 'scaleX(-1)',
						filter : 'FlipH'
					});
				};

				self.setImg = setImg = function(_img) {
					//REQUIRED: _img

					if (imgLoadedEvt !== undefined) {
						imgLoadedEvt.remove();
						imgLoadedEvt = undefined;
					}

					if (img !== undefined) {
						img.remove();
					}

					img = _img;

					div.addStyle({
						width : width !== undefined ? width : (clipWidth === undefined ? img.getWidth() : clipWidth),
						height : height !== undefined ? height : (clipHeight === undefined ? img.getHeight() : clipHeight),
						background : 'url(' + img.getSrc() + ')',
						backgroundRepeat : 'no-repeat',
						backgroundPosition : (-clipLeft) + 'px ' + (-clipTop) + 'px',
						backgroundSize : (width !== undefined ? width : img.getWidth()) + 'px ' + (height !== undefined ? height : img.getHeight()) + 'px'
					});

					imgLoadedEvt = EVENT({
						node : img,
						name : 'load'
					}, function() {

						div.addStyle({
							width : width !== undefined ? width : (clipWidth === undefined ? img.getWidth() : clipWidth),
							height : height !== undefined ? height : (clipHeight === undefined ? img.getHeight() : clipHeight),
							backgroundSize : (width !== undefined ? width : img.getWidth()) + 'px ' + (height !== undefined ? height : img.getHeight()) + 'px'
						});

						imgLoadedEvt.remove();
						imgLoadedEvt = undefined;
					});
				};

				self.appendDom = appendDom = function(dom) {
					//REQUIRED: dom

					dom.addStyle({
						position : 'absolute'
					});
					div.append(dom);
				};

				self.findRealImgInfosForDraw = findRealImgInfosForDraw = function(params) {
					// ignore.
				};

				self.updateCanvas = updateCanvas = function() {
					// ignore.
				};

				self.setClipLeft = setClipLeft = function(_clipLeft) {
					//REQUIRED: _clipLeft

					clipLeft = _clipLeft;

					div.addStyle({
						backgroundPosition : (-clipLeft) + 'px ' + (-clipTop) + 'px'
					});
				};

				self.setClipTop = setClipTop = function(_clipTop) {
					//REQUIRED: _clipTop

					clipTop = _clipTop;

					div.addStyle({
						backgroundPosition : (-clipLeft) + 'px ' + (-clipTop) + 'px'
					});
				};

				self.setClipWidth = setClipWidth = function(_clipWidth) {
					//REQUIRED: _clipWidth

					clipWidth = _clipWidth;

					div.addStyle({
						width : clipWidth
					});
				};

				self.setClipHeight = setClipHeight = function(_clipHeight) {
					//REQUIRED: _clipHeight

					clipHeight = _clipHeight;

					div.addStyle({
						width : clipHeight
					});
				};

				self.rotate = rotate = function(params) {
					//REQUIRED: params
					//REQUIRED: params.centerLeft
					//REQUIRED: params.centerTop
					//REQUIRED: params.degree

					centerLeft = params.centerLeft;
					centerTop = params.centerTop;
					degree = params.degree;

					div.addStyle({
						transformOrigin : centerLeft + 'px ' + centerTop + 'px',
						transform : 'rotate(' + degree + 'deg)'
					});
				};
			}

			if (img !== undefined) {
				setImg(img);
			}
		}
	};
});
