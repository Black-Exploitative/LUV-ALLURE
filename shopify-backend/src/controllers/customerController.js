// controllers/customerController.js
const User = require('../models/user');
const shopifyConfig = require('../config/shopify');
const shopifyService = require("../services/shopifyService");

exports.registerCustomer = async (req, res) => {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      birthdate, 
    } = req.body;

    // Create Shopify Customer
    const shopifyCustomer = await shopifyConfig.customer.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      verified_email: true,
      metafields: [
        {
          key: 'birthdate',
          value: birthdate,
          type: 'date',
          namespace: 'personal'
        },
        {
          key: 'preferred_styles',
          value: JSON.stringify(preferredStyles),
          type: 'json',
          namespace: 'preferences'
        }
      ]
    });

    // Create Local User
    const newUser = new User({
      shopifyCustomerId: shopifyCustomer.id,
      email,
      firstName,
      lastName,
      birthdate: new Date(birthdate),
      additionalFields: {
        preferredStyles,
        preferredColors
      }
    });

    await newUser.save();

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: newUser,
      shopifyCustomer: shopifyCustomer
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCustomerSegments = async (req, res) => {
  try {
    const segments = await shopifyService.getCustomerSegments();
    res.json(segments);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve customer segments" });
  }
};
