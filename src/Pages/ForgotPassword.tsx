import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { publicRequest } from "../axiosReqMethods.js";
import { mobile } from "../Responsive.js";
import Navbar from "../Component/Navbar.js";
import { useDispatch } from "react-redux";
import { setError } from "../redux/errorRedux.js";

interface ForgotPasswordProps {
  title?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 58px); //60px of navbar
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f2f2f2;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/131634/pexels-photo-131634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
`;
const Wrapper = styled.div`
  padding: 30px 40px;
  width: min(300px, 80%);
  background-color: white;
  flex-direction: row;
  position: relative;
  align-items: center;
  border-radius: 1vmax;
  box-shadow: 20px 20px 50px grey;
  ${mobile({
    padding: "15px 20px",
  })}
`;

const Form = styled.form`
  margin-bottom: 40px;
`;
const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;
const P = styled.p`
  text-align: center;
  max-width: 90%;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 30px;
  margin-left: 13px;
  font-weight: 400;
`;
const Input = styled.input`
  padding: 5px;
  width: min(290px, 95%);
  margin-bottom: 15px;
  font-size: 1rem;
  border-radius: 0.5vmax;
`;
const Button = styled.button`
  padding: 5px;
  width: min(300px, 100%);
  margin-bottom: 10px;
  border-radius: 0.5vmax;
  background-color: teal;
  color: white;
  border: none;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    background-color: #9af5f5;
  }
`;

const Button2 = styled.button`
  text-align: center;
  position: absolute;
  width: min(480px, 100%);
  //height: 20px;
  padding: 15px 0px;
  left: 0px;
  cursor: pointer;
  border: none;
  //box-shadow: 20px 20px 50px grey;
  border-radius: 0vmax 0vmax 1vmax 1vmax;
`;

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // email state is either string or null
  const [email, setEmail] = useState<string>("");

  // message state was unused, so I removed it for now

  // Form submit handler typed with React.FormEvent<HTMLFormElement>
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await publicRequest.post("/api/auth/forgotpass", {
        email,
      });
      console.log(data);
      //checking if req was success
      if (data.sucess) {
        dispatch(setError(data.message));
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(
          apiError?.response?.data?.message || "An unexpected error occurred."
        )
      );
    }
  };

  // Input change typed with React.ChangeEvent<HTMLInputElement>
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          <Title>Trouble Logging In?</Title>
          <P>
            Enter your email and we'll send you a link to reset your account
            password.
          </P>
          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              onChange={handleEmailChange}
              value={email}
            />
            <Button disabled={!email}>Send reset link</Button>
          </Form>
          <Button2 onClick={() => navigate("/login")}>Back To Login</Button2>
        </Wrapper>
      </Container>
    </>
  );
};

export default ForgotPassword;
