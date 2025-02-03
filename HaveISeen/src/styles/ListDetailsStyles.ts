import styled from "styled-components/native";
import { FlatList, ActivityIndicator } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9fafb;
`;

export const ItemContainer = styled.View`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ItemName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
`;

export const ItemDetails = styled.Text`
  font-size: 14px;
  color: #4b5563;
  margin-top: 5px;
`;

export const LoadingIndicator = styled(ActivityIndicator)`
  margin-top: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  background-color: #4f46e5;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 20px;
`;

export const BackButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;