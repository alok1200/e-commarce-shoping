import React from "react";
import styled from "styled-components";
import { Categoris } from "../DummyData.js";
import CategoryItems from "./CategoryItems.js";
import { mobile } from "../Responsive.js";

// Types
interface CategoryItemType {
  id: number;
  img: string;
  title: string;
  cat: string;
}

const Container = styled.div`
  width: max-content;
  max-width: 100%;
  margin: auto;
  margin-bottom: 60px;
`;

const Title = styled.div`
  font-family: "Hanken Grotesk", sans-serif;
  font-size: 40px;
  font-weight: 500;
  margin-bottom: 15px;
  margin-left: 5px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  ${mobile({
    flexDirection: "column",
    margin: "10px",
  })}
`;

const Category: React.FC = () => {
  return (
    <Container>
      <Title>Categories</Title>
      <Wrapper>
        {Categoris.map((item: CategoryItemType) => (
          <CategoryItems item={item} key={item.id} />
        ))}
      </Wrapper>
    </Container>
  );
};

export default Category;
