const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./ecommerce.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    category TEXT,
    stock INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Order items table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Wishlist table
  db.run(`CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  )`);

  // Insert sample products
  db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
    if (!err && row.count === 0) {
      insertSampleProducts();
    }
  });
}

function insertSampleProducts() {
  const products = [
    // Electronics
    ['Premium Wireless Headphones', 'High-quality noise-canceling headphones with 30-hour battery life and premium sound quality', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Electronics', 50],
    ['Smart Watch Pro', 'Advanced fitness tracking with heart rate monitor, GPS, and sleep tracking', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'Electronics', 30],
    ['Portable Bluetooth Speaker', 'Waterproof speaker with 360-degree sound and 20-hour battery', 79.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 'Electronics', 60],
    ['Wireless Charging Pad', 'Fast wireless charging for all Qi-enabled devices with LED indicator', 39.99, 'https://images.unsplash.com/photo-1591290619762-c588f0e8e0b4?w=800&q=80', 'Electronics', 80],
    ['4K Action Camera', 'Waterproof action camera with 4K video and image stabilization', 249.99, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80', 'Electronics', 40],
    ['Wireless Earbuds Pro', 'True wireless earbuds with active noise cancellation and premium sound', 149.99, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', 'Electronics', 70],
    ['Gaming Mouse RGB', 'Professional gaming mouse with 16000 DPI and customizable RGB lighting', 69.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 'Electronics', 90],
    ['Mechanical Keyboard', 'RGB mechanical keyboard with blue switches and aluminum frame', 129.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 'Electronics', 55],
    
    // Fashion
    ['Designer Backpack', 'Stylish and durable backpack with laptop compartment and USB charging port', 89.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 'Fashion', 100],
    ['Leather Wallet', 'Genuine leather wallet with RFID protection and multiple card slots', 49.99, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', 'Fashion', 75],
    ['Running Shoes', 'Lightweight running shoes with superior cushioning and breathable mesh', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Fashion', 45],
    ['Classic Sunglasses', 'UV protection sunglasses with polarized lenses and metal frame', 79.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', 'Fashion', 85],
    ['Denim Jacket', 'Classic denim jacket with modern fit and premium quality fabric', 119.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', 'Fashion', 60],
    ['Leather Belt', 'Premium leather belt with reversible design and elegant buckle', 44.99, 'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800&q=80', 'Fashion', 95],
    ['Canvas Sneakers', 'Comfortable canvas sneakers perfect for casual wear', 59.99, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', 'Fashion', 110],
    ['Winter Scarf', 'Soft cashmere blend scarf in multiple colors', 39.99, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80', 'Fashion', 120],
    ['Premium Cotton Shirt', 'Classic fit cotton shirt with button-down collar, perfect for formal and casual wear', 54.99, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', 'Fashion', 75],
    ['Slim Fit Chino Pants', 'Comfortable chino pants with stretch fabric and modern slim fit design', 69.99, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', 'Fashion', 65],
    ['Luxury Wool Overcoat', 'Premium wool blend overcoat with elegant design, perfect for winter', 199.99, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80', 'Fashion', 35],
    
    // Accessories
    ['Stainless Steel Water Bottle', 'Insulated bottle keeps drinks cold for 24 hours and hot for 12 hours', 34.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 'Accessories', 120],
    ['Travel Mug', 'Leak-proof travel mug with double-wall insulation', 24.99, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80', 'Accessories', 100],
    ['Phone Stand', 'Adjustable aluminum phone stand for desk', 19.99, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 'Accessories', 150],
    ['Laptop Sleeve', 'Protective laptop sleeve with soft interior lining', 29.99, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', 'Accessories', 80],
    ['Portable Charger', '20000mAh power bank with fast charging and dual USB ports', 44.99, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 'Accessories', 90],
    ['Cable Organizer', 'Premium cable management system for desk organization', 16.99, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80', 'Accessories', 200],
    ['Desk Lamp LED', 'Adjustable LED desk lamp with touch control and USB charging', 54.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 'Accessories', 70],
    ['Yoga Mat', 'Non-slip yoga mat with carrying strap and extra cushioning', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', 'Accessories', 65]
  ];

  const stmt = db.prepare('INSERT INTO products (name, description, price, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)');
  products.forEach(product => stmt.run(product));
  stmt.finalize();
  console.log('Sample products inserted - 27 products across 3 categories (including 3 clothing items)');
}

module.exports = db;
