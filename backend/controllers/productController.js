import shopifyAPI from "../config/shopify.js";

export const getAllProducts = async (req, res) => {
  try {
    const response = await shopifyAPI.get("/products.json");
    res.json(response.data.products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};
