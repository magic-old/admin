'use strict';
import express from 'express';
import {join} from 'path';
import stylus from 'stylus';

function staticFiles(req, res) {
  var css = stylus
    , options = {
        src: join(__dirname, 'public')
      , dest: join( req.app.get('dirs').public, 'css' )
      , maxage: '1d'
      , compile: (str, path) => {
          return css(str)
            .set('filename', path)
            .set('compress', req.app.get('env') === 'production' )
            .use(nib())
            .import('nib')
        ;
      }
    }
  ;

  req.app.use( css.middleware(options) );
}

export function init(req, res, next) {
  res.render( join(__dirname, 'views', 'menu.jade'), (err, html) => {
    if ( ! html ) { return next(); }
    
    res.locals.adminMenu = html;
    res.locals.adminCssPath = '/css/admin.css';
    staticFiles(req, res);
    next();
  });
}
