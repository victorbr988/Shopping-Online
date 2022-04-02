const getOl = document.querySelector('.items');
const getInput = document.querySelector('#search-items');
let itemLocalStorage = [];
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
function createElementsHTML(element, classe, content) {
  const create = document.createElement(element);
  create.className = classe;
  create.innerText = content;
  return create;
}
// função que é executada após clicar em um dos items do carrinho
function handleClick(item) {
  item.remove();
}
// função que adiciona o item ao carrinho quando clica no botão de adicionar
function addItemInCart(image, name, price) {
  const createLi = document.createElement('li', 'item_cart')
  createLi.style.padding = '1rem';

  const createButton = createElementsHTML('button', 'btn', 'X')
  createButton.addEventListener('click', () => handleClick(createLi));

  
  createLi.appendChild(createImageItem(image));
  createLi.appendChild(createElementsHTML('p', 'cart_item', name))
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
    addItemInCart(thumbnail, title, price)
    itemLocalStorage.push({id, thumbnail, price, title});
    localStorage.setItem('cartProduct', JSON.stringify(itemLocalStorage));
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
  buttonClearItemsCart.addEventListener('click', () => getOl.innerHTML = '');
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
  const getElementP = document.querySelector('.count-Intems');
  if(getElementP.innerHTML > 0) {
    getElementP.style.color = 'red';
  }
}
countItemsInCart();
function onloadPage() {
  if(localStorage.getItem('cartProducts') !== null) {
    itemLocalStorage = JSON.parse(localStorage.getItem('cartProduct'));
    console.log(itemLocalStorage);
  }
}

window.onload = () => { onloadPage(); }
