import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

// Define o tipo de navegação para a tela "Home"
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>(); // Tipagem da navegação
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha ambos os campos");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.3:3000/api/users/login",
        { email, password }
      );

      if (response.status === 200) {
        const { token } = response.data;
        console.log("Token recebido:", token);
        login(token); // Atualiza estado global
        navigation.navigate("Home"); // Redireciona para Home após login
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Credenciais inválidas ou erro na conexão");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={styles.registerLink}
        onPress={() => navigation.navigate("Register")}
      >
        Não tem uma conta? Cadastre-se
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  registerLink: {
    marginTop: 15,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});

export default Login;
