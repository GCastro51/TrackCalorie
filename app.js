// Storage Controller 
const StorageCtrl = (function() {
  // Public Methods
  return {
    
    //Store Item
    storeItem: function(item) {
      let items = [];

      // Check if any items in LS
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        // items exist in LS
        // get current items in LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);
        // Re-set LS
        localStorage.setItem('items', JSON.stringify(items));

      }

      //localStorage.getItem('items');
    },
    getItemsFromStorage: function() {
      let items;

      if(localStorage.getItem('items') === null) {
        items = [];

      } else {
        // items exist in LS
        // get items in LS
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });

      // Re-set LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if(id === item.id){
          items.splice(index, 1);
        }
      });

      // Re-set LS
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllFromStorage: function() {
      // Clear Items 
      localStorage.removeItem('items');
    }
  }
})();

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 200},
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      
      let ID;

      // Create ID
      if(data.items.length > 0){
        // auto increment id for new item
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;

    },
    getItemById: function(id) {
      let found = null;
      //loop through items
      data.items.forEach(function(item){
        if(item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function(name, calories) {
      // Update item in data structure
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // remove item - take 1 from index
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // loop through items and add calories
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      // return total
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }

})();



// UI Controller
const UICtrl = (function(){

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn',
  }
  
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `<li id="item-${item.id}" class="collection-item">
                  <b>${item.name}: </b> <em>${item.calories} Calories</em>
                  <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                  </a>
                  </li>`;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `
        <b>${item.name}: </b> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemId = listItem.getAttribute('id');

        if(itemId === `item-${item.id}`){
          document.querySelector(`#${itemId}`).innerHTML = `<b>${item.name}: </b> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      
    },
    getSelectors: function() {
      return UISelectors;
    }


  }
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

  // Load Event Listeners
  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Clear All items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if(input.name !== '' && input.calories !== '') {
      // Add item 
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in Local Storage
      StorageCtrl.storeItem(newItem);

      // Clear input fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item button
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')){
      // Get list item id (item-0, item-1, etc)
      const listId = e.target.parentNode.parentNode.id;

      // break into an array, 0 - item, 1 - id
      const listIdArray = listId.split('-');

      // Get actual ID
      const id = parseInt(listIdArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function (e) {

    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // delete item submit
  const itemDeleteSubmit = function (e) {
    
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // clear items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Clear all from LS
    StorageCtrl.clearAllFromStorage();

    // Remove from UI
    UICtrl.removeItems();

    // Hide UL
    UICtrl.hideList();
    
  }
  
  // Public methods
  return {
    init: function(){
      console.log('Initializing App..');

      // Clear Edit state / set init state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load Event listeners
      loadEventListeners();
      
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();