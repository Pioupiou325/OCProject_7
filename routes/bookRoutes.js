const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
const bookCtrl = require("../controllers/bookController");

router.get("/bestrating", bookCtrl.getBestsBooks);
router.get("/", bookCtrl.getAllBook);
router.get("/:id", bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.noteBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.post("/", auth, multer, bookCtrl.createBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
