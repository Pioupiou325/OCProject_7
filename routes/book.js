const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");

router.get("/", auth, bookCtrl.getAllBook);
router.post("/", auth, bookCtrl.createBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.modifyThing);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
