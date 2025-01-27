import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import BookCard from "../components/BookCard"; // Importar o componente BookCard

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
  };
}

interface BooksResponse {
  items: Book[];
}

const Books = ({ navigation }: any) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async (query: string) => {
    if (!query) return;

    setLoading(true);

    try {
      const response = await axios.get<BooksResponse>(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks("react"); // Carregar livros populares inicialmente
  }, []);

  const handleSearch = () => {
    fetchBooks(searchQuery);
  };

  const handleBookPress = (book: Book) => {
    navigation.navigate("BookDetails", { book: book });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busca de Livros</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite o título ou autor"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.searchButton} onPress={handleSearch}>
        Buscar
      </Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBookPress(item)}>
            <BookCard
              book={{
                id: item.id,
                title: item.volumeInfo.title,
                authors: item.volumeInfo.authors || ["Autor desconhecido"],
                thumbnail: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/80x120", // Placeholder se não houver imagem
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchButton: {
    color: "blue",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Books;
