const getOl = document.querySelector('.items');
const getInput = document.querySelector('#search-items');
let itemLocalStorage = [];
const priceTotal = document.querySelector('#total-price');

function saveProducsInLocalStorage() {
  localStorage.setItem('cartProduct', JSON.stringify(itemLocalStorage));
}
// função que apaga todos os itens retornados da API
function deleteSections() {
  const getSections = document.querySelector('#products');
  getSections.innerHTML = ''
}

// função que adiciona novamente os itens da API
function addSections() {
  const getSectionFather = document.querySelector('.space_products');
  const createDiv = document.createElement('div')
  createDiv.id = 'products';
  getSectionFather.appendChild(createDiv);
}
// função que pega os dados digitados pelo usuário e passa como parâmetro para requisição da API
function addValueInputInApiRequest() {
  const getButtonSearch = document.querySelector('#search');
  getButtonSearch.addEventListener('click', () => {
    deleteSections();
    addSections();
    getInfoProducts(getInput.value);
    getInput.value = '';
  });
}
addValueInputInApiRequest();

// preciso pegar os items da API
function requestAPI(search) {
  const API_URL = fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then((response) => response.json())
  .then((data) => data);
  return API_URL;
}

// adicionando texto de carregamento enquanto é feita a requisiçao da API
function addloading() {
  const createSectionLoading = document.createElement('section');
  createSectionLoading.className = 'loading';
  createSectionLoading.appendChild(createElementsHTML('h1', 'message', 'Carregando...'));
  const getMain = document.querySelector('.userData');
  getMain.appendChild(createSectionLoading);
  return createSectionLoading;
}

// função que remove o elemento que contém a mensagem carregando
function removeLoading() {
  const getElement = document.querySelector('.loading');
  getElement.remove();
}

// preciso pegar somente as informações dos produtos
async function getInfoProducts(search) {
  addloading()
  const products = await requestAPI(search);
  removeLoading()
  const getInfoItems = products.results;
  getInfoItems.forEach((item) => createElementItems(item));
}
getInfoProducts();

// preciso fazer uma função que cria elementos para facilitar
function createImageItem(url) {
  const createImage = document.createElement('img');
  createImage.className = 'image';
  createImage.setAttribute('src', url);
  return createImage
}

// função que cria os elementos HTML
function createElementsHTML(element, classe, content) {
  const create = document.createElement(element);
  create.className = classe;
  create.innerText = content;
  return create;
}
// função que é executada após clicar em um dos items do carrinho
function handleClick(item) {
  const idProduct = item.firstChild.innerHTML;
  const missingProducts = itemLocalStorage.find(({ id }) => id === idProduct);
  const indexElement = itemLocalStorage.indexOf(missingProducts);
  itemLocalStorage.splice(indexElement, 1);
  saveProducsInLocalStorage();
  item.remove();
  subPrices();
}
// função que adiciona o item ao carrinho quando clica no botão de adicionar
function addItemInCart({id, thumbnail, price, title}) {
  const createLi = document.createElement('li', 'item_cart')
  createLi.style.padding = '1rem';

  const createButton = createElementsHTML('button', 'btn', 'X')
  createButton.addEventListener('click', () => {
    handleClick(createLi)
    countItemsInCart();
  });

  createLi.appendChild(createElementsHTML('span', 'cart_item', id));
  createLi.appendChild(createImageItem(thumbnail));
  createLi.appendChild(createElementsHTML('p', 'cart_item', title));
  createLi.appendChild(createButton);
  createLi.appendChild(createElementsHTML('h3', 'cart_item', `R$ ${price}`))
  
  getOl.appendChild(createLi);
}
// função que cria os elementos que serão adicionado na tela após a requisição da API
function createElementItems({id, thumbnail, price, title}) {
  const getFatherItems = document.querySelector('#products');
  const createSection = document.createElement('section');
  createSection.className = 'section';
  const button = createElementsHTML('button', 'button', 'Adicionar ao carrinho');

  button.addEventListener('click', () => {
    addItemInCart({ thumbnail, title, price, id })
    itemLocalStorage.push({id, thumbnail, price, title});
    saveProducsInLocalStorage();
    countItemsInCart();
    sumPriceItems();
  });

  createSection.appendChild(createElementsHTML('span', 'id', id))
  createSection.appendChild(createImageItem(thumbnail));
  createSection.appendChild(createElementsHTML('p', 'title', title))
  createSection.appendChild(createElementsHTML('h4', 'price', `R$ ${price}`))
  createSection.appendChild(button);
  
  getFatherItems.appendChild(createSection);
};

//função que deleta todos os itens dentro do carrinho de compras
function deleteALLItemsCart() {
  const buttonClearItemsCart = document.querySelector('.clear');
  buttonClearItemsCart.addEventListener('click', () => {
    getOl.innerHTML = '';
    countItemsInCart()
    localStorage.removeItem('cartProduct');
    sumPriceItems();
    localStorage.removeItem('Sum');
    priceTotal.innerHTML = 'Total: R$ 00,00';
  });
}
deleteALLItemsCart();

// função que mostra e esconde o carrinho de compras ao clicar no ícone do carrinho 
function cartVisible() {
  const getIconCart = document.querySelector('.cart-icon');
  getIconCart.addEventListener('click', () => {
    const getCartItems = document.querySelector('.carts');
    if(getCartItems.style.display === 'none') getCartItems.style.display = 'block';
    else getCartItems.style.display = 'none';
  })
}
cartVisible();

// função que conta a quantidade de itens dentro do carrinho 
function countItemsInCart() {
  const totalCart = getOl.childElementCount;
  const getElementP = document.querySelector('.count-Intems');
  getElementP.style.color = 'green'
  getElementP.innerHTML = totalCart;
  if(getElementP.innerHTML > 0) getElementP.style.color = 'red';
}

// função soma os valores dos produtos
function sumPriceItems() {
  const sum  = itemLocalStorage.reduce((acc, currenty) => acc + currenty.price, 0);
  priceTotal.innerHTML = `
  Total : ${sum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
  localStorage.setItem('Sum', sum.toFixed(2));
}

function subPrices() {
  const sum  = Math.abs(itemLocalStorage.reduce((acc, currenty) => acc - currenty.price, 0));
  priceTotal.innerHTML = `
  Total : ${sum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
  localStorage.setItem('Sum', sum.toFixed(2));
};

// função que é chamada quando a página é recarregada
function onloadPage() {
  if(localStorage.getItem('cartProduct') !== null) {
    itemLocalStorage = JSON.parse(localStorage.getItem('cartProduct'));
    itemLocalStorage.forEach((element) => addItemInCart(element));
    countItemsInCart();
    const getSum = Number(localStorage.getItem('Sum'));
    priceTotal.innerHTML = `
    Total : ${getSum.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
  }
}
window.onload = () => { onloadPage(); }