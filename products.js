let filteredProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadProductsFromAPI();
  filteredProducts = [...products];

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    const radio = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
    if (radio) radio.checked = true;
  }

  applyFilters();
  setupEventListeners();
});

function setupEventListeners() {
  document.querySelectorAll('input[name="category"]').forEach(el => {
    el.addEventListener('change', applyFilters);
  });
  document.querySelectorAll('input[name="size"]').forEach(el => {
    el.addEventListener('change', applyFilters);
  });
  document.querySelectorAll('input[name="color"]').forEach(el => {
    el.addEventListener('change', applyFilters);
  });

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      document.getElementById('priceValue').textContent =
        parseInt(priceRange.value).toLocaleString('fa-IR');
      applyFilters();
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFilters);
  }

  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelector('input[name="category"][value="all"]').checked = true;
      document.querySelectorAll('input[name="size"]').forEach(el => el.checked = false);
      document.querySelectorAll('input[name="color"]').forEach(el => el.checked = false);
      document.getElementById('priceRange').value = 800000;
      document.getElementById('priceValue').textContent = '۸۰۰٬۰۰۰';
      document.getElementById('sortSelect').value = 'default';
      applyFilters();
    });
  }
}

function applyFilters() {
  const category = document.querySelector('input[name="category"]:checked')?.value || 'all';
  const selectedSizes = [...document.querySelectorAll('input[name="size"]:checked')].map(el => el.value);
  const selectedColors = [...document.querySelectorAll('input[name="color"]:checked')].map(el => el.value);
  const maxPrice = parseInt(document.getElementById('priceRange')?.value || 800000);
  const sortBy = document.getElementById('sortSelect')?.value || 'default';

  filteredProducts = products.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (p.price > maxPrice) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some(s => p.sizes.includes(s))) return false;
    if (selectedColors.length > 0 && !selectedColors.some(c => p.colors.includes(c))) return false;
    return true;
  });

  if (sortBy === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === 'name') filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'fa'));

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('allProducts');
  const countEl = document.getElementById('productCount');

  if (countEl) {
    countEl.textContent = filteredProducts.length.toLocaleString('fa-IR') + ' محصول';
  }

  if (grid) {
    if (filteredProducts.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:#6b7280;">محصولی با این فیلترها پیدا نشد.</p>';
    } else {
      grid.innerHTML = filteredProducts.map(p => createProductCard(p)).join('');
    }
  }
}

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
