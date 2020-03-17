// BUDGET CONTROLLER

const budgetController = (function() {
  // some code
})();

// UI CONTROLLER
const UIController = (function() {
  return {
    getInput: function() {
      return {
        type: document.querySelector(".add__type").value,
        description: document.querySelector(".add__description").value,
        value: document.querySelector(".add__value").value
      };
    }
  };
})();

// APP CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {
  const addItem = () => {
    //  1. get the field input data
    let getInput = UICtrl.getInput();
    console.log(getInput);
    //  2. add the item to the budget controller
    //  3. add the item to the UI
    //  4. calculate the budget
    //  5. display the budget on the UI
  };

  document.querySelector(".add__btn").addEventListener("click", addItem);
  document.addEventListener("keypress", function(e) {
    if (e.keyCode === 13 || e.which === 13) {
      addItem();
    }
  });
})(budgetController, UIController);
