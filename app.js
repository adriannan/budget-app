// BUDGET CONTROLLER

const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
    deleteItem: function(type, id) {
      let ids, index;
      ids = data.allItems[type].map(item => item.id);
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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
    calculatePercentages: function() {
      data.allItems.exp.forEach(item => item.calcPercentage(data.totals.inc));
    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    getPercentages: function() {
      let allPercentages = data.allItems.exp.map(item => item.getPercentage());
      return allPercentages;
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
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };
  const formatNumber = function(num, type) {
    let numSplit, int, dec;
    num = Math.abs(num).toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    dec = numSplit[1];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    return `${type === "exp" ? "-" : "+"} ${int}.${dec}`;
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
        html = `<div class="item clearfix" id="exp-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${formatNumber(
                      obj.value,
                      type
                    )}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
                </div>`;
      } else if (type === "inc") {
        list = document.querySelector(DOMStrings.incomeList);
        html = `<div class="item clearfix" id="inc-${obj.id}">
                  <div class="item__description">${obj.description}</div>
                  <div class="right clearfix">
                    <div class="item__value">${formatNumber(
                      obj.value,
                      type
                    )}</div>
                    <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                  </div>
                </div>`;
      }
      // insert the hTML into the DOM
      list.insertAdjacentHTML("beforeend", html);
    },
    deleteListItem: function(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      let type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMStrings.expenseLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      if (obj.percentage > 0) {
        document.querySelector(
          DOMStrings.percentageLabel
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = `-`;
      }
    },
    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(DOMStrings.expensePercLabel);

      const nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = "-";
        }
      });
    },
    displayDate: function() {
      let date, month, year;
      date = new Date();
      month = date.getMonth();
      year = date.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = year;
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
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOMStrings.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = function() {
    //  1. calculate the budget
    budgetCtrl.calculateBudget();

    //  2. return the budget
    const budget = budgetCtrl.getBudget();

    //  3. display the budget on the UI
    UICtrl.displayBudget(budget);
  };
  const updatePercentages = function() {
    //  1. calculate the percentage
    budgetCtrl.calculatePercentages();
    //  2. read the percentage from budget ctrl
    const percentages = budgetCtrl.getPercentages();
    //  3. update the UI with percentage
    debugger;
    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = () => {
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

      //  6. calculate and update the percentage
      updatePercentages();
    }
  };
  const ctrlDeleteItem = function(e) {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. update and show the new budget
      updateBudget();
      // 4. calculate and update the percentage
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("Application has started.");
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
