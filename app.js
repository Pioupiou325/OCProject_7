const express = require("express");
const app = express();

const mongoose = require("mongoose");
const username = encodeURIComponent("pierre8800");
const password = encodeURIComponent("@hotmail.fr");
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.e8iqnnv.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "Livre créé" });
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/books", (req, res, next) => {
  const book = [
    {
      id: "1",
      userId: "clc4wj5lh3gyi0ak4eq4n8syr",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "2",
      userId: "clbxs3tag6jkr0biul4trzbrv",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "clbxs3tag6jkr0biul4trzbrv",
          grade: 4,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4.2,
    },
    {
      id: "3",
      userId: "1",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "4",
      userId: "1",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "5",
      userId: "1",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4,
    },
    {
      id: "6",
      userId: "1",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "7",
      userId: "1",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "8",
      userId: "clc7s9xnh7zpt0ak4fisdwuj1",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4,
    },
    {
      id: "9",
      userId: "clc4wj5lh3gyi0ak4eq4n8syr",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 1,
        },
      ],
      averageRating: 3,
    },
  ];
  res.status(200).json(book);
});

module.exports = app;
