// routes/dreams.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/dreams.controller");
const auth = require("../middlewares/auth.middleware"); // opcional

router.get("/", controller.list);
router.get("/:id", controller.getOne);
router.post("/", /* auth, */ controller.create); // descomente auth se usar
router.delete("/:id", /* auth, */ controller.remove);

module.exports = router;
