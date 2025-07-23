import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import styled from "styled-components";
import Navbar from "../Component/Navbar.js";
import { mobile } from "../Responsive.js";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signUp } from "../redux/apiCall.js";
import type { RootState } from "../redux/store.js";

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
  padding: 30px 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 1vmax;
  box-shadow: 20px 20px 50px grey;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  width: min(370px, 100%);
  padding: 10px;
  margin: 10px 0px;
  border-radius: 0.5vmax;
  min-height: 40%;
  ${mobile({
    minWidth: "50%",
  })}
`;

const Button = styled.button`
  margin: 15px 0px;
  margin-right: 60%;
  min-width: 40%;
  border: none;
  background-color: teal;
  padding: 15px 20px;
  color: white;
  border-radius: 5%;
  display: block;
  &:disabled {
    color: green;
    background-color: #e1e6ed;
    cursor: not-allowed;
  }
`;

const HelpLink = styled.label`
  margin: 5px 0px;
  text-decoration: none;
  cursor: pointer;
  width: fit-content;
  display: inline;
`;

const Error = styled.span`
  color: red;
  margin-bottom: 5px;
`;

const FormValidationError = styled.p`
  color: red;
  width: 100%;
  margin-bottom: 1px;
`;

const SignupSuccessDiv = styled.h1`
  color: green;
  justify-content: center;
  align-items: center;
`;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  number?: string;
  password?: string;
  cpassword?: string;
}

interface SingUpProps {
  title?: string;
}

const SingUp: React.FC<SingUpProps> = (props) => {
  useEffect(() => {
    document.title = `SatnamCreation - ${props.title}`;
  }, [props.title]);

  const initialValue: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  };

  const [formValues, setFormValues] = useState<FormValues>(initialValue);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleValidate = (values: FormValues): FormErrors => {
    const error: FormErrors = {};
    if (!values.firstName) error.firstName = "First name is required";
    if (!values.lastName) error.lastName = "Last name is required";
    if (!values.number) error.number = "Number is required";
    if (!values.email) error.email = "Email is required";
    if (!values.password) error.password = "Password is required";
    if (!values.confirmPassword)
      error.cpassword = "Confirm password is required";
    if (values.password !== values.confirmPassword)
      error.cpassword = "Your password and confirm password don't match";
    return error;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors(handleValidate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    const push = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        // You can add userIP fetching logic here if needed
        signUp(dispatch, formValues);
      }
    };
    push();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formErrors]);

  const { isFetching, currentUser, error } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <>
      <Navbar />
      <Container>
        {currentUser ? (
          <SignupSuccessDiv>Signup Successful!</SignupSuccessDiv>
        ) : (
          <Wrapper>
            <Title>Sign Up</Title>
            <Form onSubmit={handleSubmit} autoComplete="on">
              <Input
                name="firstName"
                placeholder="Name"
                value={formValues.firstName}
                onChange={handleOnChange}
              />
              <FormValidationError>{formErrors.firstName}</FormValidationError>

              <Input
                name="lastName"
                placeholder="Last Name"
                value={formValues.lastName}
                onChange={handleOnChange}
              />
              <FormValidationError>{formErrors.lastName}</FormValidationError>

              <Input
                name="number"
                type="tel"
                placeholder="Phone Number"
                value={formValues.number}
                onChange={handleOnChange}
                pattern="^0?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
              />
              <FormValidationError>{formErrors.number}</FormValidationError>

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleOnChange}
              />
              <FormValidationError>{formErrors.email}</FormValidationError>

              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleOnChange}
                autoComplete="off"
              />
              <FormValidationError>{formErrors.password}</FormValidationError>

              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formValues.confirmPassword}
                onChange={handleOnChange}
                autoComplete="off"
              />
              <FormValidationError>{formErrors.cpassword}</FormValidationError>

              <Button disabled={isFetching}>Sign Up</Button>
            </Form>
            {error && <Error>{error}</Error>}
            <HelpLink>
              <Link to="/login">Already Have Account?</Link>
            </HelpLink>
          </Wrapper>
        )}
      </Container>
    </>
  );
};

export default SingUp;
