import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, FlatList, Text, Pressable, Modal, Button, useWindowDimensions, Platform, KeyboardAvoidingView, StatusBar } from 'react-native';
import Colors from './Colors/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function App() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions(); // Lấy kích thước màn hình
  const [enteredGoal, setEnteredGoal] = useState('');
  const [courseGoals, setCourseGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  // Điều chỉnh StatusBar dựa vào trạng thái của Modal
  useEffect(() => {
    if (modalVisible) {
      StatusBar.setBackgroundColor(Colors.TEXT);
      
    } else {
      StatusBar.setBackgroundColor(Colors.BACKGROUND);
  
    }
  }, [modalVisible]);

  const goalInputHandler = (enteredText) => {
    setEnteredGoal(enteredText);
  };

  const addGoalHandler = () => {
    if (enteredGoal !== "") {
      setCourseGoals((course) => [
        ...course,
        {
          id: Math.random().toString(),
          value: enteredGoal,
          completed: false,
        },
      ]);
      setEnteredGoal('');
      setErrorMessage('');
      setModalVisible(false);
    } else {
      setErrorMessage('Không được để trống');
    }
  };

  const removeGoalHandler = (goalId) => {
    setCourseGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== goalId)
    );
  };

  const toggleCompletedHandler = (goalId) => {
    setCourseGoals((currentGoals) =>
      currentGoals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <>
      <StatusBar backgroundColor={modalVisible ? Colors.TEXT_PRIMARY : Colors.BACKGROUND} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <Text style={styles.nameText}>Hồ Minh Tâm - 2124802010594</Text>
        <Text style={styles.titleText}>C O U R S E G O A L S</Text>

        <View style={{ height: 20 }} />

        <Pressable
          onPress={() => setModalVisible(true)}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? Colors.SECONDARY : Colors.TEXT_PRIMARY,
            },
            styles.button,
          ]}
        >
          <Text style={styles.buttonText}>Add New Course</Text>
        </Pressable>

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New</Text>
              <TextInput
                placeholder="Nhập tên ..."
                onChangeText={goalInputHandler}
                value={enteredGoal}
                multiline={true}
                style={[styles.textInput, { width: screenWidth * 0.75 }]} // Điều chỉnh kích thước TextInput dựa trên kích thước màn hình
              />
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <View style={styles.modalButtons}>
                <View style={{ paddingRight: 20 }}>
                  <Button title="Thêm" onPress={addGoalHandler} />
                </View>
                <View>
                  <Button
                    title="Hủy"
                    onPress={() => {
                      setModalVisible(false);
                      setEnteredGoal('');
                      setErrorMessage('');
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={courseGoals}
          renderItem={(itemData) => (
            <View style={styles.list}>
              <Text
                style={{
                  fontSize: 20,
                  textDecorationLine: itemData.item.completed
                    ? 'line-through'
                    : 'none',
                }}
              >
                {itemData.item.value}
              </Text>
              <View style={styles.buttonsContainer}>
                <Pressable
                  style={styles.completeButton}
                  onPress={() => toggleCompletedHandler(itemData.item.id)}
                >
                  <Text style={styles.completeButtonText}>
                    {itemData.item.completed 
                      ? <AntDesign name="close" size={24} color="black" />
                      : <AntDesign name="check" size={24} color="black" />}
                  </Text>
                </Pressable>
                <Pressable onPress={() => removeGoalHandler(itemData.item.id)}>
                  <AntDesign name="delete" size={20} color="red" />
                </Pressable>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  nameText: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  titleText: {
    textAlign: 'center',
    fontSize: 28,
    color: Colors.TEXT_PRIMARY,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    borderColor: Colors.TEXT_PRIMARY,
    borderWidth: 2,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 20,
    padding: 5,
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.TEXT,
  },
  modalContent: {
    backgroundColor: Colors.BACKGROUND,
    width: '90%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    marginTop: 20,
    fontSize: 28,
    color: Colors.TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  textInput: {
    borderColor: Colors.TEXT_PRIMARY,
    borderWidth: 2,
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 30,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    borderColor: Colors.TEXT_PRIMARY,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  completeButtonText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
  },
});
