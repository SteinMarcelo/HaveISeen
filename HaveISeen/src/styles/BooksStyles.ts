import styled from "styled-components/native";
import { TextInput, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9fafb;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 20px;
`;

export const SearchInput = styled(TextInput)`
  height: 40px;
  border-color: #d1d5db;
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 10px;
  margin-bottom: 10px;
  background-color: #fff;
`;

export const SearchButton = styled(TouchableOpacity)`
  background-color: #4f46e5;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 20px;
`;

export const SearchButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const BookList = styled(FlatList)`
  flex: 1;
`;

export const LoadingIndicator = styled(ActivityIndicator)`
  margin-top: 20px;
`;