import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Feed from "../screens/Feed";
import BookDetails from "../screens/BookDetails";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Feed: undefined;
  BookDetails: { book: any }; // Aceita os detalhes do livro como parâmetro
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Feed" component={Feed} />
            <Stack.Screen name="BookDetails" component={BookDetails} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
