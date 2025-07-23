import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Announcments from "../Component/Announcments";
import Navbar from "../Component/Navbar";
import styled from "styled-components";
import Product from "../Component/products";
import NewsLetter from "../Component/NewsLetter";
import Footer from "../Component/Footer";
import { useLocation } from "react-router-dom";
import { mobile } from "../Responsive.js";

const Container = styled.div`
  scroll-behavior: smooth;
`;
const Title = styled.h1`
  margin: 20px 20px;
`;
const FilterContainer = styled.div`
  margin: 20px;
  display: flex;
  justify-content: space-between;
`;
const Filter = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
const FilterText = styled.span`
  margin-right: 20px;
`;
const Select = styled.select`
  padding: 10px;
  font-size: 15px;
  margin-right: 10px;

  &:hover {
    box-shadow: 3px 3px 2px -1px rgba(0, 0, 0, 0.2);
  }
  ${mobile({
    marginTop: "5px",
    width: "70%",
    marginLeft: "2px",
  })}
`;
const Options = styled.option``;

// Define the type of filter state
interface FilterType {
  color?: string;
  size?: string;
}

interface ProductListProps {
  title: string;
}

const ProductList: React.FC<ProductListProps> = (props) => {
  const location = useLocation();
  let cat: string | undefined = location.pathname.split("/")[2];
  if (cat === "all") cat = undefined;

  const [filter, setFilter] = useState<FilterType>({});
  const [sort, setSort] = useState<string>("Newest");

  const handleFilters = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    setFilter({
      ...filter,
      [name]: value,
    });
  };

  useEffect(() => {
    document.title = `SatnamCreation - ${props.title}`;
  }, [props.title]); // added dependency for good practice

  return (
    <Container>
      <Announcments />
      <Navbar />
      <Title>{cat || "All Products"}</Title>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
          <Select name="color" onChange={handleFilters} defaultValue="">
            <Options value="" disabled>
              Color
            </Options>
            <Options value="red">Red</Options>
            <Options value="green">Green</Options>
            <Options value="blue">Blue</Options>
            <Options value="yellow">Yellow</Options>
            <Options value="black">Black</Options>
            <Options value="white">White</Options>
          </Select>
          <Select name="size" onChange={handleFilters} defaultValue="">
            <Options value="" disabled>
              Size
            </Options>
            <Options value="S">S</Options>
            <Options value="M">M</Options>
            <Options value="L">L</Options>
            <Options value="XL">XL</Options>
            <Options value="XXL">XXL</Options>
            <Options value="XXXL">XXXL</Options>
          </Select>
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select
            onChange={(e) => setSort(e.target.value)}
            defaultValue="Newest"
          >
            <Options value="Newest">Newest</Options>
            <Options value="topRated">Top rated</Options>
            <Options value="toppurchased">Most Purchased</Options>
            <Options value="topreviewed">Most reviewed</Options>
            <Options value="price-desc">Price (H to L)</Options>
            <Options value="price-asc">Price (L to H)</Options>
          </Select>
        </Filter>
      </FilterContainer>
      <Product cat={cat} filter={filter} sort={sort} />
      <NewsLetter />
      <Footer />
    </Container>
  );
};

export default ProductList;
