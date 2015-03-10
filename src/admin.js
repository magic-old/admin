'use strict';
var express = require('express')
  , path    = require('path')
  , css     = require('stylus')
  , admin   = {}
;

function static(req, res) {
  var app = req.app
    , dir = __dirname + '/public/'
  ;

  app.use( css.middleware({
      src: dir
    , dest: path.join(app.get('dirs').public, 'css')
    , maxage: '1d'
    , compile: function compile(str, path) {
      return css(str)
              .set('filename', path)
              .set('compress', app.get('env') === 'production' )
              .use(nib())
              .import('nib')
        ;
      }
  }) );
}

export function init = function adminInit(req, res, next) {
  req.app.set('admin', true);

  res.render(path.join(__dirname, 'views', 'menu.jade'), (err, html) => {
    //~ console.log('html', html);
    if ( html ) {
      res.locals.adminMenu = html;
      res.locals.adminCssPath = '/css/admin.css';
      static(req, res);
    }
    next();
  });
}
