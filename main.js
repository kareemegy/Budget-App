//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  return {
    addItem: function(type, des, val) {
      var newItem, id;
      id = 0;
      if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else if (type === "inc") {
        newItem = new Income(id, des, val);
      }
    }
  };
})();

//UI CONTROLLER
var UIController = (function() {
  //DOMStringsNmae
  var domString = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(domString.inputType).value,
        description: document.querySelector(domString.inputDescription).value,
        value: document.querySelector(domString.inputValue).value
      };
    },
    getDOMString: function() {
      return domString;
    }
  };
})();

//THE APP CONTROLLER
var controller = (function(budgetCtrl, uICtrl) {
  //CallBACKFUNC
  var ctrlAddItem = function() {
    //1. Get the field input DATA
    var input = uICtrl.getInput();

    //2. Add the item to the budget controller
    //3. Add the item to UI
    //4. Calculate the BUDGET
    //5. Display the BUDGET on the UI
  };

  //setupEventListeners
  var setupEventListeners = function() {
    var dom = uICtrl.getDOMString();
    document.querySelector(dom.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("Appliction has started");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
