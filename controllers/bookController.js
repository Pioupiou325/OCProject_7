const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  // on traduit le json en objet
  const bookObject = JSON.parse(req.body.book);
  // on efface l id et le userid faux provenants du front
  delete bookObject._id;
  delete bookObject._userId;
  // on crée un objet book suivant le model 
  const book = new Book({
    // on met donc le contenu de l objet moins les 2 delete
    ...bookObject,
    // on renseigne le nouvel userid qui est celui (le même) que l utilisateur qui le créée
    userId: req.auth.userId,
    // on construit l' adresse de l image avec son lieu de stockage et son filename
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
// on sauve le book dans mongodb
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
  // on teste si un fichier est inclus dans la requete
  const bookObject = req.file
    ? {
      // si oui on traduit le json en objet
      ...JSON.parse(req.body.book),
      // on créée l adresse de la nouvelle image 
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
      // ou bien on récupere l' objet ainsi créé (sans fichier)
        ...req.body,
    };
  // on efface les userid envoyé par le front
  delete bookObject._userId;
  // on cherche le book qui correspond à l' id passé en parametre
  Book.findOne({ _id: req.params.id }).then((book) => {
    // on vérifie si le userid du livre correspond à celui de l utilisateur donc lui qui l a créé
    if (book.userId != req.auth.userId) {
      // si ce n est pas le créateur pas autorisé
      res.statut(403).JSON({ message: "unauthorized request" });
    } else {
      // si c est le créateur on update le livre dans mongodb avec l id puis l objet qui remplace avec l id
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
  // on cherche le livre dont l' id est passé en paramètre
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // on vérifie si l utilisateur est bien le createur car seul lui peut supprimer un livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // on récupère le nom de la photo donc contenu apres images/
        const filename = book.imageUrl.split("/images/")[1];
        // on efface l' image du dossier images
        fs.unlink(`images/${filename}`, () => {
          // et dans la base de données on efface le book
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
  // on trouve tous les livres et on les renvoie
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.getBestsBooks = (req, res, next) => {
  // on trouve le livre puis on trie son tableau averageRatingdans l ordre plus grand au plus petit
  Book.find()
    .sort({ averageRating: -1 })
    .then((books) => {
      // on recupere les 3 1ers du tableau dans un tableau bestBooks et on le renvoie
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
  // on recherche un livre avec l id passé en parametre
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
