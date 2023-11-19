const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

app.use('/api/book', bookRoutes);
app.use('/api/auth', userRoutes);
mongoose
  .connect(
    `mongodb+srv://monvieuxgrimoire7:monvieuxgrimoire7@cluster0.e8iqnnv.mongodb.net/mon_vieux_grimoire?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

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


module.exports = app;
