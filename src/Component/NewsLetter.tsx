import SendIcon from "@mui/icons-material/Send";
import React from "react";
import styled from "styled-components";
import { mobile } from "../Responsive.js";

const Container = styled.div`
  height: 60vh;
  background-color: #d7dedd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 25px;
  text-align: center;

  @media only screen and (max-width: 500px) {
    font-size: 50px;
  }
`;

const Description = styled.div`
  font-size: 1.6rem;
  margin: 1.6rem 5%;
  text-align: center;

  @media only screen and (max-width: 500px) {
    font-size: 17px;
  }

  ${mobile({
    fontSize: "1rem",
  })}
`;

const InputContainer = styled.div`
  height: 7%;
  width: 50%;
  background-color: white;
  display: flex;

  ${mobile({
    width: "80%",
  })}
`;

const Input = styled.input`
  padding-left: 2%;
  flex: 8;
  outline: none;
  border: none;
`;

const Button = styled.button`
  border: none;
  flex: 1;
  background-color: #6fc3c9;
  color: white;
  cursor: pointer;

  &:hover {
    transform: scale(1);
    background-color: #4d9296;
  }
`;

const NewsLetter: React.FC = () => {
  return (
    <Container>
      <Title>Subscribe to our NewsLetter</Title>
      <Description>
        and receive up to ₹300 discount on your first order
      </Description>
      <InputContainer>
        <Input placeholder="Enter your email" />
        <Button>
          <SendIcon />
        </Button>
      </InputContainer>
    </Container>
  );
};

export default NewsLetter;
