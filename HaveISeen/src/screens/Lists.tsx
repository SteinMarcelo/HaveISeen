// BooksScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Lists = () => {
  return (
    <View>
      <Text>Tela de Listas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Lists;
