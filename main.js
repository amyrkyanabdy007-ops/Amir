document.addEventListener('DOMContentLoaded', async () => {
  await loadProductsFromAPI();

  const featuredEl = document.getElementById('featuredProducts');
  if (featuredEl) {
    const featured = products.slice(0, 4);
    featuredEl.innerHTML = featured.map(p => createProductCard(p)).join('');
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('با موفقیت در خبرنامه عضو شدید!');
      newsletterForm.reset();
    });
  }

  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      if (nav.style.display === 'block') {
        nav.style.display = '';
      } else {
        nav.style.display = 'block';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.right = '0';
        nav.style.left = '0';
        nav.style.background = 'white';
        nav.style.padding = '20px';
        nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        nav.querySelector('ul').style.flexDirection = 'column';
        nav.querySelector('ul').style.gap = '16px';
      }
    });
  }
});

function createProductCard(product) {
  return `
    <div class="product-card">
      ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
      <a href="product.html?id=${product.id}">
        <div class="product-img"><i class="fas fa-tshirt"></i></div>
      </a>
      <div class="product-info">
        <div class="product-category">${getCategoryName(product.category)}</div>
        <h3 class="product-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="add-to-cart" onclick="addToCart(${product.id})">
            <i class="fas fa-cart-plus"></i> افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  `;
}
