import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import AddItemScreen from './components/AddItemScreen';
import CustomerHomeScreen from './Screens/CustomerHomeScreen'; 

export type RootStackParamList = {
  Home: undefined;
  AddItem: undefined;
  CustomerHome: undefined | any; 
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
