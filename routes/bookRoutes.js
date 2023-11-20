const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/bookController");

router.get("/", bookCtrl.getAllBook);
router.post("/", auth, bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
