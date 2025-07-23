import {
  Start,
  loginSucces,
  Failed,
  signUpSucces,
  signupFailed,
  resetError,
} from "./userRedux.js";
import { publicRequest } from "../axiosReqMethods";
import { setError } from "./errorRedux.js";
import type { Dispatch } from "redux";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface LoginUser {
  email: string;
  password: string;
  ip?: string;
}

interface SignUpUser {
  email: string;
  password: string;
  // add other signup fields if any
  [key: string]: string | number | boolean;
}

// login action
export const login = async (
  dispatch: Dispatch,
  user: LoginUser
): Promise<void> => {
  const { email, password, ip } = user;
  console.log(ip);
  dispatch(Start());
  try {
    const res = await publicRequest.post("api/auth/login", { email, password });
    console.log(user);
    dispatch(loginSucces(res.data));
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || "Login failed";
    dispatch(Failed(errorMessage));
    dispatch(setError(errorMessage));

    setTimeout(() => {
      dispatch(resetError());
    }, 5000);
  }
};

// signup action
export const signUp = async (
  dispatch: Dispatch,
  user: SignUpUser
): Promise<void> => {
  dispatch(Start());
  try {
    const res = await publicRequest.post("api/auth/register", user);
    dispatch(signUpSucces(res.data));
  } catch (error: unknown) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.message || "Signup failed";
    dispatch(signupFailed(errorMessage));
    dispatch(setError(errorMessage));

    setTimeout(() => {
      dispatch(resetError());
    }, 5000);
  }
};
