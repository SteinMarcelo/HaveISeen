import styled from "styled-components/native";
import { FlatList, ActivityIndicator } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f9fafb;
`;

export const ListContainer = styled.View`
  margin-top: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
`;

export const ListItem = styled.TouchableOpacity`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ListName = styled.Text`
  font-size: 16px;
  color: #1f2937;
`;

export const LoadingIndicator = styled(ActivityIndicator)`
  margin-top: 20px;
`;
