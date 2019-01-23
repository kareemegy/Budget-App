//BUDGET CONTROLLER
var budgetController = (function() {})();

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

// THE APP CONTROLLER
var controller = (function(budgetCtrl, uICtrl) {
  var dom = uICtrl.getDOMString();
  var ctrlAddItem = function() {
    //1. Get the field input DATA
    var input = uICtrl.getInput();

    console.log(input);
    //2. Add the item to the budget controller
    //3. Add the item to UI
    //4. Calculate the BUDGET
    //5. Display the BUDGET on the UI
  };

  document.querySelector(dom.inputBtn).addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
