import React, { useEffect, useState, type FormEvent } from "react";
import styled from "styled-components";
import Navbar from "../Component/Navbar.js";
import { mobile } from "../Responsive.js";
import { Link } from "react-router-dom";
import { login } from "../redux/apiCall.js";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store.js";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 58px); //60px of navbar
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/131634/pexels-photo-131634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
`;
const Wrapper = styled.div`
  width: min(400px, 80%);
  padding: 40px 30px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 1vmax;
  box-shadow: 20px 20px 50px grey;
  ${mobile({
    padding: "20px 15px",
  })}
`;
const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 10px;
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  min-width: 80%;
  padding: 10px;
  margin: 15px 0;
  flex: 1;
  display: flex;
  min-height: 40%;
  border-radius: 0.5vmax;
  ${mobile({
    margin: "15px 0px",
  })}
`;

const Button = styled.button`
  margin: 10px 0px;
  width: 40%;
  border: none;
  background-color: teal;
  padding: 15px 20px;
  color: white;
  border-radius: 1vmin;
  margin-right: 60%;
  &:disabled {
    color: green;
    background-color: #e1e6ed;
    cursor: not-allowed;
  }
`;
const HelpLink = styled.a`
  margin: 5px 0px;
`;
const Error = styled.span`
  color: red;
`;

interface LoginProps {
  title?: string;
}

const Login: React.FC<LoginProps> = ({ title }) => {
  //to change title as soon as component mounts
  useEffect(() => {
    document.title = `SatnamCreation - ${title}`;
  }, [title]);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const { isFetching, error } = useSelector((state: RootState) => state.user);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    login(dispatch, { email, password });
  };

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          <Title>Login</Title>
          <Form autoComplete="on" onSubmit={submit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <HelpLink style={{ marginLeft: "auto", marginRight: "0" }}>
              <Link to="/forgotpassword">Forgot your password?</Link>
            </HelpLink>
            <Button type="submit" disabled={isFetching}>
              Login
            </Button>
          </Form>
          {error && <Error>{error}</Error>}

          <HelpLink>
            <Link to="/signup">Create New Account</Link>
          </HelpLink>
        </Wrapper>
      </Container>
    </>
  );
};

export default Login;
