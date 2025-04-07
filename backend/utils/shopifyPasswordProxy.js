// utils/ShopifyPasswordProxy.js
const crypto = require('crypto');
const User = require('../models/User');
const shopifyClient = require('./shopifyClient');

/**
 * This utility manages secure storage and retrieval of Shopify passwords
 * to provide seamless authentication without requiring users to go through
 * Shopify's password reset flow.
 */
class ShopifyPasswordProxy {
  constructor() {
    // The encryption key should be stored in environment variables
    this.encryptionKey = process.env.SHOPIFY_PASSWORD_ENCRYPTION_KEY;
    this.algorithm = 'aes-256-cbc';
  }

  /**
   * Encrypts a password for secure storage
   */
  encrypt(text) {
    // Create a new initialization vector for each encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Return both the IV and encrypted data
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  /**
   * Decrypts a stored password
   */
  decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  }

  /**
   * Store a user's Shopify password securely
   */
  async storeShopifyPassword(userId, password) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Encrypt the password before storing
      const encryptedPassword = this.encrypt(password);
      
      // Store in the user document
      user.shopifyPasswordEncrypted = encryptedPassword;
      await user.save();
      
      return { success: true };
    } catch (error) {
      console.error('Error storing Shopify password:', error);
      throw error;
    }
  }

  /**
   * Get a Shopify access token using the stored password
   */
  async getShopifyToken(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // If we don't have a stored Shopify password, we can't get a token
      if (!user.shopifyPasswordEncrypted) {
        throw new Error('No Shopify password stored for this user');
      }
      
      // Decrypt the stored password
      const decryptedPassword = this.decrypt(user.shopifyPasswordEncrypted);
      
      // Use the password to get a fresh token
      const response = await shopifyClient.customerAccessTokenCreate(
        user.email,
        decryptedPassword
      );
      
      if (response.customerAccessTokenCreate.customerUserErrors.length > 0) {
        // If this fails, it could mean the password is no longer valid
        // We should clear the stored password
        user.shopifyPasswordEncrypted = undefined;
        await user.save();
        
        throw new Error('Stored Shopify password is no longer valid');
      }
      
      return response.customerAccessTokenCreate.customerAccessToken.accessToken;
    } catch (error) {
      console.error('Error getting Shopify token from stored password:', error);
      throw error;
    }
  }

  /**
   * Update the stored Shopify password when the user changes their password
   * This method should be called when a user successfully changes their password
   */
  async updateShopifyPassword(userId, newPassword) {
    try {
      // Just call storeShopifyPassword with the new password
      return this.storeShopifyPassword(userId, newPassword);
    } catch (error) {
      console.error('Error updating Shopify password:', error);
      throw error;
    }
  }

  /**
   * Reset the user's Shopify password using the stored password
   * This is used during password reset flows
   */
  async resetShopifyPasswordWithStored(userId, newPassword) {
    try {
      // First get the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // If we don't have a stored Shopify password, we can't reset it
      if (!user.shopifyPasswordEncrypted) {
        throw new Error('No Shopify password stored for this user');
      }
      
      // Get a token using the old password
      const accessToken = await this.getShopifyToken(userId);
      
      // Now update the password using the token
      const response = await shopifyClient.customerUpdatePassword(
        accessToken,
        newPassword
      );
      
      if (response.customerUpdate.customerUserErrors.length > 0) {
        throw new Error(response.customerUpdate.customerUserErrors[0].message);
      }
      
      // Store the new password
      await this.storeShopifyPassword(userId, newPassword);
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting Shopify password with stored password:', error);
      throw error;
    }
  }

  /**
   * Check if we have a stored Shopify password for this user
   */
  async hasStoredShopifyPassword(userId) {
    try {
      const user = await User.findById(userId);
      return !!user?.shopifyPasswordEncrypted;
    } catch (error) {
      console.error('Error checking for stored Shopify password:', error);
      return false;
    }
  }
}

module.exports = new ShopifyPasswordProxy();