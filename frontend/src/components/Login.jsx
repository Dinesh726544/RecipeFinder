import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../features/auth/authSlice.js";
import { Button, Input} from "./index";
import {useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    // console.log(data);
    setError("");
    
      try {
        const response = await fetch('http://localhost:5555/api/v1/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Login failed");
        }
    
        const result = await response.json();
        // console.log(result);
        console.log(response);
        
        if (data) dispatch(authLogin(data));

        navigate("/dashboard");
        // Handle success (e.g., navigate to another page)
        navigate("/dashboard"); // Example of navigation after login
      } catch (error) {
        console.error('Error:', error);
        setError("Login failed. Please try again.");
      }

  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
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
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
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
  );
}

export default LoginForm;
