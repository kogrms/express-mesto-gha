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
// , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(port, () => {
//     console.log(`Server is listening on port ${port}...`);
//   });
// }).catch((err) => {
//   console.error('Failed to connect to MongoDB:', err);
// });

app.use('/', usersRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
