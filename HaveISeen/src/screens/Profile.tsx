import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAuth } from "../contexts/AuthContext"; // Ajuste o caminho conforme necessário

const Perfil: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Bem-vindo, {user.username}!</Text>
          <Button title="Sair" onPress={logout} color="#FF6347" />
        </>
      ) : (
        <Text style={styles.text}>Nenhum usuário logado</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Perfil;
