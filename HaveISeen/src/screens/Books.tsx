import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native"; // Importação adicionada
import axios from "axios";
import BookCard from "../components/BookCard";
import {
  Container,
  Title,
  SearchInput,
  SearchButton,
  SearchButtonText,
  BookList,
  LoadingIndicator,
} from "../styles/BooksStyles";

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

  return (
    <Container>
      <Title>Busca de Livros</Title>
      <SearchInput
        placeholder="Digite o título ou autor"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <SearchButton onPress={handleSearch}>
        <SearchButtonText>Buscar</SearchButtonText>
      </SearchButton>

      {loading ? (
        <LoadingIndicator size="large" color="#4F46E5" />
      ) : (
        <BookList
          data={books}
          keyExtractor={(item: { id: any; }) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBookPress(item)}>
              <BookCard
                book={{
                  id: item.id,
                  title: item.volumeInfo.title,
                  authors: item.volumeInfo.authors || ["Autor desconhecido"],
                  thumbnail:
                    item.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/80x120", // Placeholder se não houver imagem
                }}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </Container>
  );
};

export default Books;
