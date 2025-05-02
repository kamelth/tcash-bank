import express from 'express';
import { AppDataSource } from './config/data-source';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middlewares/request-logger';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // for static files like Bootstrap, CSS
app.use(cookieParser());

app.use(requestLogger); // 👈 log all incoming requests

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import indexRoutes   from './routes/index.routes';
import staffRoutes   from './routes/staff/index';    // <– points at src/routes/staff/index.ts

app.use('/',      indexRoutes);
app.use('/staff', staffRoutes);

// DB Init
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.log(error));
