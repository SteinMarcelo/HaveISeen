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
import { useNavigation } from "@react-navigation/native";

const Movies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tmdbApiKey, setTmdbApiKey] = useState<string>("");

  const navigation = useNavigation();

  useEffect(() => {
    fetchTmdbApiKey();
  }, []);

  useEffect(() => {
    if (tmdbApiKey) {
      fetchMovies();
    }
  }, [tmdbApiKey]);

  const fetchTmdbApiKey = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.150:3000/api/users/movie-api-key"
      );
      setTmdbApiKey(response.data.apiKey);
    } catch (error) {
      console.error("Erro ao buscar chave da API do TMDB:", error);
      setError("Não foi possível carregar a chave da API do TMDB.");
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=pt-BR&page=1`
      );

      const moviesData = response.data.results;
      if (!Array.isArray(moviesData)) {
        throw new Error("Dados de filmes não estão no formato esperado");
      }

      setMovies(moviesData);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setError("Ocorreu um erro ao carregar os filmes.");
    } finally {
      setLoading(false);
    }
  };

  const renderMovieCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MovieDetails", { movie: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.releaseDate}>Lançamento: {item.release_date}</Text>
      <Text style={styles.overview} numberOfLines={3}>
        {item.overview}
      </Text>
      {item.poster_path && (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          }}
          style={styles.poster}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feed de Filmes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieCard}
        />
      )}
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  releaseDate: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  overview: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  poster: {
    width: 100,
    height: 150,
    marginTop: 10,
    resizeMode: "cover",
  },
});

export default Movies;
