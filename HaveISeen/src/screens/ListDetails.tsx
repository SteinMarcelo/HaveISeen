import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";

const ListDetails: React.FC = ({ route }: any) => {
  const { listId, type } = route.params;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchListDetails();
  }, [listId, type]); // Recarrega a lista se listId ou type mudar

  const fetchListDetails = async () => {
    setLoading(true);
    console.log("listId:", listId);
    console.log("type:", type);

    try {
      const response = await axios.get(
        `http://127.0.0.1:3000/api/users/listItens?listId=${listId}&type=${type}`
      );
      setItems(response.data.items);
    } catch (error) {
      console.error("Erro ao buscar itens da lista:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemId}>Item ID: {item.item_id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.item_id.toString()}
          renderItem={renderItem}
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
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 16,
  },
  itemId: {
    fontSize: 14,
    color: "#555",
  },
});

export default ListDetails;
