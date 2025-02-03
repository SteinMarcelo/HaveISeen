import styled from "styled-components/native";
import { Modal, FlatList, TouchableOpacity, TextInput } from "react-native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f9fafb;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

export const Authors = styled.Text`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 16px;
`;

export const BookImage = styled.Image`
  width: 120px;
  height: 180px;
  margin-bottom: 16px;
  border-radius: 8px;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  width: 80%;
`;

export const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

export const ListItem = styled(TouchableOpacity)`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
`;

export const ListName = styled.Text`
  font-size: 16px;
  color: #1f2937;
`;

export const Input = styled(TextInput)`
  border-bottom-width: 1px;
  border-bottom-color: #d1d5db;
  flex: 1;
  padding: 8px;
  color: #1f2937;
`;

export const NewListContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const AddButton = styled(TouchableOpacity)`
  margin-left: 10px;
`;

export const StarsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
`;

export const Star = styled.Text`
  font-size: 24px;
  margin-horizontal: 5px;
  color: ${(props: { selected: any; }) => (props.selected ? "#4F46E5" : "#d1d5db")};
`;

export const TextInputReview = styled(TextInput)`
  width: 100%;
  height: 80px;
  border-color: #d1d5db;
  border-width: 1px;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  text-align-vertical: top;
  color: #1f2937;
`;

export const Button = styled(TouchableOpacity)`
  background-color: #4f46e5;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 10px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ActivityIndicatorStyled = styled.ActivityIndicator`
  margin-top: 20px;
`;