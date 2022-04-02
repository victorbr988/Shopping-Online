const getOl = document.querySelector('.items');

// função que pega os dados digitados pelo usuário e passa como parâmetro para requisição da API
const getButtonSearch = document.querySelector('#search');

getButtonSearch.addEventListener('click', () => {
  const getInput = document.querySelector('#search-items').value;
  getInfoProducts(getInput);
  getInput.innerHTML = '';
  
});

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
function handleClick(item) {
  item.remove();
}
// preciso adicionar o item ao carrinho quando clico no botão de adicionar
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