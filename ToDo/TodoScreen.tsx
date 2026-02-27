import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';

const TodoScreen = () => {
  const [enteredGoalText, setEnteredGoalText] = useState(''); // State للـ Input [cite: 8, 9]
  const [courseGoals, setCourseGoals] = useState<string[]>([]); // State للقائمة [cite: 8, 10]

  // Function لمعالجة الضغط على الزرار [cite: 11]
  function addGoalHandler() {
    if (enteredGoalText.trim().length === 0) return;
    setCourseGoals(currentCourseGoals => [
      ...currentCourseGoals,
      enteredGoalText,
    ]);
    setEnteredGoalText(''); // مسح الـ Input بعد الإضافة
  }

  return (
    <View style={styles.appContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>To-Do List</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Input goals" // [cite: 5]
          onChangeText={text => setEnteredGoalText(text)}
          value={enteredGoalText}
        />
        <TouchableOpacity style={styles.button} onPress={addGoalHandler}>
          <Text style={styles.buttonText}>ADD GOAL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {/* FlatList لعرض العناصر وعمل Scroll [cite: 7] */}
        <FlatList
          data={courseGoals}
          renderItem={itemData => (
            <View style={styles.goalItem}>
              <Text style={styles.goalText}>{itemData.item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          alwaysBounceVertical={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: { color: COLORS.onPrimary, fontSize: 24, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '70%',
    padding: 8,
    borderRadius: 6,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
  },
  buttonText: { color: COLORS.onPrimary, fontWeight: 'bold' },
  listContainer: { flex: 5, paddingHorizontal: 15 },
  goalItem: {
    margin: 8,
    padding: 10,
    borderRadius: 6,
    backgroundColor: COLORS.primaryVariant,
  },
  goalText: { color: 'white' },
});

export default TodoScreen;
