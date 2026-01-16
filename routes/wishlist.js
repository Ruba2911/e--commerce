const express = require('express');
const db = require('../database');
const router = express.Router();

// View wishlist
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  db.all(`SELECT p.*, w.id as wishlist_id FROM wishlist w 
          JOIN products p ON w.product_id = p.id 
          WHERE w.user_id = ?`,
    [req.session.user.id],
    (err, products) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.render('wishlist', { products });
    }
  );
});

// Add to wishlist
router.post('/add', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login' });
  }
  
  const { productId } = req.body;
  
  db.run('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
    [req.session.user.id, productId],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.json({ success: true, message: 'Already in wishlist' });
        }
        return res.status(500).json({ error: 'Failed to add to wishlist' });
      }
      res.json({ success: true });
    }
  );
});

// Remove from wishlist
router.post('/remove', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login' });
  }
  
  const { productId } = req.body;
  
  db.run('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [req.session.user.id, productId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove from wishlist' });
      }
      res.json({ success: true });
    }
  );
});

// Check if product is in wishlist
router.get('/check/:productId', (req, res) => {
  if (!req.session.user) {
    return res.json({ inWishlist: false });
  }
  
  db.get('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
    [req.session.user.id, req.params.productId],
    (err, row) => {
      res.json({ inWishlist: !!row });
    }
  );
});

module.exports = router;
