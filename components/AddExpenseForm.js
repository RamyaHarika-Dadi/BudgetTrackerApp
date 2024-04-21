import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, removePersonExpenses } from '../actions/expenseActions';


const AddExpenseForm = () => {
  const dispatch = useDispatch();
  const totalExpenses = useSelector((state) => state.expenses.totalExpenses);
  const persons = Object.keys(totalExpenses);

  const [person, setPerson] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Expense'); // Default to Expense
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Request notification permissions on component mount
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Error', 'Failed to get push token for notifications!');
      return;
    }
    // Get the token that uniquely identifies this device
    const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(expoPushToken);
    // Save the token to AsyncStorage for later use
    await AsyncStorage.setItem('expoPushToken', expoPushToken);
  };

  const handleAddExpense = async () => {
    if (person && expenseName && amount && date) {
      const formattedAmount = type === 'Expense' ? -parseFloat(amount) : parseFloat(amount); // Apply negative for Expense
      dispatch(addExpense(person, expenseName, formattedAmount, date));
      const message = `${type} - ${expenseName} - $${amount} - Date: ${date}`;
      setLogs([...logs, { id: Date.now(), person, message }]);
      setPerson('');
      setExpenseName('');
      setAmount('');
      setDate('');
      Alert.alert('Success', 'Expense added successfully!');
      // Send notification for added expense
      sendNotification(`New ${type} Added`, message);
    } else {
      Alert.alert('Error', 'Please fill out all fields!');
    }
  };

  const sendNotification = async (title, body) => {
    const expoPushToken = await AsyncStorage.getItem('expoPushToken');
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
      }),
    });
  };

  const handleRemovePerson = (personName) => {
    dispatch(removePersonExpenses(personName));
    setLogs(logs.filter((log) => log.person !== personName));
    Alert.alert('Success', `${personName}'s expenses removed successfully!`);
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseRow}>
      <Text style={styles.expenseCell}>{item.message}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Finance Tracker App  - Ramya & Pavithra</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Person Name"
        value={person}
        onChangeText={setPerson}
      />
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Expense" value="Expense" />
        <Picker.Item label="Saving" value="Saving" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Add Expense" onPress={handleAddExpense} />
      
      {/* Expenses Table */}
      <View style={styles.tableContainer}>
        {persons.map((personName) => (
          <View key={personName} style={styles.tableSection}>
            <Text style={styles.sectionTitle}>Expenses for {personName}</Text>
            <FlatList
              data={logs.filter((log) => log.person === personName)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderExpenseItem}
            />
            <Text style={styles.totalExpense}>
              Total: ${totalExpenses[personName] || 0}
            </Text>
            <TouchableOpacity onPress={() => handleRemovePerson(personName)}>
              <Text style={styles.removePersonButton}>Remove {personName}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableSection: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  expenseCell: {
    flex: 1,
    fontSize: 14,
  },
  totalExpense: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: (total) => (total >= 0 ? 'blue' : 'red'),
  },
  removePersonButton: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AddExpenseForm;
