// BUDGET CONTROLLER

const budgetController = (function() {
  // some code
})();

// UI CONTROLLER
const UIController = (function() {
  const DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {
  const DOMStrings = UICtrl.getDOMStrings();
  const addItem = () => {
    //  1. get the field input data
    let getInput = UICtrl.getInput();
    console.log(getInput);

    //  2. add the item to the budget controller
    //  3. add the item to the UI
    //  4. calculate the budget
    //  5. display the budget on the UI
  };

  document
    .querySelector(DOMStrings.inputBtn)
    .addEventListener("click", addItem);
  document.addEventListener("keypress", function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      addItem();
    }
  });
})(budgetController, UIController);
