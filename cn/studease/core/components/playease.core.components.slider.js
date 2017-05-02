﻿(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		components = core.components,
		
		directions = {
			HORIZONTAL: 0,
			VERTICAL:   1
		};
	
	components.slider = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('components.slider')),
			_defaults = {
				name: '',
				direction: directions.HORIZONTAL
			},
			_railnames = ['bg', 'buf', 'pro'],
			_rails,
			_thumb,
			_direction,
			_container,
			_percentage,
			_active,
			_value;
		
		function _init() {
			_this.config = utils.extend({}, _defaults, config);
			
			_rails = {};
			_direction = _this.config.direction;
			_percentage = 0;
			_active = false;
			
			_build();
			
			try {
				document.addEventListener('mousedown', _onMouseDown);
				document.addEventListener('mousemove', _onMouseMove);
				document.addEventListener('mouseup', _onMouseUp);
			} catch (err) {
				document.attachEvent('onmousedown', _onMouseDown);
				document.attachEvent('onmousemove', _onMouseMove);
				document.attachEvent('onmouseup', _onMouseUp);
			}
		}
		
		function _build() {
			_container = utils.createElement('div', 'plslider ' + _this.config.name);
			
			for (var i = 0; i < _railnames.length; i++) {
				var name = _railnames[i];
				var rail = _rails[name] = utils.createElement('span', 'plrail ' + name);
				_container.appendChild(rail);
			}
			
			_thumb = utils.createElement('span', 'plthumb');
			_container.appendChild(_thumb);
		}
		
		_this.buffered = function(percentage) {
			_rails.buf.style.width = percentage + '%';
		};
		
		_this.update = function(percentage) {
			_percentage = percentage;
			_rails.pro.style.width = _percentage + '%';
			if (_direction == directions.HORIZONTAL) {
				try {
					_thumb.style.left = 'calc(' + _percentage + '% - 5px)';
				} catch (err) {
					setTimeout(function() {
						_thumb.style.left = _container.clientWidth * _percentage / 100 - 5 + 'px';
					}, 0);
				}
			} else {
				try {
					_thumb.style.bottom = 'calc(' + _percentage + '% - 5px)';
				} catch (err) {
					setTimeout(function() {
						_thumb.style.bottom = _container.clientHeight * _percentage / 100 - 5 + 'px';
					}, 0);
				}
			}
		};
		
		function _onMouseDown(e) {
			if (!e.target) {
				e.target = e.srcElement;
			}
			
			var target = e.target && e.target.parentNode === _container ? e.target.parentNode : e.target;
			if (target !== _container) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
			
			_active = true;
		}
		
		function _onMouseMove(e) {
			if (!_active) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
		}
		
		function _onMouseUp(e) {
			if (!_active) {
				return;
			}
			
			var value = _getValue(e.clientX, e.clientY);
			if (value != _value) {
				_value = value;
				_this.dispatchEvent(events.PLAYEASE_SLIDER_CHANGE, { value: value });
			}
			
			_active = false;
		}
		
		function _getValue(x, y) {
			var offsetX, offsetY, value;
			
			switch (_this.config.name) {
				case 'time':
					offsetX = x - _container.parentNode.offsetLeft;
					offsetY = y - _container.parentNode.offsetTop;
					break;
				case 'volume':
					offsetX = x - _container.offsetLeft - _container.parentNode.offsetLeft - _container.parentNode.parentNode.offsetLeft;
					offsetY = y - _container.offsetTop - _container.parentNode.offsetTop - _container.parentNode.parentNode.offsetTop;
					break;
				default:
					break;
			}
			
			if (_direction == directions.HORIZONTAL) {
				value = (offsetX / _container.clientWidth * 100).toFixed(2);
			} else {
				value = (offsetY / _container.clientHeight * 100).toFixed(2);
			}
			value = Math.max(0, Math.min(value, 100));
			
			return value;
		}
		
		_this.element = function() {
			return _container;
		};
		
		_init();
	};
})(playease);
