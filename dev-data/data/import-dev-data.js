const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('./../../models/reviewModel');
const User = require('./../../models/userModel');
const Tour = require('./../../models/tourModel');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Local Database
// .connect(DB, {
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// Read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    await Tour.create(tours);
    console.log('Data loaded successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Review.deleteMany();
    await Tour.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
