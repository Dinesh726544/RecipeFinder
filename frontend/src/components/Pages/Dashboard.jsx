import React, { useState } from "react";
import Container from "../Container/Container";
import { Button, Input } from "../index";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitization
import LoadingAnimation from "../LoadingAnimation";

function Dashboard() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState(""); // State to store the recipe
  const [loading, setLoading] = useState(false);

  const generateRecipe = async (data) => {
    setLoading(true);
    setError("");
    const concatenatedString = `
      Ingredients: ${data.Ingredients}, 
      Meal Type: ${data["Meal Type"]}, 
      Cuisine Preference: ${data["Cuisine Preference"]}, 
      Cooking Time: ${data["Cooking Time"]}, 
      Complexity: ${data.Complexity}
    `.trim();

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("https://recipefinder-uch2.onrender.com/api/v1/prompt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: concatenatedString }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const result = await response.json();

      setLoading(false);
      setRecipe(result.data); // Set the response data (formatted HTML) to state
    } catch (error) {
      console.error("Error:", error);
      setError("Recipe generation failed. Please try again.");
    }
  };

  // Function to safely render HTML by sanitizing it
  const createMarkup = (htmlString) => {
    return { __html: DOMPurify.sanitize(htmlString) }; // Sanitize HTML before rendering
  };

  return (
    <Container>
      <div className="md:h-screen mt-[120px]">
        <div className="md:flex items-center justify-center w-full">
          {/* Input Recipe */}
          <div className="mx-auto w-full max-w-sm bg-gray-100 rounded-xl p-10 border border-black/10">
            <h2 className="text-center text-2xl font-bold leading-tight">
              Generate Your Recipe
            </h2>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <form onSubmit={handleSubmit(generateRecipe)} className="mt-8">
              <div className="space-y-5">
                <Input
                  label="Ingredients"
                  placeholder="Enter ingredients"
                  {...register("Ingredients", { required: true })}
                />
                <Input
                  label="Meal Type"
                  placeholder="Enter meal type"
                  {...register("Meal Type", { required: true })}
                />
                <Input
                  label="Cuisine Preference"
                  placeholder="i.e., Italian,Mexican..."
                  {...register("Cuisine Preference", { required: true })}
                />
                <Input
                  label="Cooking Time"
                  placeholder="i.e., 30 minutes"
                  {...register("Cooking Time", { required: true })}
                />
                <Input
                  label="Complexity"
                  placeholder="i.e., beginner, intermediate, advance"
                  {...register("Complexity", { required: true })}
                />
                <Button type="submit" className="w-full">
                  Generate Recipe
                </Button>
              </div>
            </form>
          </div>

          {/* Output Recipe */}
          <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 md:max-h-[600px] h-[400px] overflow-y-auto mt-[20px] mb-[20px] md:mt-0 md:mb-0 ">
            <h2 className="text-center text-2xl font-bold leading-tight mb-[8px]">
              Here is the Recipe!!
            </h2>
            {loading ? (
              <p>
                <LoadingAnimation />
              </p> // Display loading message
            ) : recipe ? (
              <div
                dangerouslySetInnerHTML={createMarkup(recipe)} // Safely render HTML
              />
            ) : (
              <p className="text-center">No recipe generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Dashboard;
