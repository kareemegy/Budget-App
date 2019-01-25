//BUDGET CONTROLLER
var budgetController = (function() {
  // Obj Constructor
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
  // Calculate the inc - exp
  var calculatetotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };
  // THE APP DATA
  var data = {
    allItems: { exp: [], inc: [] },
    totals: { exp: 0, inc: 0 },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function(type, des, val) {
      var newItem, id;
      //Create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      //Create new Item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(id, des, val);
      } else if (type === "inc") {
        newItem = new Income(id, des, val);
      }
      //Push it  into our Data Strcture
      data.allItems[type].push(newItem);
      //Return the new element
      return newItem;
    },
    calculateBudget: function() {
      // 1.calculate total  income and expenses
      calculatetotal("exp");
      calculatetotal("inc");
      // 2.Calculate the budget :income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        // 3.calculate the percentage of income that we spent
        data.percentage = Math.round(data.totals.exp / data.totals.inc) * 100;
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testting: function() {
      console.log(data);
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
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetlabel: ".budget__value",
    incomelabel: ".budget__income--value",
    expenseslabel: ".budget__expenses--value",
    percentagelabel: ".budget__expenses--percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(domString.inputType).value,
        description: document.querySelector(domString.inputDescription).value,
        value: parseFloat(document.querySelector(domString.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newhtml, element;
      // create HTML String with placholder text
      if (type === "inc") {
        element = domString.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = domString.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">30%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actul data
      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.description);
      newhtml = newhtml.replace("%value%", obj.value);
      //Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },
    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        domString.inputDescription + "," + domString.inputValue
      );
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      document.querySelector(domString.budgetlabel).textContent = obj.budget;
      document.querySelector(domString.incomelabel).textContent = obj.totalInc;
      document.querySelector(domString.expenseslabel).textContent =
        obj.totalExp;
      document.querySelector(domString.percentagelabel).textContent =
        obj.percentage;
    },
    getDOMString: function() {
      return domString;
    }
  };
})();

//THE APP CONTROLLER
var controller = (function(budgetCtrl, uICtrl) {
  var updataBudget = function() {
    //1. Calculate the BUDGET
    budgetCtrl.calculateBudget();
    //2. Return the budget
    var budget = budgetCtrl.getBudget();
    //3. Display the BUDGET on the UI
    console.log(budget);
  };
  //CallBACKFUNC
  var ctrlAddItem = function() {
    var input, newItem;
    //1. Get the field input DATA
    input = uICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the item to UI
      uICtrl.addListItem(newItem, input.type);
      //4. Clear the Fields
      uICtrl.clearFields();
      //5.Calculate and update budget
      updataBudget();
    }
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
