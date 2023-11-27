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

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.userId != req.auth.userId) {
      res.statut(403).JSON({ message: "unauthorized request" });
    } else {
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(res.status(200).json({ message: "livre modifié" }))
        .catch((error) => res.status(400).JSON({ error }));
    }
  })
    .catch((error) => {
      res.status(400).JSON({ error });
  })
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
exports.noteBook = (req, res, next) => {
  const userId = req.auth.userId;
  const note = req.body.rating;
  // on cherche le livre à noter
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        // si le livre n existe pas
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // si il existe on continue
      // je recupere l id du créateur du livre
      const creatorBook = book.userId;
      // je le .some dans le tableau book.ratings pour savoir si il y est déjà
      const userAlreadyRated = book.ratings.some(
        (rating) => rating.userId === userId
      );
      // si le user a déjà noté ou si c est le créateur du livre on return
      if (userAlreadyRated || creatorBook === userId) {
        return res.status(403).json({
          message: "Vous avez déjà noté ce livre ou vous êtes l'auteur",
        });
      }
      // sinon on continue et on teste la note entre 0 et 5
      if (note < 0 || note > 5) {
        return res
          .status(403)
          .json({ message: "La note doit être comprise entre 0 et 5" });
      }
      // on continue pour la moyenne
      // on récupère la moyenne actuelle
      let averageBefore = book.averageRating;
      // on initialise la moyenne nouvelle à 0
      let newAverageNoteBook = 0;
      // on initialise la somme des notes à 0
      let sommeRatings = 0;
      // on calcule la somme des notes (donc moyenne * nombre de notes)
      sommeRatings = averageBefore * book.ratings.length;
      // on rajoute la note du req
      sommeRatings += note;
      // on calcule la moyenne en ajoutant 1 à la longueur du tableau ratings
      newAverageNoteBook = sommeRatings / (book.ratings.length + 1);
      // on push le nouveau rating
      book.ratings.push({ userId: userId, grade: note });
      // on modifie la moyenne
      book.averageRating = newAverageNoteBook;
      // on save dans la base de donnée mongoDB
      book
        .save()
        .then((book) => res.status(200).json(book))
        .catch((error) => {
          res.status(500).json({
            message: "Erreur lors de la notation du livre",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la notation du livre",
        error: error.message,
      });
    });
};
