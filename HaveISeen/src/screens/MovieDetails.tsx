import React, { useState, useEffect } from "react";
import { Alert, Modal, FlatList, ActivityIndicator, TouchableOpacity,Text } from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Poster,
  Title,
  Info,
  Overview,
  ModalContainer,
  ModalContent,
  ModalTitle,
  StarsContainer,
  Star,
  TextInputReview,
  ListItem,
  ListName,
  NewListContainer,
  Input,
  AddButton,
  Button,
  ButtonText,
  ActivityIndicatorStyled,
} from "../styles/MovieDetailsStyles";

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
  const { user } = useAuth();
  const { movie } = route.params;
  const { title, overview, poster_path, release_date, vote_average } = movie;

  const [isModalVisible, setModalVisible] = useState(false);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [newListName, setNewListName] = useState<string>("");

  useEffect(() => {
    if (user?.id) fetchLists();
  }, [user]);

  const fetchLists = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:3000/api/users/lists?user_id=${user.id}&type=movie`
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
      await axios.post("http://127.0.0.1:3000/api/users/postReview", {
        id_user: user.id,
        id_item: movie.id,
        type: "movie",
        review: reviewText,
        stars: stars,
      });

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

  const handleAddList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Erro", "O nome da lista não pode estar vazio.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3000/api/users/listRegister", {
        user_id: user?.id,
        name: newListName,
        type: "movie",
      });

      Alert.alert("Sucesso", "Lista criada com sucesso!");
      setNewListName("");
      fetchLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      Alert.alert("Erro", "Não foi possível criar a lista. Tente novamente.");
    }
  };

  const handleAddMovieToList = async (listId: any) => {
    try {
      await axios.post("http://127.0.0.1:3000/api/users/addItemToList", {
        list_id: listId,
        item_id: movie.id,
      });

      Alert.alert("Sucesso", "Filme adicionado à lista com sucesso!");
      toggleModal();
    } catch (error) {
      console.error("Erro ao adicionar filme à lista:", error);
      Alert.alert("Erro", "Não foi possível adicionar o filme. Tente novamente.");
    }
  };

  return (
    <Container contentContainerStyle={{ alignItems: "center" }}>
      <Button onPress={() => navigation.goBack()}>
        <ButtonText>Voltar</ButtonText>
      </Button>

      {poster_path && (
        <Poster source={{ uri: `https://image.tmdb.org/t/p/w500${poster_path}` }} />
      )}
      <Title>{title}</Title>
      <Info>Data de Lançamento: {release_date}</Info>
      <Info>Nota: {vote_average}/10</Info>
      <Overview>{overview}</Overview>

      <Button onPress={toggleModal}>
        <ButtonText>Mostrar Listas</ButtonText>
      </Button>
      <Button onPress={toggleReviewModal}>
        <ButtonText>Adicionar Review</ButtonText>
      </Button>

      {/* Modal de Listas */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Listas</ModalTitle>

            <NewListContainer>
              <Input
                placeholder="Nome da nova lista"
                value={newListName}
                onChangeText={setNewListName}
              />
              <AddButton onPress={handleAddList}>
                <Ionicons name="add-circle" size={32} color="#4F46E5" />
              </AddButton>
            </NewListContainer>

            {loading ? (
              <ActivityIndicatorStyled size="large" color="#4F46E5" />
            ) : (
              <FlatList
                data={lists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ListItem onPress={() => handleAddMovieToList(item.id)}>
                    <ListName>{item.name}</ListName>
                  </ListItem>
                )}
              />
            )}

            <Button onPress={toggleModal}>
              <ButtonText>Fechar</ButtonText>
            </Button>
          </ModalContent>
        </ModalContainer>
      </Modal>

      {/* Modal de Review */}
      <Modal
        visible={isReviewModalVisible}
        animationType="slide"
        transparent={true}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Adicionar Review</ModalTitle>
            <Text>Quantas estrelas?</Text>
            <StarsContainer>
              {[...Array(10)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setStars(index + 1)}
                >
                  <Star selected={index < stars}>{index < stars ? "★" : "☆"}</Star>
                </TouchableOpacity>
              ))}
            </StarsContainer>
            <TextInputReview
              placeholder="Escreva seu review..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Button onPress={handleAddReview}>
              <ButtonText>Enviar</ButtonText>
            </Button>
            <Button onPress={toggleReviewModal}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default MovieDetails;