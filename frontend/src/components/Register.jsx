import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";


function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const create = async (data) => {
    console.log(data);
    setError("");
    setLoading(true);
    console.log(data.avatar[0]);
    

    const formData = new FormData();
    formData.append("username", data.username); // other form data
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar && data.avatar[0]);

    try {
      const response = await fetch("http://localhost:5555/api/v1/users/register", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        console.log("success registration");
        enqueueSnackbar("Registration successfully", { variant: "success" });
        
        navigate("/login");
      } else {
        setError(result.message || "Registration failed");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong during registration");
      enqueueSnackbar("Error while doing registration", { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="flex items-center justify-center">
          <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
            <h2 className="text-center text-2xl font-bold leading-tight">
              Register to create an account
            </h2>
            <p className="mt-2 text-center text-base text-black/60">
              Already have an account?&nbsp;
              <Link
                to="/login"
                className="font-medium text-primary transition-all duration-200 hover:underline"
              >
                Log in
              </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

            <form onSubmit={handleSubmit(create)}>
              <div className="space-y-5">
                <Input
                  label="Username: "
                  placeholder="Enter your username"
                  {...register("username", {
                    required: true,
                  })}
                />
                <Input
                  label="Email: "
                  placeholder="Enter your email"
                  type="email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPattern: (value) =>
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
                <Input
                  label="Avatar: "
                  type="file"
                  placeholder="Upload your avatar"
                  {...register("avatar")}
                />
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <h1>Please wait while Registering...</h1>
      )}
    </>
  );
}

export default RegisterForm;
