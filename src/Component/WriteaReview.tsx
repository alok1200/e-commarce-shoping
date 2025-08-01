import React, { useState } from "react";
import ModalComp from "./ModalComp.js";
import styled from "styled-components";
import { Rating } from "@mui/material";
import { userRequest } from "../axiosReqMethods.js";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../redux/errorRedux.js";
import type { RootState } from "../redux/store.js";

// ---------- Styled Components ----------
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
`;

const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Name = styled.span`
  font-size: 20px;
`;

const RatingWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-height: 300px;
`;

const TextBox = styled.textarea`
  width: 400px;
  max-width: 90%;
  border: 3px solid teal;
  font-size: 15px;
  padding: 10px 10px;
  height: 150px;
  border-radius: 1vmin;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const Button = styled.button<{ T?: "submit" }>`
  margin: 10px;
  padding: 10px 20px;
  border-radius: 1vmax;
  border: 1px solid teal;
  background-color: ${({ T }) => (T === "submit" ? "teal" : "white")};
  font-weight: 600;
  color: ${({ T }) => (T === "submit" ? "white" : "teal")};
  cursor: pointer;

  &:disabled {
    background-color: #c0f3f3;
    border: 1px solid #c0f3f3;
    cursor: not-allowed;
    color: black;
  }
`;

// ---------- Types ----------
interface WriteAReviewProps {
  product: {
    _id: string;
    title: string;
  };
  isOpen: boolean;
  setModal: (val: boolean) => void;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// ---------- Component ----------
const WriteaReview: React.FC<WriteAReviewProps> = ({
  product,
  isOpen,
  setModal,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number | null>(0);

  const handleSubmit = async () => {
    try {
      const { data } = await userRequest.post(`/api/review/${product._id}`, {
        rating,
        review,
      });

      dispatch(setError(data.message));
      setModal(false);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(apiError?.response?.data?.message || "An error occurred")
      );
      setRating(0);
      setReview("");
    }
  };

  return (
    <ModalComp isOpen={isOpen}>
      <Container>
        <h1>{product.title}</h1>
        <UserWrapper>
          <Image src={user?.avatar} alt="User Avatar" />
          <Name>{`${user?.firstName} ${user?.lastName}`}</Name>
        </UserWrapper>
        <RatingWrapper>
          <Rating
            style={{ fontSize: "40px" }}
            value={rating}
            onChange={(_, newValue) => {
              setRating(newValue);
            }}
            precision={0.1}
          />
          <TextBox
            placeholder="Share your thoughts on this product..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </RatingWrapper>
        <ButtonWrapper>
          <Button onClick={() => setModal(false)}>Cancel</Button>
          <Button
            T="submit"
            onClick={handleSubmit}
            disabled={!review && !rating}
          >
            Submit
          </Button>
        </ButtonWrapper>
      </Container>
    </ModalComp>
  );
};

export default WriteaReview;
