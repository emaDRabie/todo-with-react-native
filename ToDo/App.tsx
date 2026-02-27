import 'react-native-gesture-handler';
import React, { useState, createContext } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TodoScreen from './src/screens/TodoScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#111827' : '#F9FAFB'}
            translucent={true}
          />
          <TodoScreen />
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
