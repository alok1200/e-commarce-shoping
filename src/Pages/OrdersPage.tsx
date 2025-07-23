import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Footer from "../Component/Footer";
import Navbar from "../Component/Navbar";
import NewsLetter from "../Component/NewsLetter";
import SingleOrderSection from "../Component/SingleOrderSection";
import { userRequest } from "../axiosReqMethods";
import ProductNotFound from "../Component/ProductNotFound";
import Announcments from "../Component/Announcments";

// Define the necessary types for orders
interface Product {
  _id: string;
  title: string;
  img: string;
  price: number;
  quantity: number;
  size: string;
  // Add other fields if needed
}

interface PaymentInfo {
  razorpay_payment_id: string;
  // Add other fields if needed
}

interface Order {
  _id: string;
  products: Product[];
  paymentInfo: PaymentInfo;
  createdAt: string;
  ExpectedDelevery: string;
  orderStatus: string;
  // Add more fields if SingleOrderSection needs them
}

// Define RootState interface for Redux
interface RootState {
  user: {
    currentUser: {
      _id: string;
      // Add more user fields as needed
    } | null;
  };
}

// Styled Components
const Container = styled.div<{ isOrders: boolean }>`
  width: 100%;
  background-color: ${(p) => (p.isOrders ? "#e0dede" : "white")};
  padding: 20px 0;
`;

const TopSection = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-left: 10px;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;

// Main Component
const OrdersPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const { data } = await userRequest.get<Order[]>(
          `/api/orders/find/${user._id}`
        );
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?._id]);

  return (
    <>
      <Announcments />
      <Navbar />
      <Container isOrders={orders.length > 0}>
        {loading ? (
          <ProductNotFound
            title="Loading..."
            desc="Fetching your orders, please wait."
          />
        ) : !orders.length ? (
          <ProductNotFound
            title="No Orders Found"
            desc="Sorry, it looks like you haven't placed any orders yet."
          />
        ) : (
          <div className="container">
            <TopSection>
              <Title>Your Orders</Title>
            </TopSection>
            <BottomSection>
              {orders.map((order) => (
                <SingleOrderSection key={order._id} order={order} />
              ))}
            </BottomSection>
          </div>
        )}
      </Container>
      <NewsLetter />
      <Footer />
    </>
  );
};

export default OrdersPage;
