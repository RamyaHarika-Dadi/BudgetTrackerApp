// actions/expenseActions.js


export const ADD_EXPENSE = 'ADD_EXPENSE';
export const REMOVE_EXPENSE = 'REMOVE_EXPENSE';
export const UPDATE_TOTAL_EXPENSE = 'UPDATE_TOTAL_EXPENSE';


export const addExpense = (person, expenseName, amount, date) => ({
  type: ADD_EXPENSE,
  payload: { person, expenseName, amount, date },
});


export const removeExpense = (expenseId) => ({
  type: REMOVE_EXPENSE,
  payload: expenseId,
});


export const updateTotalExpense = (totalExpense) => ({
  type: UPDATE_TOTAL_EXPENSE,
  payload: totalExpense,
});
