// reducers/expenseReducer.js


import { ADD_EXPENSE, REMOVE_EXPENSE, UPDATE_TOTAL_EXPENSE } from '../actions/expenseActions';


const initialState = {
  expenses: [],
  totalExpenses: {},
};


const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPENSE:
      const { person, expenseName, amount, date } = action.payload;
      const newExpense = { person, expenseName, amount, date, id: Date.now() };
      const updatedExpenses = [...state.expenses, newExpense];


      const totalExpenses = updatedExpenses.reduce((acc, expense) => {
        acc[expense.person] = (acc[expense.person] || 0) + expense.amount;
        return acc;
      }, {});


      return {
        ...state,
        expenses: updatedExpenses,
        totalExpenses,
      };
    case REMOVE_EXPENSE:
      const removedExpense = state.expenses.find((expense) => expense.id === action.payload);
      const filteredExpenses = state.expenses.filter((expense) => expense.id !== action.payload);


      const updatedTotalExpenses = { ...state.totalExpenses };
      updatedTotalExpenses[removedExpense.person] -= removedExpense.amount;


      return {
        ...state,
        expenses: filteredExpenses,
        totalExpenses: updatedTotalExpenses,
      };
    case UPDATE_TOTAL_EXPENSE:
      return {
        ...state,
        totalExpenses: action.payload,
      };
    default:
      return state;
  }
};


export default expenseReducer;
