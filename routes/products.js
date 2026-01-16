const express = require('express');
const db = require('../database');
const router = express.Router();

// All products page
router.get('/', (req, res) => {
  const category = req.query.category;
  let query = 'SELECT * FROM products';
  let params = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  
  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.render('products', { products, selectedCategory: category });
  });
});

// Product details page
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err || !product) {
      return res.status(404).send('Product not found');
    }
    res.render('product-detail', { product });
  });
});

module.exports = router;
