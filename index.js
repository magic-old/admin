'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.staticFiles = undefined;

var _path = require('path');

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _nib = require('nib');

var _nib2 = _interopRequireDefault(_nib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noop = function noop() {};

var staticFiles = exports.staticFiles = function staticFiles(req, res) {
  var css = _stylus2.default;

  var options = {
    src: (0, _path.join)(__dirname, 'public'),
    dest: (0, _path.join)(req.app.get('dirs').public, 'css'),
    maxage: '1d',
    compile: function compile(str, path) {
      return css(str).set('filename', path).set('compress', req.app.get('env') === 'production').use((0, _nib2.default)()).import('nib');
    }
  };

  req.app.use(css.middleware(options));
};

var init = exports.init = function init(req, res) {
  var next = arguments.length <= 2 || arguments[2] === undefined ? noop : arguments[2];

  var template = (0, _path.join)(__dirname, 'views', 'menu.jade');
  res.render(template, function (err, html) {
    if (err || !html) {
      return next(err);
    }

    res.locals.adminMenu = html;
    res.locals.adminCssPath = '/css/admin.css';
    staticFiles(req, res);
    next();
  });
};
