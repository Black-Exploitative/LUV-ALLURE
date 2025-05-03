// frontend/src/config/packagingOptions.js
/**
 * Packaging options configuration
 * This file defines all available packaging options for orders
 */

const packagingOptions = [
    {
      id: 'normal',
      name: 'Standard Packaging',
      description: 'Our standard eco-friendly packaging with branded tissue paper',
      price: 0,
      imageUrl: '/images/packaging/standard-packaging.jpg',
      features: [
        'Branded tissue paper',
        'Eco-friendly materials',
        'Luv\'s Allure branded box'
      ]
    },
    {
      id: 'luxe',
      name: 'Luxe Packaging',
      description: 'Premium packaging with gift box, satin ribbon, and scented tissue paper',
      price: 1500,
      imageUrl: '/images/packaging/luxe-packaging.jpg',
      features: [
        'Premium gift box',
        'Satin ribbon',
        'Scented tissue paper',
        'Handwritten thank you note'
      ]
    },
    {
      id: 'gift',
      name: 'Gift Packaging',
      description: 'Beautiful gift packaging with ribbon, gift card, and premium wrapping',
      price: 2500,
      imageUrl: '/images/packaging/gift-packaging.jpg',
      features: [
        'Premium gift box',
        'Custom gift card',
        'Luxury wrapping',
        'Satin ribbon',
        'Option to add gift message'
      ],
      allowsGiftMessage: true
    }
  ];
  
  export default packagingOptions;