const express = require('express');
const db = require('../database');
const router = express.Router();

// View cart
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart });
});

// Add to cart
router.post('/add', (req, res) => {
  const { productId, quantity } = req.body;
  
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    const existingItem = req.session.cart.find(item => item.id == productId);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      req.session.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: parseInt(quantity)
      });
    }
    
    res.json({ success: true, cartCount: req.session.cart.length });
  });
});

// Update cart item
router.post('/update', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (req.session.cart) {
    const item = req.session.cart.find(item => item.id == productId);
    if (item) {
      item.quantity = parseInt(quantity);
      if (item.quantity <= 0) {
        req.session.cart = req.session.cart.filter(item => item.id != productId);
      }
    }
  }
  
  res.json({ success: true });
});

// Remove from cart
router.post('/remove', (req, res) => {
  const { productId } = req.body;
  
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.id != productId);
  }
  
  res.json({ success: true });
});

module.exports = router;
