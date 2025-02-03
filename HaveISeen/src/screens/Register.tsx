import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://127.0.0.1:3000/api/users/register"; // Atualize com o endereço do seu servidor

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        username,
        email,
        password,
      });
      Alert.alert("Sucesso", response.data.message);
      navigation.navigate("Login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        const errorMessage =
          error.response?.data?.error ||
          "Ocorreu um erro ao registrar o usuário";
        Alert.alert("Erro", errorMessage);
      } else {
        console.error("Unexpected error:", error);
        Alert.alert("Erro", "Não foi possível conectar ao servidor");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
      />
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
      <Button title="Cadastrar" onPress={handleRegister} />
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
});

export default Register;
