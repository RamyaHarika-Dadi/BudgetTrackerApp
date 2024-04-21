import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AddExpenseForm from './components/AddExpenseForm';


export default function App() {
  return (
    <Provider store={store}>
      <AddExpenseForm />
    </Provider>
  );
}
