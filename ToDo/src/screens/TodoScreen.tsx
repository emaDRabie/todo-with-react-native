import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Swipeable } from 'react-native-gesture-handler';
import { COLORS } from '../constants/colors';
import { ThemeContext } from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  isCompleted: boolean;
}

// عملنا Component منفصل للتاسك عشان نتحكم في حركة الـ Swipe بشكل مثالي
const TaskItemComponent = ({
  item,
  onDelete,
  onToggleComplete,
  styles,
}: any) => {
  const swipeableRef = useRef<Swipeable>(null);

  // لما بنسحب لليمين (للاخر) او ندوس Done
  const handleComplete = () => {
    onToggleComplete(item.id);
    swipeableRef.current?.close(); // دي اللي هتقفل السحبة بعد ما تتنفذ
  };

  // لما بنسحب للشمال (للاخر)
  const handleDelete = () => {
    Alert.alert(
      'Delete Task', // عنوان الرسالة
      'Are you sure you want to delete this task?', // نص الرسالة
      [
        {
          text: 'No',
          onPress: () => swipeableRef.current?.close(), // لو داس لا، بنقفل السحبة بس
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => onDelete(item.id), // لو داس اه، بنمسح التاسك
          style: 'destructive', // بتخلي زرار المسح لونه أحمر في iOS
        },
      ],
      { cancelable: false }, // عشان ميقفلش الرسالة لو داس براها، لازم يختار اه أو لا
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      // تفعيل المسح التلقائي عند السحب لليسار
      onSwipeableRightOpen={handleDelete}
      // تفعيل الاكتمال التلقائي عند السحب لليمين
      onSwipeableLeftOpen={handleComplete}
      // الديزاين اللي بيظهر تحت السحبة (في حالة لو مسحبش للآخر)
      renderRightActions={() => (
        <View style={styles.deleteAction}>
          <Text style={styles.actionText}>Delete</Text>
        </View>
      )}
      renderLeftActions={() => (
        <View
          style={item.isCompleted ? styles.undoAction : styles.completeAction}
        >
          <Text style={styles.actionText}>
            {item.isCompleted ? 'Undo' : 'Done'}
          </Text>
        </View>
      )}
    >
      <View style={styles.taskItem}>
        <Text
          style={[styles.taskTitle, item.isCompleted && styles.taskCompleted]}
        >
          {item.title}
        </Text>
        {item.description ? (
          <Text
            style={[styles.taskDesc, item.isCompleted && styles.taskCompleted]}
          >
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.taskDate}>{item.date.toDateString()}</Text>
      </View>
    </Swipeable>
  );
};

const TodoScreen = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 1. قراءة الداتا أول ما الشاشة تفتح
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('@tasks_key');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          // ترجيع التاريخ من نص لـ Date Object
          const formattedTasks = parsedTasks.map((task: any) => ({
            ...task,
            date: new Date(task.date),
          }));
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks', error);
      } finally {
        setIsDataLoaded(true); // كده خلصنا قراءة
      }
    };

    loadTasks();
  }, []);

  // 2. حفظ الداتا أوتوماتيك كل ما قائمة التاسكات تتغير
  useEffect(() => {
    const saveTasks = async () => {
      // نتأكد إنه قرأ الداتا الأول عشان ميعملش حفظ لـ Array فاضي بالغط
      if (isDataLoaded) {
        try {
          const jsonValue = JSON.stringify(tasks);
          await AsyncStorage.setItem('@tasks_key', jsonValue);
        } catch (error) {
          console.error('Failed to save tasks', error);
        }
      }
    };

    saveTasks();
  }, [tasks, isDataLoaded]);

  function addTaskHandler() {
    if (title.trim().length === 0) return;
    const newTask: Task = {
      id: Math.random().toString(),
      title,
      description,
      date,
      isCompleted: false,
    };
    setTasks(currentTasks => [...currentTasks, newTask]);
    setTitle('');
    setDescription('');
    setDate(new Date());
    setBottomSheetVisible(false);
  }

  const deleteTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
      ),
    );
  };

  const dynamicStyles = StyleSheet.create({
    appContainer: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      alignItems: 'center',
    },
    headerText: { color: theme.text, fontSize: 28, fontWeight: 'bold' },
    themeBtn: { padding: 10, backgroundColor: theme.surface, borderRadius: 8 },
    themeBtnText: { color: theme.primary, fontWeight: 'bold' },
    listContainer: { flex: 1, paddingHorizontal: 20 },
    taskItem: {
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    taskTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    taskDesc: { color: theme.textSecondary, fontSize: 14, marginBottom: 8 },
    taskDate: { color: theme.primary, fontSize: 12, fontWeight: '600' },
    taskCompleted: { opacity: 0.5, textDecorationLine: 'line-through' },
    deleteAction: {
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 12,
      marginBottom: 15,
    },
    completeAction: {
      backgroundColor: '#10B981',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 12,
      marginBottom: 15,
    },
    undoAction: {
      backgroundColor: '#F59E0B', // لون برتقالي/ذهبي بيدل على التراجع
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 12,
      marginBottom: 15,
    },
    actionText: { color: '#FFF', fontWeight: 'bold' },
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: theme.primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    fabText: { color: '#FFF', fontSize: 30, fontWeight: 'bold', marginTop: -2 },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
      backgroundColor: theme.surface,
      padding: 20,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      minHeight: '50%',
    },
    sheetTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
      color: theme.text,
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
    },
    dateButton: {
      padding: 15,
      backgroundColor: theme.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 20,
    },
    dateButtonText: { color: theme.text },
    addButton: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    cancelBtn: { alignItems: 'center', marginTop: 15 },
    cancelBtnText: { color: theme.textSecondary, fontSize: 14 },
  });

  return (
    <SafeAreaView
      style={dynamicStyles.appContainer}
      edges={['top', 'left', 'right']}
    >
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerText}>My Tasks</Text>
        <TouchableOpacity style={dynamicStyles.themeBtn} onPress={toggleTheme}>
          <Text style={dynamicStyles.themeBtnText}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.listContainer}>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            // استخدام الـ Component الجديد هنا
            <TaskItemComponent
              item={item}
              onDelete={deleteTask}
              onToggleComplete={toggleTaskCompletion}
              styles={dynamicStyles}
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={dynamicStyles.fab}
        onPress={() => setBottomSheetVisible(true)}
      >
        <Text style={dynamicStyles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={isBottomSheetVisible}
        animationType="slide"
        transparent={true}
      >
        <KeyboardAvoidingView
          style={dynamicStyles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={dynamicStyles.bottomSheet}>
            <Text style={dynamicStyles.sheetTitle}>Add New Task</Text>
            <TextInput
              style={dynamicStyles.input}
              placeholder="Task Title"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[
                dynamicStyles.input,
                { height: 80, textAlignVertical: 'top' },
              ]}
              placeholder="Description (Optional)"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TouchableOpacity
              style={dynamicStyles.dateButton}
              onPress={() => setOpenDatePicker(true)}
            >
              <Text style={dynamicStyles.dateButtonText}>
                Date: {date.toDateString()}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={openDatePicker}
              date={date}
              mode="date"
              onConfirm={selectedDate => {
                setOpenDatePicker(false);
                setDate(selectedDate);
              }}
              onCancel={() => setOpenDatePicker(false)}
            />
            <TouchableOpacity
              style={dynamicStyles.addButton}
              onPress={addTaskHandler}
            >
              <Text style={dynamicStyles.addButtonText}>Save Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={dynamicStyles.cancelBtn}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={dynamicStyles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default TodoScreen;
