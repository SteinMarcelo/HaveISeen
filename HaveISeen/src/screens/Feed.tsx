import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome"; // Adicionando o ícone

const Feed = () => {
  const [reviews, setReviews] = useState<any[]>([]); // Estado para armazenar os reviews
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para erro
  const [tmdbApiKey, setTmdbApiKey] = useState<string>(""); // Estado para armazenar a chave da API do TMDB

  useEffect(() => {
    fetchTmdbApiKey();
  }, []);

  useEffect(() => {
    if (tmdbApiKey) {
      fetchReviews();
    }
  }, [tmdbApiKey]);

  // Função para buscar a chave da API do TMDB
  const fetchTmdbApiKey = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:3000/api/users/movie-api-key"
      );
      setTmdbApiKey(response.data.apiKey); // Supondo que a resposta contenha a chave em `apiKey`
    } catch (error) {
      console.error("Erro ao buscar chave da API do TMDB:", error);
      setError("Não foi possível carregar a chave da API do TMDB.");
    }
  };

  // Função para buscar os reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // Requisição à API para buscar os reviews
      const response = await axios.get(
        "http://127.0.0.1:3000/api/users/reviews"
      );

      // Verifica se os reviews estão no formato esperado
      const reviewsData = response.data.reviews;
      if (!Array.isArray(reviewsData)) {
        throw new Error("Dados de reviews não estão no formato esperado");
      }

      // Buscando detalhes para filmes ou livros
      const detailedReviews = await Promise.all(
        reviewsData.map(async (review: any) => {
          if (review.type === "movie") {
            // Busca as informações do filme na API do TMDB para obter a imagem
            try {
              const movieResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${review.id_item}?api_key=${tmdbApiKey}`
              );
              review.movieDetails = movieResponse.data;
            } catch (movieError) {
              console.error("Erro ao buscar detalhes do filme:", movieError);
            }
          } else if (review.type === "book") {
            // Busca as informações do livro na API do Google Books
            try {
              const bookResponse = await axios.get(
                `https://www.googleapis.com/books/v1/volumes/${review.id_item}`
              );
              review.bookDetails = bookResponse.data.volumeInfo;
            } catch (bookError) {
              console.error("Erro ao buscar detalhes do livro:", bookError);
            }
          }
          return review;
        })
      );

      setReviews(detailedReviews); // Atualiza o estado com os reviews detalhados
    } catch (error) {
      console.error("Erro ao buscar reviews:", error);
      setError("Ocorreu um erro ao carregar os reviews.");
    } finally {
      setLoading(false);
    }
  };

  // Função para desativar o review
  const handleDeactivateReview = async (reviewId: number) => {
    try {
      // Faz a requisição PUT para desativar o review
      const response = await axios.put(
        "http://127.0.0.1:3000/api/users/deactivateReview",
        { review_id: reviewId }
      );

      if (response.status === 200) {
        // Atualiza o estado local para remover o review da lista
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review.id !== reviewId)
        );
      }
    } catch (error) {
      console.error("Erro ao desativar review:", error);
    }
  };

  // Função para atualizar os reviews
  const handleRefresh = () => {
    fetchReviews(); // Recarrega os reviews
  };

  // Renderiza o card para cada review
  const renderReviewCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.type === "movie"
          ? item.movieDetails?.title
          : item.bookDetails?.title}
      </Text>
      <Text style={styles.reviewText}>{item.review}</Text>
      <Text style={styles.rating}>Avaliação: {item.stars} estrelas</Text>

      {item.type === "movie"
        ? item.movieDetails?.poster_path && (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.movieDetails?.poster_path}`,
              }}
              style={styles.poster}
            />
          )
        : item.bookDetails?.imageLinks?.thumbnail && (
            <Image
              source={{
                uri: item.bookDetails?.imageLinks?.thumbnail,
              }}
              style={styles.poster}
            />
          )}

      {/* Ícone de lixeira para desativar o review */}
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeactivateReview(item.id)}
      >
        <Icon name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed de Reviews</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReviewCard}
        />
      )}

      {/* Botão para atualizar os reviews */}
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.refreshButtonText}>Atualizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative", // Para posicionar o ícone
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "justify",
    color: "#555",
  },
  rating: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007BFF",
  },
  poster: {
    width: 100,
    height: 150,
    marginTop: 10,
    resizeMode: "cover",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Feed;
