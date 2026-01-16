const express = require('express');
const db = require('../database');
const router = express.Router();

// Checkout page
router.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  res.render('checkout', { cart });
});

// Payment page
router.get('/payment', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  
  const shippingAddress = req.query.shippingAddress;
  if (!shippingAddress) {
    return res.redirect('/orders/checkout');
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.render('payment', { cart, shippingAddress, total });
});

// Process order
router.post('/place', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Please login' });
  }
  
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  
  const { shippingAddress, paymentMethod, cardLast4 } = req.body;
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalWithTax = total * 1.1; // Add 10% tax
  
  db.run('INSERT INTO orders (user_id, total, shipping_address, status) VALUES (?, ?, ?, ?)',
    [req.session.user.id, totalWithTax, shippingAddress, 'paid'],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Order failed' });
      }
      
      const orderId = this.lastID;
      const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      
      cart.forEach(item => {
        stmt.run([orderId, item.id, item.quantity, item.price]);
      });
      stmt.finalize();
      
      req.session.cart = [];
      res.json({ success: true, orderId });
    }
  );
});

// Order confirmation
router.get('/confirmation/:id', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [req.params.id, req.session.user.id],
    (err, order) => {
      if (err || !order) {
        return res.status(404).send('Order not found');
      }
      
      db.all('SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
        [order.id],
        (err, items) => {
          res.render('order-confirmation', { order, items });
        }
      );
    }
  );
});

// My orders
router.get('/my-orders', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [req.session.user.id],
    (err, orders) => {
      res.render('my-orders', { orders });
    }
  );
});

module.exports = router;
