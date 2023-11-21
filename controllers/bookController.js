const Book = require("../models/Book");

exports.createBook = (req, res, next) => {
  console.log("createBook")
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  console.log("getOneBook")
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => { 
      console.log("getOneBook")
      res.status(200).json(book);
    })
    .catch((error) => {
            res.status(404).json({error});
    });
};
exports.getBestsBooks = (req, res, next) => {
  console.log("getBestsBooks")
  Book.find()    
    .then((books) => {      
      books.sort((a,b)=>b.averageRating - a.averageRating);
      const bestAverageRating = books.slice(0, 3);
      res.status(200).json(bestAverageRating);
    })
    .catch((error) => {
      console.log("erreur pour 3 bests averageRating");
      res.status(400).json({
        error: error,
      });
    });
};
exports.modifyBook = (req, res, next) => {
  console.log("modifyBook")
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
  console.log("deleteBook")
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
  console.log("getAllBook")
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
