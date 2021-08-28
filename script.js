const apiMercadoLivre = async (computador) => {
  const apiProdutos = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const produtosJson = await apiProdutos.json(); 
  return produtosJson;
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const addProducts = (resultReash) => {
  const productElementItems = createProductItemElement({
    sku: resultReash.id,
    name: resultReash.title,
    image: resultReash.thumbnail,
   });
   const sectionItems = document.querySelector('.items');
   sectionItems.appendChild(productElementItems); 
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove(); 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function elementButton() {
  const addCart = document.querySelectorAll('.item__add');
  addCart.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const cart = document.querySelector('.cart__items');
      const productId = getSkuFromProductItem(event.target.parentNode);
      const apiProduct = await fetch(`https://api.mercadolibre.com/items/${productId}`);
      const apiJson = await apiProduct.json();
      const object = { sku: apiJson.id, name: apiJson.title, salePrice: apiJson.price };
      const liProduct = createCartItemElement(object);
      cart.appendChild(liProduct);
      });
  });
}

window.onload = async () => { 
  await apiMercadoLivre()
  .then((jsonData) => {
    const resultSearch = jsonData.results;
    resultSearch.forEach((resultSearchs) => addProducts(resultSearchs));
  });
  elementButton();
};
