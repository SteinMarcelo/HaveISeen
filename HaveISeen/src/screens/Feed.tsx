// BooksScreen.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Feed = () => {
  return (
    <View>
      <Text>Tela de Feed</Text>
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

export default Feed;
