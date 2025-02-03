import styled from "styled-components/native";
import { Modal, FlatList, TouchableOpacity, TextInput } from "react-native";

export const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
  background-color: #f9fafb;
`;

export const Poster = styled.Image`
  width: 300px;
  height: 450px;
  margin-bottom: 20px;
  border-radius: 10px;
  resize-mode: cover;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
  text-align: center;
`;

export const Info = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
  color: #4b5563;
`;

export const Overview = styled.Text`
  font-size: 16px;
  margin-top: 10px;
  text-align: justify;
  color: #333;
`;

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 10px;
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

export const ListItem = styled(TouchableOpacity)`
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb;
  width: 100%;
`;

export const ListName = styled.Text`
  font-size: 16px;
  color: #1f2937;
`;

export const NewListContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export const Input = styled(TextInput)`
  border-bottom-width: 1px;
  border-bottom-color: #d1d5db;
  flex: 1;
  padding: 8px;
  color: #1f2937;
`;

export const AddButton = styled(TouchableOpacity)`
  margin-left: 10px;
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
