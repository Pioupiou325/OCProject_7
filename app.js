const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

app.use(express.json());
mongoose
.connect(
  `mongodb+srv://testeur:testeur@cluster0.staviob.mongodb.net/mon_vieux_grimoire?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
  
  
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
      
      app.use("/api/books", bookRoutes);
      app.use("/api/auth", userRoutes);
module.exports = app;
