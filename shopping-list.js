'use strict';
// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ]
};
const checkedClass = 'shopping-item__checked';
//Creates a new element

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? checkedClass : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

// this function will be responsible for rendering the shopping list in
// the DOM

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

// this function will be responsible for when users add a new shopping list item

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function displayUncheckedItemsOnly() {
  console.log('`displayUncheckedItemsOnly` ran');

  $('#js-shopping-list-form').on('change', '.display-unchecked-items', event => {
    const checkedSelector = $(`span.${checkedClass}`).closest('li');
    if (event.target.checked) {
      checkedSelector.addClass('hidden');
    } else {
      checkedSelector.removeClass('hidden');
    }
  })
}

//this function is responsible for dynamic searching of STORE elements

function searchFilter() {
  console.log('`hideElement` ran');

  $('.js-shopping-list-entry').keyup(function(event) {
    let textInput = event.target.value;
    console.log(textInput);
    const itemsSelector = $('span.js-shopping-item').each((index, item) => {
      let selector = $(item).closest('li');
      item.innerText.includes(textInput) ?
        selector.removeClass('hidden') :
        selector.addClass('hidden');
    });
  });
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// this function will be responsible for when users click the "check" button on
  // a shopping list item.

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// this function will be responsible for when users want to delete a shopping list
// item

function handleDeleteItemClicked() {

  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  STORE.items.splice(itemIndex, 1);
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  displayUncheckedItemsOnly();
  searchFilter();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
