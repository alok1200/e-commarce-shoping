import React from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

interface PaymentSuccessProps {
  title?: string;
}

const Div = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const PaymentSuccess: React.FC<PaymentSuccessProps> = () => {
  const [query] = useSearchParams();
  const refID = query.get("refrence") ?? "N/A"; // fallback if param missing

  return (
    <Div>
      <h1>Payment Successful</h1>
      <p>ref_id: {refID}</p>
    </Div>
  );
};

export default PaymentSuccess;
