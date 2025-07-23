import React from "react";
import styled, { keyframes } from "styled-components";

// Animation keyframes for spinning
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled backdrop for the loader
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Styled spinner element
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
`;

// Functional component with proper typing
const Loading: React.FC = () => {
  return (
    <Backdrop>
      <Spinner />
    </Backdrop>
  );
};

export default Loading;
