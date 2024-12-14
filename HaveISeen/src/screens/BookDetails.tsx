import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet, Image, TextInput, Modal } from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Contexto para pegar o usuário autenticado

interface BookDetailsProps {
  route: {
    params: {
      book: {
        id: string;
        title: string;
        authors: string[];
        thumbnail: string;
      };
    };
  };
}

const BookDetails: React.FC<BookDetailsProps> = ({ route, navigation }) => {
  const { book } = route.params;
  const { user } = useAuth(); // Pega o usuário logado
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [addToListModalVisible, setAddToListModalVisible] = useState(false);

  const handleAddToList = async () => {
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para adicionar livros à lista.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://192.168.1.3:3000/api/users/listregister", {
        user_id: user.id,
        list_name: "Minha Lista de Livros",
        list_type: "book",
        item_id: book.id,
        item_details: {
          title: book.title,
          authors: book.authors,
          thumbnail: book.thumbnail,
        },
      });

      Alert.alert("Sucesso", `${book.title} foi adicionado à sua lista!`);
      setAddToListModalVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar à lista:", error);
      Alert.alert("Erro", "Não foi possível adicionar o livro à lista.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user || !reviewText) {
      Alert.alert("Erro", "Por favor, escreva um review antes de enviar.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://192.168.1.3:3000/api/reviews", {
        user_id: user.id,
        book_id: book.id,
        review_text: reviewText,
      });

      Alert.alert("Sucesso", "Seu review foi enviado!");
      setModalVisible(false);
      setReviewText("");
    } catch (error) {
      console.error("Erro ao enviar review:", error);
      Alert.alert("Erro", "Não foi possível enviar seu review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.authors}>Autores: {book.authors.join(", ")}</Text>
      <Image source={{ uri: book.thumbnail }} style={styles.bookImage} />
      
      {/* Botão Adicionar à Lista que abre o modal */}
      <Button
        title="Adicionar à Lista"
        onPress={() => setAddToListModalVisible(true)}
      />
      
      {/* Modal de adicionar à lista */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addToListModalVisible}
        onRequestClose={() => setAddToListModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar à Lista</Text>
            <Image source={{ uri: book.thumbnail }} style={styles.bookImageModal} />
            <Text style={styles.modalText}>{book.title}</Text>
            <Button title={loading ? "Adicionando..." : "Confirmar Adição"} onPress={handleAddToList} disabled={loading} />
            <Button title="Fechar" onPress={() => setAddToListModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
      {/* Botão para escrever review */}
      <Button title="Escrever Review" onPress={() => setModalVisible(true)} />
      
      {/* Modal para escrever review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Escreva seu review..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <Button title="Enviar Review" onPress={handleReviewSubmit} />
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
  authors: {
    fontSize: 18,
    marginBottom: 20,
  },
  bookImage: {
    width: 150,
    height: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  bookImageModal: {
    width: 100,
    height: 150,
    marginBottom: 10,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  reviewInput: {
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default BookDetails;
