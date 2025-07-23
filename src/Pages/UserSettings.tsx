import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import styled from "styled-components";
import Footer from "../Component/Footer.js";
import Navbar from "../Component/Navbar.js";
import NewsLetter from "../Component/NewsLetter.js";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../redux/errorRedux.js";
import { userRequest } from "../axiosReqMethods.js";
import { setAddress, updateUser } from "../redux/userRedux.js";
import GetUserAddress from "../Component/GetUserAddress.js";
import UpdateUserPass from "../Component/UpdatePassword.js";
import type { RootState } from "../redux/store.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 3rem 0;
  width: 1200px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const MainSection = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  > * {
    width: max-content;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    color: #777;
  }
`;

const Content = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 500px;
  max-width: 100%;

  > form {
    width: 100%;

    > p {
      margin-top: 0.5rem;
    }
  }
`;

const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;
const FakeInput = styled.div`
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #777;
  }
`;

const AddressContainer = styled.div`
  width: 500px;
  max-width: 100%;
  display: flex;
  justify-content: space-between;
`;
const AddressMain = styled.div``;

const Edit = styled.p`
  text-decoration: underline;
  cursor: pointer;
`;

const navMap: { [key: number]: string } = {
  1: "Account Details",
  2: "Delivery Addresses",
};

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  mobile: string;
}

interface UserSettingsProps {
  title?: string;
}

const UserSettings: React.FC<UserSettingsProps> = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.currentUser);
  const userAddress = useSelector((state: RootState) => state.user.address);

  const { firstName, lastName, email, number } = user || {};

  const [userDataForm, setUserDataForm] = useState({
    firstName,
    lastName,
    email,
    number,
  });

  const [isActivated, setIsActivated] = useState<number>(1);
  const [isAddressOpen, setAddressOpen] = useState<boolean>(false);
  const [isEditPassOpen, setIsEditPassOpen] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDataForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await userRequest.put(
        `/api/users/${user._id}`,
        userDataForm
      );
      dispatch(setError("Profile updated Successfully!!"));
      dispatch(updateUser(data));
    } catch {
      console.error("Failed to update profile");
      dispatch(setError("Failed to update Profile!!"));
    }
  };

  useEffect(() => {
    if (userAddress) return;
    (async () => {
      try {
        const { data } = await userRequest.get("/api/user/address");
        dispatch(setAddress(data.address));
      } catch {
        dispatch(setError("Failed to fetch Address!!"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Wrapper>
          <Title>Settings</Title>
          <MainSection>
            <Navigation>
              <NavLink onClick={() => setIsActivated(1)}>
                Account Details
              </NavLink>
              <NavLink onClick={() => setIsActivated(2)}>
                Delivery Addresses
              </NavLink>
            </Navigation>
            <Content>
              <Title>{navMap[isActivated]}</Title>
              {isActivated === 1 && user && (
                <form onSubmit={handleUpdateProfile}>
                  <p>First name</p>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={userDataForm.firstName}
                    onChange={handleInputChange}
                  />
                  <p>Last name</p>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={userDataForm.lastName}
                    onChange={handleInputChange}
                  />
                  <p>Email address</p>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={userDataForm.email}
                    onChange={handleInputChange}
                  />
                  <p>Number</p>
                  <Input
                    type="tel"
                    name="number"
                    placeholder="Phone number"
                    value={userDataForm.number}
                    onChange={handleInputChange}
                  />
                  <p>Password</p>
                  <FakeInput>
                    *************{" "}
                    <Edit onClick={() => setIsEditPassOpen(true)}>Edit</Edit>
                  </FakeInput>
                  <Button type="submit">Save Changes</Button>
                </form>
              )}
              {isActivated === 2 && userAddress && user && (
                <AddressContainer>
                  <AddressMain>
                    <p>Default Delivery Address</p>
                    <p>{`${user.firstName} ${user.lastName}`}</p>
                    <p>{`${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.country}`}</p>
                    <p>{`${userAddress.city}, ${userAddress.zip}`}</p>
                  </AddressMain>
                  <Edit onClick={() => setAddressOpen(true)}>Edit</Edit>
                </AddressContainer>
              )}
            </Content>
          </MainSection>
        </Wrapper>
      </Container>
      <GetUserAddress
        isOpen={isAddressOpen}
        setModal={setAddressOpen}
        prevAdd={userAddress as Address | null | undefined}
      />
      <UpdateUserPass isOpen={isEditPassOpen} setModal={setIsEditPassOpen} />
      <NewsLetter />
      <Footer />
    </>
  );
};

export default UserSettings;
