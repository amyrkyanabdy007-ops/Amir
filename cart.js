let cart = JSON.parse(localStorage.getItem('tshirtCart')) || [];

function saveCart() {
  localStorage.setItem('tshirtCart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, size = 'M', color = null, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    alert('محصول پیدا نشد. صفحه را رفرش کنید.');
    return;
  }

  const selectedColor = color || product.colors[0];
  const existing = cart.find(item =>
    item.id === productId && item.size === size && item.color === selectedColor
  );

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      size: size,
      color: selectedColor,
      qty: qty
    });
  }
  saveCart();
  showToast('محصول به سبد خرید اضافه شد!');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    removeFromCart(index);
  } else {
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (countEl) countEl.textContent = getCartCount();

  if (itemsEl) {
    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>سبد خرید شما خالی است</p>
        </div>
      `;
    } else {
      itemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <div class="cart-item-img"><i class="fas fa-tshirt"></i></div>
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="price">${formatPrice(item.price)} | سایز: ${item.size} | رنگ: ${getColorName(item.color)}</div>
            <div class="cart-item-qty">
              <button onclick="updateQty(${index}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="updateQty(${index}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('');
    }
  }

  if (totalEl) {
    totalEl.textContent = formatPrice(getCartTotal());
  }
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: #111827; color: white; padding: 14px 28px; border-radius: 50px;
    font-size: 14px; font-weight: 500; z-index: 9999;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      cartSidebar.classList.add('open');
      overlay.classList.add('show');
    });
  }
  if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
  if (overlay) overlay.addEventListener('click', closeCartSidebar);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cart.length === 0) {
        alert('سبد خرید شما خالی است!');
        return;
      }

      const customerName = prompt('نام و نام خانوادگی:');
      if (!customerName) return;
      const customerPhone = prompt('شماره تماس:');
      if (!customerPhone) return;

      try {
        if (typeof submitOrder === 'function') {
          await submitOrder({
            items: cart,
            customer: { name: customerName, phone: customerPhone },
            total: getCartTotal()
          });
        }
        alert('سفارش شما با موفقیت ثبت شد!\nجمع کل: ' + formatPrice(getCartTotal()) + '\nبه زودی با شما تماس می‌گیریم.');
        cart = [];
        saveCart();
        closeCartSidebar();
      } catch (err) {
        // حتی اگر API در دسترس نبود، پیام موفقیت نشان بده
        alert('سفارش شما ثبت شد!\nجمع کل: ' + formatPrice(getCartTotal()) + '\n(در نسخه دمو)');
        cart = [];
        saveCart();
        closeCartSidebar();
      }
    });
  }
});

function closeCartSidebar() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}
