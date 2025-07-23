import type { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { userRequest } from "../axiosReqMethods";
import ModalComp from "./ModalComp";
import { setAddress as setReduxAddress } from "../redux/userRedux";
import { setError } from "../redux/errorRedux";
import type { RootState } from "../redux/store";

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #555;
  }
`;

const Select = styled.select`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 18px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    border-color: #555;
  }
`;

const StyledLabel = styled.label`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const StyledForm = styled.form`
  max-width: 600px;
  margin: 0 auto;
`;

const StyledButton = styled.button`
  background-color: #555;
  color: #fff;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
  &:hover {
    background-color: #777;
  }
`;

interface UpdateUserPassProps {
  isOpen: boolean;
  setModal: (open: boolean) => void;
}

interface PasswordForm {
  currentPass: string;
  password: string;
  confPass: string;
}

const UpdateUserPass: React.FC<UpdateUserPassProps> = ({
  isOpen,
  setModal,
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<PasswordForm>({
    currentPass: "",
    password: "",
    confPass: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confPass) {
      dispatch(setError("Password and Confirm Password do not match!"));
      return;
    }

    try {
      dispatch(setReduxAddress(formData)); // Optional - this line may not be needed unless you're storing it
      const { data } = await userRequest.put(
        `/api/users/${user._id}`,
        formData
      );
      dispatch(setError("Password updated successfully!"));
    } catch (error: any) {
      dispatch(
        setError(error?.response?.data?.error || "Something went wrong")
      );
    }

    setModal(false);
  };

  return (
    <ModalComp isOpen={isOpen}>
      <StyledForm onSubmit={handleSubmit}>
        <StyledLabel>Current Password:</StyledLabel>
        <StyledInput
          type="password"
          name="currentPass"
          value={formData.currentPass}
          onChange={handleChange}
          placeholder="Enter Current Password"
          required
        />

        <StyledLabel>New Password:</StyledLabel>
        <StyledInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter New Password"
          required
        />

        <StyledLabel>Confirm Password:</StyledLabel>
        <StyledInput
          type="password"
          name="confPass"
          value={formData.confPass}
          onChange={handleChange}
          placeholder="Confirm New Password"
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

export default UpdateUserPass;
