import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, type FormEvent } from "react";
import { publicRequest } from "../axiosReqMethods.js";
import { mobile } from "../Responsive.js";
import Navbar from "../Component/Navbar.js";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useDispatch } from "react-redux";
import { setError } from "../redux/errorRedux.js";

interface ResetPasswordProps {
  title?: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
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
  width: min(304px, 100%);
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
  width: min(485px, 100%);
  padding: 15px 0px;
  left: 0px;
  cursor: pointer;
  border: none;
  border-radius: 0vmax 0vmax 1vmax 1vmax;
`;

const Wrapper2 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  padding: 30px 40px;
  width: min(400px, 80%);
  border-radius: 1vmax;
  box-shadow: 20px 20px 50px grey;
  position: relative;
  ${mobile({
    minWidth: "80%",
    padding: "15px 20px",
  })}
`;

const BackToLogin = styled.button`
  border-radius: 0vmax 0vmax 1vmax 1vmax;
  width: min(500px, 100%);
  position: absolute;
  bottom: -10px;
  border: none;
  font-size: 15px;
  padding: 15px 0px;
  cursor: pointer;
  ${mobile({
    minWidth: "100%",
  })}
`;

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use empty string as default, not null
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");

  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const [passChanged, setPassChanged] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== cpassword) {
      dispatch(setError("Passwords do not match"));
      setPassword("");
      setCpassword("");
      return;
    }

    try {
      await publicRequest.post(`/api/auth/resetpassword/${id}`, {
        password,
      });
      setPassChanged(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.log(error);
      dispatch(
        setError(apiError?.response?.data?.error || "Something went wrong")
      );
      setPassChanged(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        {!passChanged ? (
          <Wrapper>
            <Title>Trouble Logging In?</Title>
            <P>
              Enter your password and we'll send you a link to reset your
              account password.
            </P>
            <Form onSubmit={handleSubmit}>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={cpassword}
                onChange={(e) => setCpassword(e.target.value)}
              />
              <Button disabled={!password || !cpassword}>
                Change Password
              </Button>
            </Form>
            <Button2 onClick={() => navigate("/login")}>Back To Login</Button2>
          </Wrapper>
        ) : (
          <Wrapper2>
            <CheckCircleOutlineIcon
              style={{ color: "green", fontSize: "150px", margin: "20px 0px" }}
            />
            <h1 style={{ margin: "10px 0px" }}>Password Changed!</h1>
            <p style={{ margin: "10px 0px", marginBottom: "40px" }}>
              Your password has been changed successfully
            </p>
            <BackToLogin onClick={() => navigate("/login")}>
              Back to login
            </BackToLogin>
          </Wrapper2>
        )}
      </Container>
    </>
  );
};

export default ResetPassword;
