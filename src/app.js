import routes from './routes/index.js';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

// init middewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
import './dbs/init.mongodb.js';
// import { checkOverLoad } from './helpers/check.connect.js';
// checkOverLoad();

// init routes
app.use('/', routes);

// If don't have any router:
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next();
});

// Catch all exception case:
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Interal Server Error',
  });
});

export default app;
