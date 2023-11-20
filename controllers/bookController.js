const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      console.log("recherche 1 book");
      res.status(200).json(book);
    })
    .catch((error) => {
      console.log("erreur pour un");
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifyBook = (req, res, next) => {
  const book = new Book({
   userId: req.body.userId,
   title: req.body.title,
   author: req.body.author,
   imageUrl: req.body.imageUrl,
   year: req.body.year,
   genre: req.body.genre,
   rating: req.body.rating,
   averageRating: req.body.averageRating,
  });
  Book.updateOne({ _id: req.params.id }, book)
    .then(() => {
      res.status(201).json({
        message: "Book updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => {
      console.log("recherche get all books");
      res.status(200).json(books);
    })
    .catch((error) => {
      console.log("erreur pour all");
      res.status(400).json({
        error: error,
      });
    });
};
