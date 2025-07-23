import type { ReactNode } from "react";
import styled from "styled-components";

// Props type for styled-components
interface ContainerProps {
  isOpen: boolean;
}

// Styled container using typed props
const Container = styled.div<ContainerProps>`
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  max-width: 90%;
  height: max-content;
  background-color: white;
  box-shadow: 0 0px 0px 1000px rgba(0, 0, 0, 0.3);
  padding: 20px;
  z-index: 102;
  border-radius: 1vmax;
  display: ${(p) => (p.isOpen ? "block" : "none")};
`;

// Props type for component
interface ModalCompProps {
  children: ReactNode;
  isOpen: boolean;
}

// Functional component with props
const ModalComp: React.FC<ModalCompProps> = ({ children, isOpen }) => {
  return <Container isOpen={isOpen}>{children}</Container>;
};

export default ModalComp;
