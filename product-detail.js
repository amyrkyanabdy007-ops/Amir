let selectedSize = 'M';
let selectedColor = null;
let selectedQty = 1;
let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadProductsFromAPI();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));

  if (!productId) {
    document.getElementById('productDetail').innerHTML = '<p>محصول پیدا نشد.</p>';
    return;
  }

  currentProduct = products.find(p => p.id === productId);
  if (!currentProduct) {
    // Try fetch single
    try {
      currentProduct = await fetchProduct(productId);
    } catch (e) {
      document.getElementById('productDetail').innerHTML = '<p>محصول پیدا نشد.</p>';
      return;
    }
  }

  renderProductDetail(currentProduct);
  renderRelated(currentProduct);
});

function renderProductDetail(product) {
  selectedSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
  selectedColor = product.colors[0];

  const el = document.getElementById('productDetail');
  el.innerHTML = `
    <div class="product-gallery">
      <i class="fas fa-tshirt"></i>
    </div>
    <div class="product-detail-info">
      <div class="product-category">${getCategoryName(product.category)}</div>
      <h1>${product.name}</h1>
      <div class="price-box">
        <span class="current-price">${formatPrice(product.price)}</span>
        ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
      </div>
      <p class="description">${product.description}</p>

      <div class="size-selector">
        <h4>انتخاب سایز:</h4>
        <div class="size-options">
          ${product.sizes.map(s => `
            <button class="${s === selectedSize ? 'active' : ''}"
                    onclick="selectSize('${s}', this)">${s}</button>
          `).join('')}
        </div>
      </div>

      <div class="color-selector">
        <h4>انتخاب رنگ: <span id="selectedColorName">${getColorName(selectedColor)}</span></h4>
        <div class="color-options">
          ${product.colors.map(c => {
            const colorMap = {
              black: '#111', white: '#fff', gray: '#888',
              blue: '#2563eb', red: '#dc2626', green: '#16a34a'
            };
            return `
              <button class="${c === selectedColor ? 'active' : ''}"
                      style="background:${colorMap[c]};${c==='white'?'border:1px solid #ddd':''}"
                      onclick="selectColor('${c}', this)"
                      title="${getColorName(c)}"></button>
            `;
          }).join('')}
        </div>
      </div>

      <div class="qty-selector">
        <h4>تعداد:</h4>
        <div class="qty-controls">
          <button onclick="changeQty(-1)">−</button>
          <span id="qtyValue">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
      </div>

      <button class="btn btn-primary add-to-cart-detail" onclick="addToCartDetail(${product.id})">
        <i class="fas fa-cart-plus"></i> افزودن به سبد خرید
      </button>
    </div>
  `;
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectColor(color, btn) {
  selectedColor = color;
  document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('selectedColorName').textContent = getColorName(color);
}

function changeQty(delta) {
  selectedQty = Math.max(1, selectedQty + delta);
  document.getElementById('qtyValue').textContent = selectedQty;
}

function addToCartDetail(productId) {
  addToCart(productId, selectedSize, selectedColor, selectedQty);
}

function renderRelated(currentProduct) {
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  const el = document.getElementById('relatedProducts');
  if (el) {
    el.innerHTML = related.map(p => `
      <div class="product-card">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <a href="product.html?id=${p.id}">
          <div class="product-img"><i class="fas fa-tshirt"></i></div>
        </a>
        <div class="product-info">
          <div class="product-category">${getCategoryName(p.category)}</div>
          <h3 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="product-price">
            <span class="current-price">${formatPrice(p.price)}</span>
          </div>
          <div class="product-actions">
            <button class="add-to-cart" onclick="addToCart(${p.id})">
              <i class="fas fa-cart-plus"></i> افزودن به سبد
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
}
