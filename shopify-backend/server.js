// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const compression = require("compression");
const Redis = require("ioredis");
const { validateRequest } = require("./src/middlewares/validationMiddleware");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const metafieldsRoutes = require("./src/routes/metafieldsRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const { errorHandler } = require("./src/middlewares/errorMiddleware");
const shopifyMiddleware = require("./src/middlewares/shopifyMiddleware");

const app = express();
const redisClient = new Redis(process.env.REDIS_URL);

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(compression()); // Optimize response size

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Request Validation Middleware
app.use(validateRequest);

// Caching Middleware
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  redisClient.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      return res.json(JSON.parse(data));
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        redisClient.setex(key, 3600, JSON.stringify(body)); // Cache for 1 hour
        res.sendResponse(body);
      };
      next();
    }
  });
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", cacheMiddleware, productRoutes);
app.use("/api/customers", cacheMiddleware, customerRoutes);
app.use("/api/metafields", cacheMiddleware, metafieldsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", shopifyMiddleware, webhookRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});