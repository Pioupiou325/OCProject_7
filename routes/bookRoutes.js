const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
const bookCtrl = require("../controllers/bookController");
const greenCodeImage = require('../middleware/greenCodeImage');

router.get("/bestrating", bookCtrl.getBestsBooks);
router.get("/", bookCtrl.getAllBook);
router.get("/:id", bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.noteBook);
router.put("/:id", auth, multer,greenCodeImage, bookCtrl.modifyBook);
router.post("/", auth, multer,greenCodeImage, bookCtrl.createBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
