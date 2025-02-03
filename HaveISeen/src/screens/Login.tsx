import React, { useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Container, Title, Input, RegisterLink, ButtonContainer, StyledButton } from '../styles/LoginStyles';

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
  const navigation = useNavigation<LoginScreenNavigationProp>();
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
        "http://localhost:3000/api/users/login",
        { email, password }
      );

      if (response.status === 200) {
        const { token, id, username } = response.data;
        console.log("Token recebido:", token);
        login(token, id, username);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Credenciais inválidas ou erro na conexão");
    }
  };

  return (
    <Container>
      <Title>Login</Title>
      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ButtonContainer>
        <StyledButton onPress={handleLogin}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>Login</Text>
        </StyledButton>
      </ButtonContainer>
      <RegisterLink onPress={() => navigation.navigate("Register")}>
        Não tem uma conta? Cadastre-se
      </RegisterLink>
    </Container>
  );
};

export default Login;
