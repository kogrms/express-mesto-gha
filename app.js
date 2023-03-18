const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/mestodb';

const app = express();

// применяем парсер к телу запроса в формате JSON
app.use(bodyParser.json());
// применяем парсер к телу запроса в формате x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(url);

app.use('/', usersRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: '64116c098734342bc4a5389b'
  };
  next();
});

app.listen(port);

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}...`);
// });
