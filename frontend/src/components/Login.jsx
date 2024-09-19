import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../features/auth/authSlice.js";
import { Button, Input } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data) => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://recipefinder-backend-7e25.onrender.com/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for CORS with cookies
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const result = await response.json();

      // Saving accessToken in localStorage
      localStorage.setItem("accessToken", result.data.accessToken);

      // Updating the store with logged-in user data
      if (result.data) dispatch(authLogin(result.data));

      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="flex items-center justify-center w-full">
          <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
            <h2 className="text-center text-2xl font-bold leading-tight">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-base text-black/60">
              Don&apos;t have an account?&nbsp;
              <Link
                to="/register"
                className="font-medium text-primary transition-all duration-200 hover:underline"
              >
                Register
              </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)} className="mt-8">
              <div className="space-y-5">
                <Input
                  label="Email: "
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                          value
                        ) || "Email address must be a valid address",
                    },
                  })}
                />
                <Input
                  label="Password: "
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: true,
                  })}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <h1 className="text-white">Loading...</h1>
      )}
    </>
  );
}

export default LoginForm;
