const getOl = document.querySelector('.items');
// preciso pegar os items da API
async function requestAPI() {
  const API_URL = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=sapato')
  .then((response) => response.json())
  .then((data) => data);
  return API_URL;
}
// preciso pegar somente as informações dos produtos
async function getInfoProducts() {
  const products = await requestAPI();
  const getInfoItems = products.results;
  getInfoItems.forEach((item) => createElementItems(item));
  return products;
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
function handleClick() {
  console.log(getOl)
}
// preciso adicionar o item ao carrinho quando clico no botão de adicionar
function addItemInCart(image, name, price) {
  const createLi = document.createElement('li', 'item_cart')
  createLi.style.padding = '1rem';

  const createButton = createElementsHTML('button', 'btn', 'X')
  createButton.addEventListener('click', handleClick)

  
  createLi.appendChild(createImageItem(image));
  createLi.appendChild(createElementsHTML('p', 'cart_item', name))
  createLi.appendChild(createButton);
  createLi.appendChild(createElementsHTML('h3', 'cart_item', `R$ ${price}`))
  
  getOl.appendChild(createLi);
}
// preciso criar os elementos que serão adicionado na tela após a requisição da API
function createElementItems({id, thumbnail, price, title}) {
  const getFatherItems = document.querySelector('#products');
  const createSection = document.createElement('section');
  createSection.className = 'section';
  const button = createElementsHTML('button', 'button', 'Adicionar ao carrinho');
  button.addEventListener('click', () => addItemInCart(thumbnail, title, price));


  createSection.appendChild(createElementsHTML('span', 'id', id))
  createSection.appendChild(createImageItem(thumbnail));
  createSection.appendChild(createElementsHTML('p', 'title', title))
  createSection.appendChild(createElementsHTML('h4', 'price', `R$ ${price}`))
  createSection.appendChild(button);
  getFatherItems.appendChild(createSection);
};