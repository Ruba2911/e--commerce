# 🛍️ Elegant E-commerce Store

A beautiful, full-featured e-commerce website with an elegant UI design built with Node.js, Express, and SQLite.

## ✨ Features

- **Attractive & Elegant Design**: Modern gradient UI with smooth animations
- **Product Catalog**: Browse products by category with beautiful product cards
- **Product Details**: Detailed product pages with images and descriptions
- **Shopping Cart**: Add, update, and remove items from cart
- **User Authentication**: Register and login functionality with secure password hashing
- **Order Processing**: Complete checkout flow with order confirmation
- **Order History**: View all past orders
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and visit:
```
http://localhost:3000
```

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## 📁 Project Structure

```
elegant-ecommerce/
├── public/
│   ├── css/
│   │   └── style.css          # Beautiful CSS styling
│   └── js/
│       └── main.js            # Client-side JavaScript
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── products.js            # Product routes
│   ├── cart.js                # Shopping cart routes
│   └── orders.js              # Order processing routes
├── views/
│   ├── index.ejs              # Home page
│   ├── products.ejs           # Products listing
│   ├── product-detail.ejs     # Product details
│   ├── cart.ejs               # Shopping cart
│   ├── checkout.ejs           # Checkout page
│   ├── order-confirmation.ejs # Order confirmation
│   ├── my-orders.ejs          # Order history
│   ├── login.ejs              # Login page
│   └── register.ejs           # Registration page
├── database.js                # Database setup and initialization
├── server.js                  # Main server file
└── package.json               # Dependencies
```

## 🎨 Design Features

- **Gradient Hero Section**: Eye-catching purple gradient header
- **Smooth Animations**: Fade-in effects and hover transitions
- **Card-based Layout**: Modern product cards with shadows
- **Responsive Grid**: Adapts to all screen sizes
- **Clean Typography**: Professional font choices
- **Color Scheme**: Purple/blue gradient with accent colors

## 🔐 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Protected routes for checkout and orders
- SQL injection prevention with parameterized queries

## 💾 Database

Uses SQLite with the following tables:
- **users**: User accounts
- **products**: Product catalog
- **orders**: Order records
- **order_items**: Individual items in orders

Sample products are automatically inserted on first run.

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Template Engine**: EJS
- **Authentication**: bcryptjs, express-session
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## 📝 Usage

1. **Browse Products**: Visit the home page to see featured products
2. **Register**: Create an account to place orders
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Review your cart and proceed to checkout
5. **Place Order**: Fill in shipping details and confirm order
6. **View Orders**: Check your order history in "My Orders"

## 🎯 Future Enhancements

- Payment gateway integration
- Product search functionality
- Product reviews and ratings
- Admin dashboard
- Email notifications
- Wishlist feature

## 📄 License

This project is open source and available for educational purposes.

---

Built with ❤️ for elegant e-commerce experiences
