import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useState, useEffect, useRef, type MouseEvent } from "react";
import styled from "styled-components";
import Announcments from "../Component/Announcments.js";
import Footer from "../Component/Footer.js";
import Navbar from "../Component/Navbar.js";
import NewsLetter from "../Component/NewsLetter.js";
import { mobile } from "../Responsive.js";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRequest, userRequest } from "../axiosReqMethods.js";
import { addProduct } from "../redux/cartRedux.js";
import { useDispatch, useSelector } from "react-redux";
import addDynamicScript from "../helpers/addDynamicScript.js";
import Loading from "../Component/Loading.js";
import ReviewComp from "../Component/ReviewComp.js";
import WriteaReview from "../Component/WriteaReview.js";
import { setError } from "../redux/errorRedux.js";
import GetUserAddress from "../Component/GetUserAddress.js";
import { setAddress } from "../redux/userRedux.js";
import axios, { type CancelTokenSource } from "axios";
import type { RootState } from "../redux/store.js";

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${mobile({ padding: "10px", flexDirection: "column" })}
`;

const ImgContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  ${mobile({ padding: "0px 20px" })}
`;

const Image = styled.img`
  width: 90%;
  height: 80vh;
  object-fit: contain;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${mobile({ padding: "10px" })}
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 3rem;
  ${mobile({ fontSize: "2rem" })}
`;

const Dno = styled.p`
  font-size: 1.5rem;
  color: #666;
  ${mobile({ fontSize: "1rem" })}
`;

const Description = styled.p`
  margin: 20px 0px;
  font-size: 1.2rem;
  line-height: 1.5;
  color: #444;
  ${mobile({ fontSize: "0.9rem" })}
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 2.5rem;
  color: #333;
  ${mobile({ fontSize: "2rem" })}
`;

const Stock = styled.span<{ inStock: boolean }>`
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: ${({ inStock }) => (inStock ? "#4CAF50" : "#FF0000")};
  font-weight: 600;
  font-size: 1.1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  ${mobile({ flexDirection: "column" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  ${mobile({ marginRight: "0px", marginBottom: "10px" })}
`;

const FilterTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: 5px;
`;

const FilterColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin: 0px 5px;
  cursor: pointer;
  border: 2px solid transparent;
  &:hover {
    border: 2px solid black;
  }
`;

const FilterSize = styled.select`
  padding: 5px;
  margin-left: 10px;
  ${mobile({ marginLeft: "0px", marginBottom: "10px" })}
`;

const FilterSizeOption = styled.option``;

const CartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  ${mobile({ flexDirection: "column", gap: "10px" })}
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  ${mobile({ flexDirection: "column", alignItems: "flex-start" })}
`;

const ValueARButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  &:hover {
    background-color: #ddd;
  }
`;

const CartValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  ${mobile({ fontSize: "1rem" })}
`;

const PurchaeContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #f0c14b;
  color: white;
  cursor: pointer;
  font-weight: 600;
  border-radius: 5px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #ddb347;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    color: #666;
  }
`;

