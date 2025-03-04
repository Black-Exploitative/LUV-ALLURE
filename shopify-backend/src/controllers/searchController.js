const db = require("../services/databaseService");

exports.saveSearch = async (req, res) => {
  try {
    const { userId, query } = req.body;
    await db.query("INSERT INTO searches (user_id, query) VALUES (?, ?)", [userId, query]);
    res.status(200).json({ message: "Search saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save search" });
  }
};

exports.getSearches = async (req, res) => {
  try {
    const { userId } = req.query;
    const searches = await db.query("SELECT query FROM searches WHERE user_id = ?", [userId]);
    res.status(200).json({ searches });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve searches" });
  }
};
