// BookCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Image source={{ uri: book.thumbnail }} style={styles.thumbnail} />
      <View style={styles.details}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.authors}>{book.authors.join(", ")}</Text>
        <Button
          title="Ver detalhes"
          onPress={() => navigation.navigate("BookDetails", { book })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  thumbnail: {
    width: 80,
    height: 120,
    resizeMode: "cover",
    borderRadius: 5,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  authors: {
    fontSize: 14,
    color: "#555",
  },
});

export default BookCard;
