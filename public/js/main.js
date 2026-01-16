// Add to cart function
async function addToCart(productId) {
  const quantityInput = document.getElementById('quantity');
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

  try {
    const response = await fetch('/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });

    const data = await response.json();
    
    if (data.success) {
      showNotification('✅ Product added to cart!', 'success');
      updateCartCount();
    } else {
      showNotification('❌ Failed to add product', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('❌ An error occurred', 'error');
  }
}

// Toggle wishlist
async function toggleWishlist(productId, button) {
  try {
    const isActive = button.classList.contains('active');
    const endpoint = isActive ? '/wishlist/remove' : '/wishlist/add';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });

    const data = await response.json();
    
    if (data.success) {
      if (isActive) {
        button.classList.remove('active');
        showNotification('💔 Removed from wishlist', 'success');
        
        // If on wishlist page, remove the card
        if (window.location.pathname === '/wishlist') {
          const card = button.closest('.product-card');
          card.style.animation = 'fadeOut 0.3s';
          setTimeout(() => {
            card.remove();
            // Check if wishlist is empty
            const grid = document.querySelector('.products-grid');
            if (grid && grid.children.length === 0) {
              location.reload();
            }
          }, 300);
        }
      } else {
        button.classList.add('active');
        showNotification('❤️ Added to wishlist!', 'success');
      }
    } else {
      showNotification('❌ ' + (data.error || 'Failed to update wishlist'), 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('❌ An error occurred', 'error');
  }
}

// Check wishlist status on page load
document.addEventListener('DOMContentLoaded', async () => {
  const wishlistButtons = document.querySelectorAll('.wishlist-btn[data-product-id]');
  
  for (const button of wishlistButtons) {
    const productId = button.dataset.productId;
    try {
      const response = await fetch(`/wishlist/check/${productId}`);
      const data = await response.json();
      
      if (data.inWishlist) {
        button.classList.add('active');
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }
});

// Update cart item quantity
async function updateCart(productId, quantity) {
  try {
    const response = await fetch('/cart/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: parseInt(quantity) })
    });

    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Remove from cart
async function removeFromCart(productId) {
  if (!confirm('Remove this item from cart?')) return;

  try {
    const response = await fetch('/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId })
    });

    if (response.ok) {
      location.reload();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Update cart count in navigation
function updateCartCount() {
  setTimeout(() => {
    location.reload();
  }, 500);
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 2rem;
    background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);


// Fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }
`;
document.head.appendChild(fadeOutStyle);
