const Review = require("../models/review");
const Cafe = require("../models/cafe");
const mongoose = require('mongoose');

const index = async (req, res) => {
  const query = await Review.find({});
  query instanceof mongoose.Query;
  const docs = await query;
  res.send(docs);

  return res;
}

const createReview = (req, res) => {
  const { coffeeType, milkType, photo, rating, comment, cafe } = req.body;

  const newReview = new Review({
    coffeeType,
    milkType,
    photo,
    rating,
    comment,
    cafe
  });

  newReview.save()
    .then(() => {
      Cafe.findById(cafe)
        .then(cafe => {
          cafe.reviews.push(newReview._id);
          cafe.save();
        })
        .catch(err => res.status(400).send('Error: ' + err));
      res.json(newReview);
    })
    .catch(err => res.status(400).send('Error: ' + err));
}

const deleteReview = (req, res) => {
  const { id } = req.params;

  Review.findById(id)
    .then((review) => {
      Cafe.findById(review.cafe)
        .then(cafe => {
          const index = cafe.reviews.indexOf(id);
          cafe.reviews.splice(index, 1);
          cafe.save();
        })
        .catch(err => res.status(400).send('Error: ' + err));
      res.json('Review deleted.')

      review.remove();
    })
    .catch(err => res.status(400).send('Error: ' + err));
}

//find by coffee
const searchByCoffeeType = (req, res) => {
  const { type } = req.params;
  Reviews.find({ coffeeType: type })
    .then((reviews) => {
      res.json(reviews)
    })
    .catch(err => res.status(400).send('Error: ' + err));
}

//find by cafe
const searchByCafe = (req, res) => {
  const { name } = req.params;
  Cafe.find({ name })
    .then((cafe) => {
      res.json(cafe.reviews)
    })
    .catch(err => res.status(400).send('Error: ' + err));
};

module.exports = { index, createReview, deleteReview, searchByCafe, searchByCoffeeType };