import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4F46E5;
`;

export const Input = styled.TextInput`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 5px;
`;

export const RegisterLink = styled.Text`
  margin-top: 15px;
  color: #4F46E5;
  text-decoration-line: underline;
`;

export const ButtonContainer = styled.View`
  margin-top: 20px;
  width: 100%;
`;

export const StyledButton = styled.TouchableOpacity`
  background-color: #4F46E5;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
