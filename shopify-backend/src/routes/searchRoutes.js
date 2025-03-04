const express = require("express");
const router = express.Router();
const { saveSearch, getSearches } = require("../controllers/searchController");

router.post("/save", saveSearch);
router.get("/", getSearches);

module.exports = router;
