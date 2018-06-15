$(const getGroceries = function() {

//Event Listener for the form's submit button

$('#js-shopping-list-form').submit(function(event) {
  event.preventDefault();

//Contain the text box's input into a variable called item

const item = $('.js-shopping-list-entry').val();

//Sets the initial value of the text box input as empty

$('.js-shopping-list-entry').val(' ');

//With item defined, we append the shopping list class to account for new items

$('.shopping-list').append(
  `<li>
    <span class="shopping-item">${item}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete">
        <span class="button-label">delete</span>
      </button>
    </div>
  </li>`);



});
