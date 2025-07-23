import React, { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import styled from "styled-components";
import axios from "axios";
import { mobile } from "../Responsive";
import { publicRequest } from "../axiosReqMethods";
import { setError } from "../redux/errorRedux";
import { useDispatch } from "react-redux";
import ProductNotFound from "./ProductNotFound";

// Styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

const LoadMore = styled.button`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid teal;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 128, 128, 0.1);
  transition: all 0.3s ease-in-out;

  :hover {
    background-color: teal;
    color: white;
    box-shadow: 0 5px 15px rgba(0, 128, 128, 0.3);
  }
`;

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: space-evenly;

  ${mobile({
    padding: "0px",
    gap: "0",
  })}
`;

// Types
interface ProductProps {
  sort?: string;
  cat?: string;
  filter?: {
    color?: string;
    size?: string;
  };
}

interface ProductData {
  _id: string;
  [key: string]: any;
}

const Product: React.FC<ProductProps> = ({ sort, cat, filter }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const color = filter?.color;
  const size = filter?.size;

  const [prevFilters, setPrevFilters] = useState({
    color: null as string | null,
    size: null as string | null,
    sort: null as string | null,
  });

  // Reset page on filter change
  useEffect(() => {
    setPrevFilters({
      sort: sort ?? null,
      color: color ?? null,
      size: size ?? null,
    });
    setPage(1);
  }, [sort, color, size]);

  useEffect(() => {
    const axiosCancelToken = axios.CancelToken.source();

    let url = `/api/products/allinfo?page=${page}`;
    if (cat) url += `&category=${cat}`;
    if (color) url += `&color=${color}`;
    if (size) url += `&size=${size}`;
    if (sort) url += `&sort=${sort}`;

    const getProducts = async () => {
      try {
        const res = await publicRequest.get(url, {
          cancelToken: axiosCancelToken.token,
        });
        const filtersChanged =
          JSON.stringify(prevFilters) !== JSON.stringify({ sort, color, size });

        if (filtersChanged) {
          setProducts(res.data);
        } else {
          setProducts((prev) => [...prev, ...res.data]);
        }
      } catch (error: any) {
        if (axios.isCancel(error)) {
          setProducts([]);
          return;
        }

        const msg = error?.response?.data?.message || "Something went wrong";
        dispatch(setError(msg));
      }
    };

    getProducts();

    return () => {
      axiosCancelToken.cancel();
    };
  }, [cat, page, color, size, sort]);

  // Prevent placeholder filter values
  useEffect(() => {
    if (filter?.color === "Color") delete filter.color;
    if (filter?.size === "Size") delete filter.size;
  }, [filter]);

  return (
    <Container className="container">
      {!products.length ? (
        <ProductNotFound
          title="Oops! No product Found"
          desc="Your filter did not match any product"
        />
      ) : (
        <>
          <Wrapper>
            {products.map((data) => (
              <ProductItem data={data} key={data._id} />
            ))}
          </Wrapper>
          <LoadMore onClick={() => setPage((p) => p + 1)}>Load More</LoadMore>
        </>
      )}
    </Container>
  );
};

export default Product;
