import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Books from "./Books"; // Tela de Livros
import Movies from "./Movies"; // Tela de Filmes
import Lists from "./Lists"; // Tela de Listas
import Profile from "./Profile"; // Tela de Perfil
import ProtectedRoute from "../routes/ProtectedRoute";
import Feed from "./Feed";

const Tab = createBottomTabNavigator();

const Home: React.FC = () => {
  return (
    <ProtectedRoute>
      <Tab.Navigator
        initialRouteName="Movies"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Movies") {
              iconName = "film";
            } else if (route.name === "Books") {
              iconName = "book";
            } else if (route.name === "Lists") {
              iconName = "list";
            } else if (route.name === "Profile") {
              iconName = "person";
            } else if (route.name === "Feed") {
              iconName = "newspaper";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Movies" component={Movies} />
        <Tab.Screen name="Books" component={Books} />
       < Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="Lists" component={Lists} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </ProtectedRoute>
  );
};

export default Home;
