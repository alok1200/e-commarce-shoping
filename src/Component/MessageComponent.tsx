import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { clearError } from "../redux/errorRedux.js";
import type { RootState } from "../redux/store.js"; // Adjust path based on your store location

// Extend styled-components to accept custom props
interface ContainerProps {
  value: string;
}

const Container = styled.div<ContainerProps>`
  display: ${(props) => props.value};
  transition: all 0.5s ease-in-out;
  position: sticky;
  bottom: 0;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  min-height: 50px;
  background-color: #353536;
  display: flex;
  align-items: center;
`;

const Success = styled.div`
  margin-left: 15px;
  font-weight: 500;
  color: white;
`;

const MessageComponent: React.FC = () => {
  const dispatch = useDispatch();

  // Properly typed state selectors
  const id = useSelector((state: RootState) => state.error.id);
  const message = useSelector((state: RootState) => state.error.error);

  const [isShow, setIsShow] = useState<string>("block");

  useEffect(() => {
    if (message && id) {
      setIsShow("block");
      const timeout = setTimeout(() => {
        dispatch(clearError());
        setIsShow("none");
        console.log("hiding error");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message, id, dispatch]);

  return (
    <>
      {message && id && (
        <Container value={isShow}>
          <Wrapper>
            <Success>{message}</Success>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export default MessageComponent;
