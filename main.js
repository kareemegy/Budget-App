//BUDGET CONTROLLER
var budgetController = (function() {
  // Obj Constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calculatePercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Calculate the inc/exp
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

    DeleteItem: function(type, id) {
      var ids, index;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculatePercentage: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calculatePercentage(data.totals.inc);
      });
    },
    getPercentage: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    calculateBudget: function() {
      // 1.calculate total  income and expenses
      calculatetotal("exp");
      calculatetotal("inc");
      // 2.Calculate the budget :income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        // 3.calculate the percentage of income that we spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
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
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentagesLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  var formateNumber = function(num, type) {
    var numSplit, int, dec, type;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
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
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times"></i></button></div></div></div>';
      }
      //Replace the placeholder text with some actul data
      newhtml = html.replace("%id%", obj.id);
      newhtml = newhtml.replace("%description%", obj.description);
      newhtml = newhtml.replace("%value%", formateNumber(obj.value, type));
      //Insert the HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newhtml);
    },
    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(domString.budgetlabel).textContent = formateNumber(
        obj.budget,
        type
      );
      document.querySelector(domString.incomelabel).textContent = formateNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        domString.expensesLabel
      ).textContent = formateNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(domString.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(domString.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(
        domString.expensesPercentagesLabel
      );
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "***";
        }
      });
    },
    displayMonth: function() {
      var now, year, months, month;
      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(domString.dateLabel).textContent =
        months[month] + " " + year;
    },
    changedType: function() {
      var fields = document.querySelectorAll(
        domString.inputType +
          "," +
          domString.inputDescription +
          "," +
          domString.inputValue
      );

      nodeListForEach(fields, function(cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(domString.inputBtn).classList.toggle('red')
    },
    getDOMString: function() {
      return domString;
    }
  };
})();

//THE APP CONTROLLER
var controller = (function(budgetCtrl, uICtrl) {
  // UpDataBudget
  var updataBudget = function() {
    //1. Calculate the BUDGET
    budgetCtrl.calculateBudget();
    //2. Return the budget
    var budget = budgetCtrl.getBudget();
    //3. Display the BUDGET on the UI
    uICtrl.displayBudget(budget);
  };
  var updataPercentages = function() {
    // 1.Calculate percentages
    budgetCtrl.calculatePercentage();
    //2.Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentage;
    //3.Update the Ui with the new percentages
    uICtrl.displayPercentages(percentages());
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
      //6.Calculate and update percentages
      updataPercentages();
    }
  };
  //Delete Item
  var ctrlDeleteItem = function(e) {
    var itemID, splitId, type, id;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitId = itemID.split("-");
      type = splitId[0];
      id = parseInt(splitId[1]);
      //1.Delete the Item from the data structure
      budgetCtrl.DeleteItem(type, id);
      //2.Delete the item from the UI
      uICtrl.deleteListItem(itemID);
      //3.Update and show the new budget
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
    document
      .querySelector(dom.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(dom.inputType)
      .addEventListener("change", uICtrl.changedType);
  };

  return {
    init: function() {
      console.log("Appliction has started");
      uICtrl.displayMonth();
      uICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
