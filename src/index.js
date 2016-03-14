import { join } from 'path';
import stylus from 'stylus';
import nib from 'nib';

const noop = () => {};

export const staticFiles =
  (req, res) => {
    const css = stylus;

    const options = {
      src: join(__dirname, 'public'),
      dest: join(req.app.get('dirs').public, 'css'),
      maxage: '1d',
      compile: (str, path) => {
        return css(str)
          .set('filename', path)
          .set('compress', req.app.get('env') === 'production')
          .use(nib())
          .import('nib');
      },
    };

    req.app.use(css.middleware(options));
  };

export const init =
  (req, res, next = noop) => {
    const template = join(__dirname, 'views', 'menu.jade');
    res.render(template, (err, html) => {
      if (err || !html) {
        return next(err);
      }

      res.locals.adminMenu = html;
      res.locals.adminCssPath = '/css/admin.css';
      staticFiles(req, res);
      next();
    });
  };
