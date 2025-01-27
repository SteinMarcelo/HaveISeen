import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface MovieDetailsProps {
  route: {
    params: {
      movie: {
        id: any;
        title: string;
        overview: string;
        poster_path: string;
        release_date: string;
        vote_average: number;
      };
    };
  };
  navigation: any;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ route, navigation }) => {
  const { user } = useAuth(); // Obter o usuário do contexto
  const { movie } = route.params;
  const { title, overview, poster_path, release_date, vote_average } = movie;

  const [isModalVisible, setModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  useEffect(() => {
    if (user?.id) fetchLists();
  }, [user]);

  const fetchLists = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.150:3000/api/users/lists?user_id=${user.id}&type=movie`
      );
      setLists(response.data.lists);
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    if (!isModalVisible && user?.id) fetchLists();
    setModalVisible(!isModalVisible);
  };

  const toggleReviewModal = () => {
    setReviewModalVisible(!isReviewModalVisible);
  };

  const handleAddReview = async () => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    if (stars === 0 || !reviewText.trim()) {
      Alert.alert(
        "Erro",
        "Por favor, preencha a avaliação e escolha as estrelas."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.150:3000/api/users/postReview",
        {
          id_user: user.id,
          id_item: movie.id, // Certifique-se de que o ID do filme está disponível
          type: "movie",
          review: reviewText,
          stars: stars,
        }
      );

      Alert.alert("Sucesso", "Review adicionada com sucesso!");
      setReviewText("");
      setStars(0);
      toggleReviewModal();
    } catch (error) {
      console.error("Erro ao adicionar review:", error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o review. Tente novamente."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />

      {poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>Data de Lançamento: {release_date}</Text>
      <Text style={styles.info}>Nota: {vote_average}/10</Text>
      <Text style={styles.overview}>{overview}</Text>

      <Button title="Mostrar Listas" onPress={toggleModal} />
      <Button title="Adicionar Review" onPress={toggleReviewModal} />

      {/* Modal de Listas */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Listas</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={lists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => {
                      console.log(`Selecionada a lista: ${item.name}`);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.listName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <Button title="Fechar" onPress={toggleModal} />
          </View>
        </View>
      </Modal>

      {/* Modal de Review */}
      <Modal
        visible={isReviewModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Review</Text>
            <Text>Quantas estrelas?</Text>
            <View style={styles.starsContainer}>
              {[...Array(10)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setStars(index + 1)}
                >
                  <Text style={styles.star}>{index < stars ? "★" : "☆"}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Escreva seu review..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Button title="Enviar" onPress={handleAddReview} />
            <Button title="Cancelar" onPress={toggleReviewModal} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  poster: {
    width: 300,
    height: 450,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  overview: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "justify",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 5,
    color: "#FFD700",
  },
  textInput: {
    width: "100%",
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  listName: {
    fontSize: 16,
  },
});

export default MovieDetails;
