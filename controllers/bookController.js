const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`});

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};





exports.noteBook = (req, res, next) => {
  Book.find();
  console.log("noteBook");
};
exports.modifyBook = (req, res, next) => {
  console.log("modifyBook");
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `&{req.protocol}://&{req.get('host')}/images/&{req.file.filename}`,
      }
    : {
        ...req.body,
      };
  delete bookObject._userId;
  Book.findOne({ _id: req.body.userId }).then((book) => {
    if (book.userId != req.auth.userId) {
      res.statut(401).JSON({ message: "non autorisé" });
    } else {
      Book.updateOne({ _id: req.params.id }, { bookObject, _id: req.params.id })
        .then(res.status(200).json({ message: "livre modifié" }))
        .catch((error) => res.status(400).JSON({ error }));
    }
  });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
////////////ok///////
exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.getBestsBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .then((books) => {
      const bestBooks = books.slice(0, 3);
      res.status(200).json(bestBooks);
    })
    .catch((error) => {
      console.log("erreur pour 3 bests averageRating");
      res.status(400).json({
        error: error,
      });
    });
};
exports.getOneBook = (req, res, next) => {   

  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {      
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};