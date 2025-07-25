import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";

// Define the expected props
interface CategoryItemProps {
  item: {
    title: string;
    img: string;
    cat: string;
  };
}

// Styled components
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: flex;
  justify-content: center;
  margin: auto;
  transition: all 0.3s ease-in-out;
`;

const Info = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease-in-out;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 600;
  color: white;
`;

const Button = styled.button`
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border: none;
  box-shadow: 0px 0px 1px #888888;
  border-radius: 0.5vmin;
  transition: all 0.3s ease-in-out;
`;

const Container = styled.div`
  position: relative;
  margin: 3px;
  width: 400px;
  height: 500px;
  max-width: 100%;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  :hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  }

  :hover ${Image} {
    transform: scale(1.1);
  }

  :hover ${Info} {
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

// Inline style for link
const linkStyle: React.CSSProperties = {
  color: "black",
  textDecoration: "none",
};

const CategoryItems: React.FC<CategoryItemProps> = ({ item }) => {
  const { title, img, cat } = item;

  return (
    <Container>
      <Image src={img} alt={title} />
      <Info>
        <Title>{title}</Title>
        <Button>
          <Link style={linkStyle} to={`/products/${cat}`}>
            Read More
          </Link>
        </Button>
      </Info>
    </Container>
  );
};

export default CategoryItems;
