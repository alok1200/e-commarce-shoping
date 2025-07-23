import React, { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import styled from "styled-components";
import NewsLetter from "../Component/NewsLetter";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearIcon from "@mui/icons-material/Clear";
import { mobile } from "../Responsive.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../axiosReqMethods";
import { deleteProduct } from "../redux/cartRedux.js";
import addDynamicScript from "../helpers/addDynamicScript.js";
import { setError } from "../redux/errorRedux.js";
import Loading from "../Component/Loading";
import { setAddress } from "../redux/userRedux.js";
import type { RootState } from "../redux/store.js";

const Container = styled.div``;
const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button<{ type?: string }>`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
  margin-bottom: 20px;
  position: relative;
`;

const ProductDeteail = styled.div`
  flex: 2;
  display: flex;
  cursor: pointer;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductNumber = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 1px solid gray;
`;

const ProductSize = styled.span``;

const PriceDeteail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div<{ type?: string }>`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryText = styled.span``;

const SummaryPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const ButtonWrapper = styled.div``;
const ValueARButton = styled.div`
  cursor: pointer;
`;
const DelButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
`;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ProductType {
  _id: string;
  productID: string;
  img: string;
  title: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface CartResponse {
  products: ProductType[];
}

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  number?: string;
  avatar?: string;
}

interface CartPageProps {
  title: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  callback_url: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

interface Razorpay {
  new (options: RazorpayOptions): {
    open(): void;
  };
}

declare global {
  interface Window {
    Razorpay?: Razorpay;
  }
}

const CartPage: React.FC<CartPageProps> = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartProductRes, setCartProductRes] = useState<CartResponse | null>(
    null
  );
  const [fetchCartLoading, setFetchCartLoading] = useState<boolean>(false);
  const [totalCartPrice, setTotalCartPrice] = useState<number>(0);
  const [isCheckoutLoading, setischeckoutLoading] = useState<boolean>(false);

  const user = useSelector(
    (state: RootState) => state?.user?.currentUser
  ) as UserType | null;
  const userAddress = useSelector((state: RootState) => state.user.address);

  useEffect(() => {
    document.title = `SatnamCreation - ${props.title}`;
  }, [props.title]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          setFetchCartLoading(true);
          const res = await userRequest.get<CartResponse>(
            `/api/cart/info/${user._id}`
          );
          setCartProductRes(res.data);
          setFetchCartLoading(false);
        } catch (err: unknown) {
          const apiError = err as ApiError;
          setFetchCartLoading(false);
          dispatch(
            setError(
              apiError?.response?.data?.message || "Failed to fetch cart"
            )
          );
        }
      }
    };
    fetchCart();

    return () => {
      setCartProductRes(null);
    };
  }, [user, dispatch]);

  useEffect(() => {
    if (cartProductRes?.products) {
      const total = cartProductRes.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotalCartPrice(total);
    } else {
      setTotalCartPrice(0);
    }
  }, [cartProductRes]);

  const handleDeleteProduct = async (id: string) => {
    try {
      const filteredProducts =
        cartProductRes?.products.filter((p) => p.productID !== id) || [];
      setCartProductRes((prev) =>
        prev ? { ...prev, products: filteredProducts } : prev
      );
      dispatch(deleteProduct());
      const res = await userRequest.delete(`/api/cart/${id}`);
      dispatch(setError(res.data.message));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(
          apiError?.response?.data?.message || "Failed to delete product"
        )
      );
    }
  };

  const handleProductQuantityChange = async (
    productID: string,
    quantity: number
  ) => {
    if (quantity === 0) return handleDeleteProduct(productID);
    try {
      const res = await userRequest.put(
        `/api/cart/updatequantity/${productID}/${quantity}`
      );
      if (!cartProductRes) return;
      const updatedProducts = cartProductRes.products.map((p) =>
        p.productID === productID ? { ...p, quantity } : p
      );
      setCartProductRes({ ...cartProductRes, products: updatedProducts });
      dispatch(setError(res.data.message));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(
          apiError?.response?.data?.message || "Failed to update quantity"
        )
      );
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      return navigate("/login");
    }

    if (!userAddress) {
      try {
        const { data } = await userRequest.get("/api/user/address");
        if (!data.ok) {
          // You might want to open a modal here to add an address
          // For now, I'll just log an error
          console.error("User address not found, and could not fetch it.");
          return;
        }
        dispatch(setAddress(data.address));
      } catch {
        console.error("Failed to fetch user address.");
        return;
      }
    }

    setischeckoutLoading(true);

    if (!window.Razorpay) {
      await addDynamicScript("https://checkout.razorpay.com/v1/checkout.js");
    }

    if (!window.Razorpay) {
      setischeckoutLoading(false);
      return dispatch(setError("Could not load payment gateway."));
    }

    try {
      const {
        data: { order },
      } = await userRequest.post("/api/buy/checkout", {
        user: user._id,
        type: "cart",
        userInfo: {
          address: userAddress,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      });

      const {
        data: { key },
      } = await userRequest.get("/api/buy/getkey");

      setischeckoutLoading(false);

      if (!order || !key) {
        return dispatch(setError("Error occurred while creating order"));
      }

      const options: RazorpayOptions = {
        key,
        amount: order.ammount,
        currency: "INR",
        name: `${user.firstName} ${user.lastName}'s Cart`,
        description: `${user.firstName} ${user.lastName}'s Cart includes total ${cartProductRes?.products.length}`,
        image:
          "https://toppng.com/uploads/preview/astronaut-art-png-jpg-royalty-free-stock-astronauta-dibujo-11562856188offwkk8qo8.png",
        order_id: order.id,
        callback_url: "http://localhost:4000/api/buy/paymentVerify",
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.number || "",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#40a0a0",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      setCartProductRes(null);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setischeckoutLoading(false);
      dispatch(
        setError(apiError?.response?.data?.message || "Checkout failed")
      );
    }
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>Cart</Title>
        {fetchCartLoading ? (
          <Loading />
        ) : cartProductRes?.products?.length ? (
          <>
            <Top>
              <TopButton onClick={() => navigate(-1)}>
                Continue Shopping
              </TopButton>
              <TopTexts>
                <TopText>Shopping bag</TopText>
                <TopText>Your Wishlist</TopText>
              </TopTexts>
              <TopButton
                type="filled"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                CheckOut Now
              </TopButton>
            </Top>
            <Bottom>
              <Info>
                {cartProductRes.products.map((product) => (
                  <Product key={product.productID}>
                    <DelButton
                      onClick={() => handleDeleteProduct(product.productID)}
                    >
                      <ClearIcon
                        style={{ fontSize: "40px", color: "#AB2A28" }}
                      />
                    </DelButton>
                    <ProductDeteail
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <Image src={product.img} />
                      <Details>
                        <ProductName>
                          <b>Product:</b> {product.title}
                        </ProductName>
                        <ProductNumber>
                          <b>ID:</b> {product.productID}
                        </ProductNumber>
                        <ProductColor color={product.color} />
                        <ProductSize>
                          <b>Size:</b> {product.size}
                        </ProductSize>
                      </Details>
                    </ProductDeteail>
                    <PriceDeteail>
                      <ProductAmmountContainer>
                        <ValueARButton
                          onClick={() =>
                            handleProductQuantityChange(
                              product.productID,
                              product.quantity - 1
                            )
                          }
                        >
                          <RemoveIcon />
                        </ValueARButton>
                        <ProductAmmount>{product.quantity}</ProductAmmount>
                        <ValueARButton
                          onClick={() =>
                            handleProductQuantityChange(
                              product.productID,
                              product.quantity + 1
                            )
                          }
                        >
                          <AddIcon />
                        </ValueARButton>
                      </ProductAmmountContainer>
                      <ProductPrice>{product.price}</ProductPrice>
                    </PriceDeteail>
                  </Product>
                ))}
                <Hr />
              </Info>
              <Summary>
                <SummaryTitle>Products</SummaryTitle>
                {cartProductRes.products.map((product) => (
                  <SummaryItem key={product._id}>
                    <SummaryText>{product.title}</SummaryText>
                    <SummaryPrice>
                      {(product.price * product.quantity).toFixed(2)}
                    </SummaryPrice>
                  </SummaryItem>
                ))}
                <SummaryItem type="total">
                  <SummaryText>Total</SummaryText>
                  <SummaryPrice>{totalCartPrice.toFixed(2)}</SummaryPrice>
                </SummaryItem>
                <ButtonWrapper>
                  <Button onClick={handleCheckout} disabled={isCheckoutLoading}>
                    Check out
                  </Button>
                </ButtonWrapper>
              </Summary>
            </Bottom>
          </>
        ) : (
          <div>Empty Cart</div>
        )}
      </Wrapper>
      <NewsLetter />
    </Container>
  );
};

export default CartPage;
