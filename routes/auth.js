const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

// Register page
router.get('/register', (req, res) => {
  res.render('register');
});

// Register handler
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          return res.render('register', { error: 'Username or email already exists' });
        }
        res.redirect('/auth/login');
      }
    );
  } catch (error) {
    res.render('register', { error: 'Registration failed' });
  }
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    res.redirect('/');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
