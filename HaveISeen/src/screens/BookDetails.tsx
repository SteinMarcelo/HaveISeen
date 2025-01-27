import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

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
        `http://192.168.1.150:3000/api/users/lists?user_id=${user_id}&type=book`
      );
      // Verificar se a resposta contém dados válidos
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
      await axios.post("http://192.168.1.150:3000/api/users/listRegister", {
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
      // Enviar para a API o ID da lista e o ID do livro
      await axios.post("http://192.168.1.150:3000/api/users/addItemToList", {
        list_id: listId,
        item_id: book_id,
      });

      Alert.alert("Sucesso", "Livro adicionado à lista com sucesso!"); // Usando alert do React Native
      toggleModal(); // Fechar o modal após adicionar
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

  return (
    <View style={styles.container}>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.authors}>Autores: {book.authors.join(", ")}</Text>
          <Image source={{ uri: book.thumbnail }} style={styles.bookImage} />
          <Button title="Adicionar à Lista" onPress={toggleModal} />
        </>
      )}

      {/* Modal de Adicionar à Lista */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Suas Listas</Text>

            <View style={styles.newListContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nova lista"
                value={newListName}
                onChangeText={setNewListName}
              />
              <TouchableOpacity
                onPress={handleAddList}
                style={styles.addButton}
              >
                <Ionicons name="add-circle" size={32} color="#007BFF" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={lists}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => handleAddBookToList(item.id)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  authors: { fontSize: 16, marginBottom: 16 },
  bookImage: { width: 120, height: 180, marginBottom: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  listItem: { padding: 10, borderBottomWidth: 1 },
  listName: { fontSize: 16 },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  newListContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BookDetails;
