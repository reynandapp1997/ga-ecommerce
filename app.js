const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token);

const {
  MONGODB_URI
} = require('./environment');
const indexRouter = require('./routes/index');
const {
  cloudinaryConfig
} = require('./configs/cloudinaryConfig');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use('*', cloudinaryConfig);
app.use(cors());
/* istanbul ignore if */
if (process.env.ENVIRONMENT !== 'DEVELOPMENT' && process.env.ENVIRONMENT !== 'TESTING') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
/* istanbul ignore next */
app.use((req, res, next) => {
  return res.status(404).json({
    message: 'Endpoint not found'
  });
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err) => {
  /* istanbul ignore if */
  if (err) {
    return console.log(err);
  } else if (process.env.ENVIRONMENT === 'PRODUCTION') {
    bot.sendMessage(process.env.CHAT_ID, 'MongoDB Connected');
    console.log('MongoDB Connected');
  }
});

module.exports = app;
