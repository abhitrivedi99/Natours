const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

dotenv.config({ path: './config.env' });
//console.log(process.env);

//mongoose
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log('Connected to DB')
);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is runnig on port ${port}...`);
});

