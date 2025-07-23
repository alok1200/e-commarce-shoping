import Badge from "@mui/material/Badge";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, type ChangeEvent } from "react";
import styled from "styled-components";
import { mobile } from "../Responsive.js";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userRedux.js";
import { publicRequest, userRequest } from "../axiosReqMethods";
import { setProduct } from "../redux/cartRedux.js";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import type { RootState } from "../redux/store.js";

const link = {
  color: "black",
  textDecoration: "none",
};

const Container = styled.div`
  max-height: 60px;
  box-shadow: 0 3px 2px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 101;
  backdrop-filter: blur(16px);
`;

const Wrapper = styled.div`
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid gray;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  padding: 5px;
  border-radius: 0.5vmin;
  height: 25px;
  position: relative;
  ${mobile({ marginLeft: "0px" })}
`;

const Input = styled.input`
  outline: none;
  border: none;
  background-color: transparent !important;
  width: 100%;
`;

interface UlProps {
  isFocus: boolean;
}

const Ul = styled.ul<UlProps>`
  position: absolute;
  width: 100%;
  top: 105%;
  background-color: white;
  border-radius: 0 0 1vmax 1vmax;
  backdrop-filter: blur(16px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  padding: 0 0;
  overflow: hidden;
  display: ${(props) => (props.isFocus ? "block" : "none")};
`;

const Li = styled.li`
  list-style: none;
  text-align: start;
  padding: 5px 5px;
  width: 100%;
  cursor: pointer;
  :hover {
    background-color: #ededeb;
  }
  &:last-child {
    border-radius: 0 0 1vmax 1vmax;
  }
`;

const Center = styled.div`
  flex: 1;
  ${mobile({ flex: 2 })}
`;

const Logo = styled.h1`
  font-weight: bold;
  text-align: center;
  ${mobile({ textAlign: "start", fontSize: "1.5rem" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

interface DropdownListProps {
  open: boolean;
}

const DropdownList = styled.div<DropdownListProps>`
  display: ${(p) => (p.open ? "block" : "none")};
`;

const DropdownContainer = styled.div`
  background-color: #f5f5f5;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 110%;
  transform: translate(-35%);
  width: 150px;
  ::before {
    content: "";
    position: absolute;
    left: 50%;
    top: -6px;
    width: 10px;
    height: 10px;
    background-color: #f5f5f5;
    transform: rotate(45deg);
  }
`;

const Dropdown = styled.span`
  z-index: 2;
  padding: 10px 20px;
  background-color: inherit;
  color: black;
  display: flex;
  align-items: center;
  gap: 5px;
  &:hover {
    color: black;
    font-weight: 600;
  }
`;

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
  user-select: none;
`;

const Hello = styled.span`
  font-size: 15px;
  font-weight: 400;
`;

const Account = styled.span`
  font-weight: 600;
  position: relative;
  display: flex;
  align-items: center;
`;

const MenueItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  padding: 10px 0;
  ${mobile({ marginLeft: "0.6rem" })}
`;

// Type for search product
interface Product {
  _id: string;
  title: string;
}

interface ApiError {
  response?: {
    status?: number;
  };
}

function Navbar() {
  const redirect = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.currentUser);
  const cartSize = useSelector((state: RootState) => state.cart.quantity);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (!user) return;
    const fetchCartSize = async () => {
      const { data } = await userRequest.get("api/cart/size");
      dispatch(setProduct(data.size));
    };
    fetchCartSize();
  }, [dispatch, user]);

  const [searchProducts, setSearchProducts] = useState<Product[] | null>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [optionIsOpen, setOptionIsOpen] = useState(false);

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return setSearchProducts(null);

    try {
      const { data } = await publicRequest.get(
        `/api/products/search/${e.target.value}`
      );
      setSearchProducts(data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        setSearchProducts([{ _id: "404", title: "No Products Found" }]);
      } else {
        setSearchProducts([{ _id: "error", title: "Unable to find products" }]);
      }
    }
  };

  const handleClick = (id: string) => {
    redirect(`/product/${id}`);
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Logo>
            <Link onClick={() => redirect("/")} style={link} to="/">
              {process.env.REACT_APP_NAME}
            </Link>
          </Logo>
        </Left>
        <Center>
          <SearchContainer>
            <Input
              onFocus={() => setIsInputFocus(true)}
              onBlur={() => setIsInputFocus(false)}
              onChange={handleSearch}
              placeholder="Search"
            />
            <SearchIcon
              style={{ color: "grey", fontSize: 16, cursor: "pointer" }}
            />
            <Ul isFocus={isInputFocus}>
              {searchProducts?.map((p) => (
                <Li key={p._id} onMouseDown={() => handleClick(p._id)}>
                  {p.title}
                </Li>
              ))}
            </Ul>
          </SearchContainer>
        </Center>
        <Right>
          {!user ? (
            <>
              <MenueItem>
                <Link style={link} to="/signup">
                  Sign Up
                </Link>
              </MenueItem>
              <MenueItem>
                <Link style={link} to="/login">
                  Log In
                </Link>
              </MenueItem>
            </>
          ) : (
            <AccountContainer onClick={() => setOptionIsOpen(!optionIsOpen)}>
              <Hello>Hello, {user.firstName}</Hello>
              <Account>
                Account{" "}
                {optionIsOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Account>
              <DropdownList open={optionIsOpen}>
                <DropdownContainer onClick={(e) => e.stopPropagation()}>
                  <Dropdown onClick={() => redirect("/setting")}>
                    <SettingsIcon /> Setting
                  </Dropdown>
                  <Dropdown onClick={() => redirect("/orders")}>
                    <LocalMallIcon /> Orders
                  </Dropdown>
                  <Dropdown onClick={handleLogout}>
                    <LogoutIcon /> Logout
                  </Dropdown>
                </DropdownContainer>
              </DropdownList>
            </AccountContainer>
          )}
          <MenueItem title="Cart">
            {user && (
              <Badge
                overlap="rectangular"
                badgeContent={isNaN(cartSize) ? 1 : cartSize}
                color="primary"
              >
                <Link style={link} to="/cart">
                  <ShoppingCartOutlinedIcon />
                </Link>
              </Badge>
            )}
          </MenueItem>
        </Right>
      </Wrapper>
    </Container>
  );
}

export default Navbar;