// Define product type
interface Product {
  _id: string;
  title: string;
  productno: string | number;
  desc?: string;
  price: number;
  quantity: number;
  img: string;
  color?: string[];
  size?: string[];
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

interface ProductPageProps {
  title?: string;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

// Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
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

// No need for a separate Razorpay interface here

const ProductPage: React.FC<ProductPageProps> = ({ title }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const [product, setProduct] = useState<Product | null>(null);
  const [ProductQuentity, setProductQuentity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize Color and size once product is fetched
  const [Color, setColor] = useState<string>("");
  const [size, setsize] = useState<string>("");

  // Modal states
  const [modalisOpen, setmodalIsOpen] = useState<boolean>(false);
  const [addmodalisOpen, setaddmodalIsOpen] = useState<boolean>(false);

  // Set document title
  useEffect(() => {
    document.title = `SatnamCreation - ${title}`;
  }, [title]);

  const ourRequest = useRef<CancelTokenSource | null>(null);

  // Fetch product data
  useEffect(() => {
    ourRequest.current = axios.CancelToken.source();

    const gatData = async () => {
      setIsLoading(true);
      try {
        const { data } = await publicRequest.get<Product>(
          `/api/products/info/${id}`,
          { cancelToken: ourRequest.current?.token }
        );
        setProduct(data);

        // Set default color and size on fetch success
        setColor(data.color?.[0] || "");
        setsize(data.size?.[0] || "");

        setIsLoading(false);
      } catch (error: unknown) {
        if (axios.isCancel(error)) return;
        const apiError = error as ApiError;
        if (apiError.response?.status === 404) navigate("/");
        dispatch(
          setError(apiError.response?.data?.message || "Error fetching product")
        );
        setIsLoading(false);
      }
    };

    gatData();

    return () => {
      ourRequest.current?.cancel();
      setProduct(null);
      setProductQuentity(1);
    };
  }, [id, dispatch, navigate]);

  // Handlers for quantity
  const HandlClick = (type: "inc" | "dec") => {
    if (type === "dec") {
      setProductQuentity((prev) => (prev > 1 ? prev - 1 : prev));
    }
    if (type === "inc" && product) {
      setProductQuentity((prev) => (prev < product.quantity ? prev + 1 : prev));
    }
  };

  // Redux selectors
  const user = useSelector((state: RootState) => state.user.currentUser);
  const userAddress = useSelector((state: RootState) => state.user.address);

  // Add to cart
  const handleSubClick = async () => {
    if (!user) {
      return navigate("/login");
    }
    try {
      const res = await userRequest.post("/api/cart", {
        products: [
          {
            productID: product?._id,
            quantity: ProductQuentity,
            color: Color || product?.color?.[0],
            size: size || product?.size?.[0],
          },
        ],
      });
      if (!res.data.productExisted) {
        dispatch(addProduct());
      }
      dispatch(setError(res?.data?.message));
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(apiError.response?.data?.message || "Error adding to cart")
      );
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    if (!user) {
      return navigate("/login");
    }

    if (!userAddress) {
      try {
        const { data } = await userRequest.get("/api/user/address");
        if (!data.ok) {
          return setaddmodalIsOpen(true);
        }
        dispatch(setAddress(data.address));
      } catch {
        setaddmodalIsOpen(true);
        return;
      }
    }

    if (!window.Razorpay) {
      await addDynamicScript("https://checkout.razorpay.com/v1/checkout.js");
    }

    if (!window.Razorpay) {
      return dispatch(setError("Payment gateway failed to load."));
    }

    try {
      const { data } = await userRequest.post("/api/buy/checkout", {
        user: user._id,
        product: {
          productID: product?._id,
          quantity: ProductQuentity,
          size,
          color: Color,
        },
        type: "product",
        userInfo: {
          address: userAddress || "",
          name: `${user.firstName || "User"} ${user.lastName || ""}`,
          email: user.email || "",
          number: user.number,
        },
      });

      const Dborder = data.order;
      const { data: keyData } = await userRequest.get("/api/buy/getkey");
      const Dbkey = keyData.key;

      const options: RazorpayOptions = {
        key: Dbkey,
        amount: Dborder.amount,
        currency: "INR",
        name: product?.title || "Product",
        description: product?.desc
          ? product.desc.slice(0, 252) + "..."
          : "No description",
        image: product?.img || "",
        order_id: Dborder.id,
        callback_url: "http://localhost:4000/api/buy/paymentVerify",
        prefill: {
          name: `${user.firstName || "User"} ${user.lastName || ""}`,
          email: user.email || "",
          contact: user.number || "",
        },
        notes: {
          address: "Dummy Office address",
        },
        theme: {
          color: "#40a0a0",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      dispatch(
        setError(apiError.response?.data?.message || "Error creating order")
      );
    }
  };

  // Image zoom effect handlers
  const img = useRef<HTMLImageElement | null>(null);

  const handleImgMouseEnter = (e: MouseEvent<HTMLImageElement>) => {
    if (!img.current) return;
    const x = e.clientX - e.currentTarget.offsetLeft;
    const y = e.clientY - e.currentTarget.offsetTop;
    img.current.style.transformOrigin = `${x}px ${y}px`;
    img.current.style.transform = "scale(2)";
  };

  const hadleImgMouseLeave = () => {
    if (!img.current) return;
    img.current.style.transformOrigin = `center`;
    img.current.style.transform = "scale(1)";
  };

  return (
    <>
      <Announcments />
      <Navbar />
      {isLoading ? (
        <Loading />
      ) : product ? (
        <>
          <Wrapper>
            <ImgContainer>
              <Image
                src={product.img}
                onMouseMove={handleImgMouseEnter}
                ref={img}
                onMouseLeave={hadleImgMouseLeave}
                alt={product.title}
              />
            </ImgContainer>
            <InfoContainer>
              <TitleContainer>
                <Title>{product.title}</Title>
                <Dno>Design No - {product.productno}</Dno>
              </TitleContainer>
              <Description>
                {product.desc
                  ? product.desc
                  : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora sint accusamus explicabo in natus dolor maiores voluptate labore adipisci!`}
              </Description>
              <Price>₹{product.price}</Price>
              {product.quantity <= 5 && (
                <Stock inStock={product.quantity >= 1}>
                  {product.quantity >= 1
                    ? `Only ${product.quantity} left in stock`
                    : "Currently unavailable"}
                </Stock>
              )}
              <FilterContainer>
                <Filter>
                  <FilterTitle>Color</FilterTitle>
                  {(product.color || []).map((c) => (
                    <FilterColor
                      color={c}
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        border: Color === c ? "2px solid black" : "none",
                      }}
                    />
                  ))}
                </Filter>
                <Filter>
                  <FilterTitle>Size</FilterTitle>
                  <FilterSize
                    value={size}
                    onChange={(e) => setsize(e.target.value)}
                  >
                    {(product.size || []).map((s) => (
                      <FilterSizeOption key={s}>{s}</FilterSizeOption>
                    ))}
                  </FilterSize>
                </Filter>
              </FilterContainer>
              <CartContainer>
                <ValueContainer>
                  <ValueARButton>
                    <RemoveIcon onClick={() => HandlClick("dec")} />
                  </ValueARButton>
                  <CartValue>{ProductQuentity}</CartValue>
                  <ValueARButton>
                    <AddIcon onClick={() => HandlClick("inc")} />
                  </ValueARButton>
                </ValueContainer>
                <PurchaeContainer>
                  <Button
                    onClick={handleSubClick}
                    disabled={product.quantity < 1}
                  >
                    Add To Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    disabled={product.quantity < 1}
                  >
                    Buy Now
                  </Button>
                </PurchaeContainer>
              </CartContainer>
            </InfoContainer>
          </Wrapper>
          <WriteaReview
            product={product}
            setModal={setmodalIsOpen}
            isOpen={modalisOpen}
          />
          <GetUserAddress
            setModal={setaddmodalIsOpen}
            isOpen={addmodalisOpen}
          />
          <ReviewComp
            productID={product._id}
            productName={product.title}
            rating={product.ratingsAverage || 0}
            ratingCount={product.ratingsQuantity || 0}
            setModal={setmodalIsOpen}
          />
        </>
      ) : null}
      <NewsLetter />
      <Footer />
    </>
  );
};

export default ProductPage;
