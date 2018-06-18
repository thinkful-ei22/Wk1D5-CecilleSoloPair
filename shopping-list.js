'use strict';

// Contains the initial values of the list. To be modified as the user interacts

const STORE = {
  items: [
    {name: 'apples', checked: false, edit: false},
    {name: 'oranges', checked: false, edit: false},
    {name: 'milk', checked: true, edit: false},
    {name: 'bread', checked: false, edit: false}
  ],
  displayUncheckedItemsOnly: false
};

const checkedClass = 'shopping-item__checked';

function itemHtmlString(item) {
  if (item.edit) {
    return `
      <span class="shopping-item js-shopping-item ${item.checked ? checkedClass : ''} " style="display: none;">${item.name}</span>
      <input type="text" value="${item.name}">`
  } else {
    return `<span class="shopping-item js-shopping-item ${item.checked ? checkedClass : ''}">${item.name}</span>`;
  }
}

function itemEditSaveHtmlString(item) {
  if (item.edit){
    return `
    <button class="shopping-item-edit js-item-save">
        <span class="button-label">save</span>
    </button>`;
  } else {
    return `
    <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
    </button>`;
  }
}


//Creates a new element

function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      ${itemHtmlString(item)}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
        ${itemEditSaveHtmlString(item)}
      </div>
    </li>`;
}
//First helper function which allows the renderShoppingList function

function generateShoppingItemsString(shoppingList) {

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}

//Second helper function which allows the renderShoppingList function to execute

function generateShoppingList(store) {

  const items = generateShoppingItemsString(store.items.filter(item => {
    if (store.displayUncheckedItemsOnly) {
      return !item.checked; //returns unchecked
    } else {
      return true; //returns all
    }
  }));

  return `
    <h1>Shopping List</h1>
    <form id="js-shopping-list-form">
        <label for="shopping-list-entry">Add an item</label>
        <input type="text" name="shopping-list-entry" class="js-shopping-list-entry" placeholder="e.g., broccoli">
        <button type="submit">Add item</button>
        <label for="display-unchecked-items">Display Unchecked Items Only</label>
        <input type="checkbox" class="display-unchecked-items" ${store.displayUncheckedItemsOnly ? 'checked' : ''}>
    </form>
    <ul class="shopping-list js-shopping-list">
      ${items}
    </ul>`;
}

// Function that ultimately renders the shopping list in the DOM

function renderShoppingList() {
  console.log('`renderShoppingList` ran');
  console.log(STORE);
  const shoppingList = generateShoppingList(STORE);

  // inserts the HTML into the DOM
  $('.container').html(shoppingList);
}

// Helper function for handleNewItemSubmit function

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, edit: false});
}

// Function that adds new item to the shopping list

function handleNewItemSubmit() {
  $('.container').submit(function(event) {
    console.log('`handleNewItemSubmit` ran');
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
  $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

// Helper function for handleItemCheckClicked function

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function displayUncheckedItemsOnly() {
  console.log('`displayUncheckedItemsOnly` ran');

  $('.container').on('change', '.display-unchecked-items', event => {

    STORE.displayUncheckedItemsOnly = !STORE.displayUncheckedItemsOnly;
    renderShoppingList();
  })

}

// Function that allows for dynamic search filtering in textbox

function searchFilter() {
  $('.container').on('keyup', '.js-shopping-list-entry', function(event) {
    console.log('`searchFilter` ran');
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

// Helper function for handleItemCheckClicked and handleDeleteItemClicked functions

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// Function that checks off items in the shopping list

function handleItemCheckClicked() {
  $('.container').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// Function that deletes items in the shopping list

function handleDeleteItemClicked() {

  $('.container').on('click', `.js-item-delete`, event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

// Function that edits the item titles in the shopping list

function handleEditItemClicked() {
  $('.container').on('click', `.js-item-edit`, event => {
    console.log('`handleEditItemClicked` ran');
        const itemIndex = getItemIndexFromElement(event.currentTarget);
        const itemName = $(event.currentTarget).find('.shopping-item').val();
        editListItem(itemIndex, itemName);
        renderShoppingList();
  })
}

function handleSaveItemClicked() {
  $('.container').on('click', `.js-item-save`, event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    console.log($(event.currentTarget).find('input'))
    const newItemName = $(event.currentTarget).closest('li').find('input').val();
    saveEditListItem(itemIndex, newItemName);
    renderShoppingList();
  });
}

// Helper function for handleDeleteItemClicked function

function deleteListItem(itemIndex) {
  console.log(`Deleting item at index ${itemIndex} from shopping list`);

  STORE.items.splice(itemIndex, 1);
}

//Helper function for handleEditItemClicked function

function editListItem(itemIndex, itemName) {
  console.log(`Editing item name at index ${itemIndex} in shopping list`);
  STORE.items[itemIndex].edit = true;
}

//Helper function for handleEditItemClicked function

function saveEditListItem(itemIndex, newItemName) {
  console.log(`Editing item name at index ${itemIndex} in shopping list`);
  STORE.items[itemIndex].edit = false;
  STORE.items[itemIndex].name = newItemName;
}

// Callback function for when the page loads

function handleShoppingList() {

  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditItemClicked();
  handleSaveItemClicked();
  displayUncheckedItemsOnly();
  searchFilter();
  renderShoppingList();
}

$(handleShoppingList)
