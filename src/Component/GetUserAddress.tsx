import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { userRequest } from "../axiosReqMethods";
import ModalComp from "./ModalComp.js";
import { setAddress as setReduxAddress } from "../redux/userRedux.js";
import { setError } from "../redux/errorRedux.js";
import type { RootState } from "../redux/store.js";

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
const StyledLabel = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;
const StyledButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }

  &[type="reset"] {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

// Address interface
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  mobile: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Props interface
interface GetUserAddressProps {
  isOpen: boolean;
  setModal: (open: boolean) => void;
  prevAdd?: Address | null;
}

const countries: string[] = [
  /* your full country list here */
];

const GetUserAddress: React.FC<GetUserAddressProps> = ({
  isOpen,
  setModal,
  prevAdd,
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const [address, setAddress] = useState<Address>(
    prevAdd || {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      mobile: user?.number || "",
    }
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const q = prevAdd ? "update=true" : "";
      dispatch(setReduxAddress(address));
      const { data } = await userRequest.post(
        `/api/user/address?${q}`,
        address
      );
      if (data.ok) {
        dispatch(setError("Address successfully updated"));
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(apiError?.response?.data?.message || "Something went wrong")
      );
    }
    setModal(false);
  };

  return (
    <ModalComp isOpen={isOpen}>
      <StyledForm onSubmit={handleSubmit}>
        <StyledLabel>Street</StyledLabel>
        <StyledInput
          type="text"
          name="street"
          value={address.street}
          onChange={handleChange}
          placeholder="Enter street"
          required
        />

        <StyledLabel>City</StyledLabel>
        <StyledInput
          type="text"
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />

        <StyledLabel>State</StyledLabel>
        <StyledInput
          type="text"
          name="state"
          value={address.state}
          onChange={handleChange}
          placeholder="Enter state"
          required
        />

        <StyledLabel>Zip</StyledLabel>
        <StyledInput
          type="text"
          name="zip"
          value={address.zip}
          pattern="^[1-9][0-9]{5}$"
          onChange={handleChange}
          placeholder="Enter zip code"
          required
        />

        <StyledLabel>Country</StyledLabel>
        <Select
          name="country"
          value={address.country}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </Select>

        <StyledLabel>Mobile Number</StyledLabel>
        <StyledInput
          type="tel"
          name="mobile"
          value={address.mobile}
          onChange={handleChange}
          pattern="^0?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"
          placeholder="Enter mobile number for delivery"
          required
        />

        <StyledButton type="submit">Submit</StyledButton>
        <StyledButton type="reset" onClick={() => setModal(false)}>
          Cancel
        </StyledButton>
      </StyledForm>
    </ModalComp>
  );
};

export default GetUserAddress;
