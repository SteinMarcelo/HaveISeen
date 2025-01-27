import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Lists: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [movieLists, setMovieLists] = useState<any[]>([]);
  const [bookLists, setBookLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user_id = user?.id;

  useEffect(() => {
    if (user_id) {
      fetchLists("movie");
      fetchLists("book");
    }
  }, [user_id]);

  const fetchLists = async (type: "movie" | "book") => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.1.150:3000/api/users/lists?user_id=${user_id}&type=${type}`
      );
      if (type === "movie") {
        setMovieLists(response.data.lists);
      } else if (type === "book") {
        setBookLists(response.data.lists);
      }
    } catch (error) {
      console.error(`Erro ao buscar listas de ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handlePressList = (listId: number, type: string) => {
    navigation.navigate("ListDetails", { listId, type });
  };

  const renderListItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handlePressList(item.id, item.type)}
    >
      <Text style={styles.listName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Listas de Filmes</Text>
          <FlatList
            data={movieLists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListItem}
          />
          <Text style={styles.sectionTitle}>Listas de Livros</Text>
          <FlatList
            data={bookLists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderListItem}
          />
        </View>
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
  listContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listName: {
    fontSize: 16,
  },
});

export default Lists;
