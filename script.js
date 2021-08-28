const shoppingCart = '.cart__items';
const PRICE_ALL = document.querySelector('.total-price');

// Requisito 7
const carregando = () => {
  const loading = document.createElement('h2');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.body.appendChild(loading);
};

const apiMercadoLivre = async (computador) => {
  carregando();
  const apiProdutos = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`);
  const produtosJson = await apiProdutos.json(); 
  document.querySelector('h2').remove();
  return produtosJson;
};

// Requisito 4
const atualizarLocalStorage = () => {
  const carrinho = document.querySelector(shoppingCart);
  localStorage.setItem('productItem', carrinho.innerHTML);
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

function cartItemClickListener(event) {
  const precoItemRemove = event.target.innerText.split('$')[1];
  const numberRemove = Number(precoItemRemove);
  const h4 = document.querySelector('.total').innerText.split('$')[1];
  const h4Number = Number(h4);
  const sub = h4Number - numberRemove;
  PRICE_ALL.innerText = sub;
  localStorage.setItem('valor', sub);
  event.target.remove(); 
  atualizarLocalStorage();
}

const excluirProdutos = () => {
  const buttonExclui = document.querySelector('.empty-cart');
  buttonExclui.addEventListener('click', () => {
    const carrinho = document.querySelector(shoppingCart);
    carrinho.innerHTML = '';
    PRICE_ALL.innerText = 0;
    localStorage.clear();
  });
};

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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function summation() {
  let soma = 0;
  const itemAll = document.querySelectorAll('.cart__item');
  itemAll.forEach((item) => {
  const valueNumber = Number(item.innerText.split('$')[1]);
  soma += valueNumber;
  const h4 = document.querySelector('.total-price');
  soma.toFixed(2);
  h4.innerText = soma;
  localStorage.setItem('valor', soma);
  });
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
      summation();
      atualizarLocalStorage();
      });
  });
}

const salvarCarrinho = () => {
  const carrinho = document.querySelector(shoppingCart);
  const salveLocal = localStorage.getItem('productItem');
  const value = localStorage.getItem('valor');
  carrinho.innerHTML = salveLocal;
  PRICE_ALL.innerHTML = value;
};

const carrinho = document.querySelector(shoppingCart);
carrinho.addEventListener('click', cartItemClickListener);

window.onload = async () => {
  await salvarCarrinho();
  await apiMercadoLivre('computador')
  .then((jsonData) => {
    const resultSearch = jsonData.results;
    resultSearch.forEach((resultSearchs) => addProducts(resultSearchs));
  });
  elementButton();
  excluirProdutos();
};
