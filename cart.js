let cart = [];

let appliedPromoCode = null;

function addToCart(productId) {
  const product = getProductById(productId);
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}
function getProductById(productId) {
  const products = [
    { id: 1, name: 'Foundation', price: 39.00 },
    { id: 2, name: 'Mascara', price: 15.00 },
    { id: 3, name: 'Lipstick', price: 25.00 },
    { id: 4, name: 'Blush', price: 33.00 },
    { id: 5, name: 'Eyeshadow Palette', price: 56.00 },
    { id: 6, name: 'Eyeliner', price: 25.00 },
    { id: 7, name: 'Concealer', price: 30.00 },
    { id: 8, name: 'Setting Spray', price: 38.00 },
    { id: 9, name: 'Highlighter', price: 33.00 },
  ];
  return products.find(product => product.id === productId);
}
function updateCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total').querySelector('h3');
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    
    cartItem.innerHTML = `
      <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
      <button class="increase" onclick="updateQuantity(${item.id}, 1)">+</button>
      <button class="decrease" onclick="updateQuantity(${item.id}, -1)">-</button>
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
    totalPrice += item.price * item.quantity;
  });

  const subtotalElement = document.getElementById('subtotal');
  subtotalElement.textContent = totalPrice.toFixed(2);

  updateDiscountAndTotal(totalPrice);
}

function updateQuantity(productId, change) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
    }
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}

document.getElementById('apply-promo').addEventListener('click', () => {
  const promoCodeInput = document.getElementById('promo-code').value.trim().toLowerCase();
  const promoMessage = document.getElementById('promo-message');

  if (promoCodeInput === '') {
    promoMessage.textContent = 'Please enter a promo code.';
    return;
  }

  if (appliedPromoCode) {
    promoMessage.textContent = 'Promo code has already been applied.';
    return;
  }

  if (promoCodeInput === 'ostad10') {
    appliedPromoCode = 'ostad10';
    promoMessage.textContent = '10% discount applied!';
    updateCart();
  } else if (promoCodeInput === 'ostad5') {
    appliedPromoCode = 'ostad5';
    promoMessage.textContent = '5% discount applied!';
    updateCart();
  } else {
    promoMessage.textContent = 'Invalid promo code. Please try again.';
  }
});

function updateDiscountAndTotal(subtotal) {
  let discountAmount = 0;

  if (appliedPromoCode === 'ostad10') {
    discountAmount = subtotal * 0.10; 
  } else if (appliedPromoCode === 'ostad5') {
    discountAmount = subtotal * 0.05; 
  }

  document.getElementById('discount-amount').textContent = discountAmount.toFixed(2);
  const finalTotal = subtotal - discountAmount;
  document.getElementById('final-total').textContent = finalTotal.toFixed(2);
}

document.getElementById('checkout').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some items before checking out!');
  } else {
    alert('Great! Your Total Is: $' + calculateTotal().toFixed(2));
    cart = [];
    updateCart();
  }
});

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}