import styled from 'styled-components/native';

// Container principal
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f7f7f7;
`;

// Título
export const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #4f46e5;
  margin-bottom: 20px;
`;

// Container de busca
export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

// Campo de busca
export const SearchInput = styled.TextInput`
  flex: 1;
  height: 45px;
  padding: 0 15px;
  border-radius: 30px;
  border: 1px solid #4f46e5;
  background-color: #fff;
  margin-right: 10px;
  font-size: 16px;
`;

// Botão de busca
export const SearchButton = styled.TouchableOpacity`
  background-color: #4f46e5;
  padding: 12px 20px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;

// Texto do botão de busca
export const SearchButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

// Item de filme
export const MovieItem = styled.TouchableOpacity`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 10px;
  shadow-color: #000;
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  elevation: 3;
`;

// Título do filme
export const MovieTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

// Cartaz do filme
export const Poster = styled.Image`
  width: 100%;
  height: 250px;
  margin-top: 10px;
  border-radius: 10px;
  resize-mode: contain;
`;
