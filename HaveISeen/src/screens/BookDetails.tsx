import React, { useState, useEffect } from "react";
import { Alert, Modal, FlatList, ActivityIndicator, TouchableOpacity,Text } from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Title,
  Authors,
  BookImage,
  ModalContainer,
  ModalContent,
  ModalTitle,
  ListItem,
  ListName,
  Input,
  NewListContainer,
  AddButton,
  StarsContainer,
  Star,
  TextInputReview,
  Button,
  ButtonText,
  ActivityIndicatorStyled,
} from "../styles/BookDetailsStyles";

const BookDetails: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { book } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [lists, setLists] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState<string>("");
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [stars, setStars] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const user_id = user?.id;
  const book_id = book.id.toString();

  useEffect(() => {
    if (user_id) {
      fetchLists();
    } else {
      Alert.alert("Erro", "Usuário não encontrado.");
    }
  }, [user_id]);

  const fetchLists = async () => {
    if (!user_id) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:3000/api/users/lists?user_id=${user_id}&type=book`
      );
      if (response.data && response.data.lists) {
        setLists(response.data.lists);
      } else {
        Alert.alert("Aviso", "Nenhuma lista encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar listas:", error);
      Alert.alert("Erro", "Não foi possível carregar as listas.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async () => {
    if (!newListName.trim()) {
      Alert.alert("Erro", "O nome da lista não pode estar vazio.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:3000/api/users/listRegister", {
        user_id,
        name: newListName,
        type: "book",
      });

      Alert.alert("Sucesso", "Lista criada com sucesso!");
      setNewListName("");
      fetchLists();
    } catch (error) {
      console.error("Erro ao criar lista:", error);
      Alert.alert("Erro", "Não foi possível criar a lista. Tente novamente.");
    }
  };

  const handleAddBookToList = async (listId: any) => {
    try {
      await axios.post("http://127.0.0.1:3000/api/users/addItemToList", {
        list_id: listId,
        item_id: book_id,
      });

      Alert.alert("Sucesso", "Livro adicionado à lista com sucesso!");
      toggleModal();
    } catch (error) {
      console.error("Erro ao adicionar livro à lista:", error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o livro. Tente novamente."
      );
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleReviewModal = () => {
    setReviewModalVisible(!isReviewModalVisible);
  };

  const handleAddReview = async () => {
    if (!user_id) {
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
        id_user: user_id,
        id_item: book_id,
        type: "book",
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

  return (
    <Container>
      <Button onPress={() => navigation.goBack()}>
        <ButtonText>Voltar</ButtonText>
      </Button>
      {loading ? (
        <ActivityIndicatorStyled size="large" color="#4F46E5" />
      ) : (
        <>
          <Title>{book.title}</Title>
          <Authors>Autores: {book.authors.join(", ")}</Authors>
          <BookImage source={{ uri: book.thumbnail }} />
          <Button onPress={toggleModal}>
            <ButtonText>Adicionar à Lista</ButtonText>
          </Button>
          <Button onPress={toggleReviewModal}>
            <ButtonText>Adicionar Review</ButtonText>
          </Button>
        </>
      )}

      {/* Modal de Listas */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Suas Listas</ModalTitle>

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
                  <ListItem onPress={() => handleAddBookToList(item.id)}>
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
                  <Star selected={index < stars}>
                    {index < stars ? "★" : "☆"}
                  </Star>
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

export default BookDetails;
