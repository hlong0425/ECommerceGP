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

export default app;
