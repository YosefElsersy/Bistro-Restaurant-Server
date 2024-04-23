const express = require("express");
const router = express.Router();
const { submitForm, getForms,deleteForm } = require("../controllers/formController");
const verifyToken = require("../middleware/verifyToken");

// GET route to fetch form data
router.get("/", verifyToken, getForms);

// POST route to submit the form
router.post("/submit", verifyToken, submitForm);

// DELETE route to delete a form
router.delete("/:id", verifyToken, deleteForm);

module.exports = router;
