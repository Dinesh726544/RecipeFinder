import React, { useState } from "react";
import Container from "../Container/Container";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../index";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
  console.log("Current user data:", userData);

  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    console.log(data);
    setError("");
    const concatenatedString = `
  Ingredients: ${data.Ingredients}, 
  Meal Type: ${data["Meal Type"]}, 
  Cuisine Preference: ${data["Cuisine Preference"]}, 
  Cooking Time: ${data["Cooking Time"]}, 
  Complexity: ${data.Complexity}
`.trim();
console.log("concatenatedString ::",concatenatedString);


    try {
      const response = await fetch("http://localhost:5555/api/v1/prompt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(
          //   {
          //   Ingredients: data.Ingredients,
          //   "Meal Type": data["Meal Type"],
          //   "Cuisine Preference": data["Cuisine Preference"],
          //   "Cooking Time" : data["Cooking Time"],
          //   Complexity : data.Complexity
          // }
          {
            prompt: concatenatedString,
          }
        ),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      console.log(result);

      navigate("/");
      // Handle success (e.g., navigate to another page)
      navigate("/dashboard"); // Example of navigation after login
    } catch (error) {
      console.error("Error:", error);
      setError("Login failed. Please try again.");
    }
  };
  return (
    <Container>
      <div>
        <div className="md:flex items-center justify-center w-full">
          {/* input Recipe */}
          <div
            className={`mx-auto w-full max-w-sm bg-gray-100 rounded-xl p-10 border border-black/10`}
          >
            <h2 className="text-center text-2xl font-bold leading-tight">
              Generate Your Recipe
            </h2>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(login)} className="mt-8">
              <div className="space-y-5">
                <Input
                  label="Ingredients"
                  placeholder="Enter ingredients"
                  {...register("Ingredients", {
                    required: true,
                  })}
                />
                <Input
                  label="Meal Type"
                  placeholder="Enter meal type"
                  {...register("Meal Type", {
                    required: true,
                  })}
                />
                <Input
                  label="Cuisine Preference"
                  placeholder="i.e., Italian,Mexican..."
                  {...register("Cuisine Preference", {
                    required: true,
                  })}
                />
                <Input
                  label="Cooking Time"
                  placeholder="i.e., 30 minutes"
                  {...register("Cooking Time", {
                    required: true,
                  })}
                />
                <Input
                  label="Complexity"
                  placeholder="i.e., beginner,intermediate,advance"
                  {...register("Complexity", {
                    required: true,
                  })}
                />

                <Button type="submit" className="w-full">
                  Generate Recipe
                </Button>
              </div>
            </form>
          </div>
          {/* outPut Recipe */}
          <div
            className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 md:max-h-[600px] h-[400px] overflow-y-auto mt-[20px] mb-[20px] md:mt-0 md:mb-0`}
          >
            <h2 className="text-center text-2xl font-bold leading-tight mb-[8px]">
              Here is the Recipe!!
            </h2>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
