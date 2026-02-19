const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config(); // 

require('./database/db'); 
// const apiRoutes = require('./routes/api'); 
const appointmentRoutes = require('./routes/appointment');
const doctorRoutes = require('./routes/doctors');
const userRoutes = require('./routes/users'); 

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

//  Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
}));

//  Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send('Clinic API is running 🚀');
});

// API routes 
              
app.use('/appointments', appointmentRoutes); 
app.use('/doctors', doctorRoutes);           
app.use('/users', userRoutes);          


app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
