// BUDGET CONTROLLER

const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(item => {
      sum += item.value;
    });
    data.totals[type] = sum;
  };
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;

      // create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item based on type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // push it into our data structure
      data.allItems[type].push(newItem);

      // return new element
      return newItem;
    },
    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate the budget: inc - exp
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income
      if (data.totals.inc > 0) {
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
    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
const UIController = (function() {
  const DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMStrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      let html, list;

      // Create HTML string with placeholder text
      // replace the placeholder text with some actual data
      if (type === "exp") {
        list = document.querySelector(DOMStrings.expenseList);
        html = `<div class="item clearfix" id="expense-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
                </div>`;
      } else if (type === "inc") {
        list = document.querySelector(DOMStrings.incomeList);
        html = `<div class="item clearfix" id="income-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
                </div>`;
      }
      // insert the hTML into the DOM
      list.insertAdjacentHTML("beforeend", html);
    },
    clearInputs: function() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fields.forEach(item => {
        item.value = "";
      });
    },
    displayBudget: function(obj) {
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(
          DOMStrings.percentageLabel
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = `-`;
      }
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {
  const setupEventListeners = function() {
    const DOMStrings = UICtrl.getDOMStrings();
    document
      .querySelector(DOMStrings.inputBtn)
      .addEventListener("click", addItem);
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        addItem();
      }
    });
  };

  const updateBudget = function() {
    //  1. calculate the budget
    budgetCtrl.calculateBudget();

    //  2. return the budget
    const budget = budgetCtrl.getBudget();

    //  3. display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  const addItem = () => {
    let getInput, newItem, newListItem;

    //  1. get the field input data
    getInput = UICtrl.getInput();

    if (
      getInput.description !== "" &&
      !isNaN(getInput.value) &&
      getInput.value > 0
    ) {
      //  2. add the item to the budget controller
      newItem = budgetCtrl.addItem(
        getInput.type,
        getInput.description,
        getInput.value
      );

      //  3. add the item to the UI
      newListItem = UICtrl.addListItem(newItem, getInput.type);

      //  4. clear the fields
      UICtrl.clearInputs();

      //  5. calculate and update the budget
      updateBudget();
    }
  };

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
    }
  };
})(budgetController, UIController);

controller.init();
