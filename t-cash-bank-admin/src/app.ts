import express from 'express';
import session from 'express-session';
import { AppDataSource } from './config/data-source';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false,
// }));
app.use(express.static('public')); // for static files like Bootstrap, CSS
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

import indexRoutes   from './routes/index.routes';
import adminRoutes   from './routes/admin/index';    // <– points at src/routes/admin/index.ts
// import staffRoutes   from './routes/staff/index';    // <– points at src/routes/staff/index.ts
// import clientRoutes  from './routes/client';   // <– points at src/routes/client/index.ts
// import displayRoutes  from './routes/display';   // <– points at src/routes/client/index.ts

app.use('/',      indexRoutes);
// app.use('/staff', staffRoutes);

app.use('/admin', adminRoutes);
// app.use('/display', displayRoutes);
// app.use('/client', clientRoutes);

// DB Init
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(error => console.log(error));
