import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { KeyboardDoubleArrowUp } from "@mui/icons-material";

// Props interface for styled Container
interface ContainerProps {
  $visible: boolean;
}

const Container = styled.div<ContainerProps>`
  scroll-behavior: smooth;
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  z-index: 999;
`;

const Icon = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(2);
  background-color: white;
  border-radius: 50%;
  border: 2px solid #000;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &:hover {
    color: white;
    background-color: #000;
  }
`;

const BackToTopBTN: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Container $visible={isVisible}>
      <Icon onClick={handleClick}>
        <KeyboardDoubleArrowUp />
      </Icon>
    </Container>
  );
};

export default BackToTopBTN;
