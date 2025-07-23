import React, { useEffect } from "react";
import Announcments from "../Component/Announcments";
import Category from "../Component/Category";
import Footer from "../Component/Footer";
import Navbar from "../Component/Navbar";
import NewsLetter from "../Component/NewsLetter";
import Product from "../Component/products.js";
import Slider from "../Component/Slider";

import styled from "styled-components";

const Title = styled.h2`
  font-family: "Hanken Grotesk", sans-serif;
  font-size: 40px;
  font-weight: 500;
  margin-bottom: 15px;
  margin-left: 5px;
`;

interface HomeProps {
  title: string;
}

const Home: React.FC<HomeProps> = ({ title }) => {
  //to change title as soon as component mounts
  useEffect(() => {
    document.title = `SatnamCreation - ${title}`;
  }, [title]); // include title in deps

  return (
    <>
      <Announcments />
      <Navbar />
      <Slider />
      <Category />
      <div className="container">
        <Title>Top Products</Title>
        <br />
        <Product sort="toppurchased" />
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
};

export default Home;
