import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ExpenseItem from './ExpenseItem';
import { removeExpense } from '../actions/expenseActions';

const ExpenseList = () => {
  const expenses = useSelector((state) => state.expenses);
  const dispatch = useDispatch();

  // Function to remove an expense
  const handleRemoveExpense = (expenseId) => {
    dispatch(removeExpense(expenseId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses:</Text>
      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <ExpenseItem expense={item} onRemove={() => handleRemoveExpense(item.id)} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ExpenseList;
