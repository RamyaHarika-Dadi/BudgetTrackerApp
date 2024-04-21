import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExpenseItem = ({ expense, onRemove }) => (
  <View style={styles.container}>
    <Text style={styles.name}>{expense.name}</Text>
    <Text style={styles.amount}>${expense.amount}</Text>
    <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
      <Text style={styles.removeButtonText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExpenseItem;
