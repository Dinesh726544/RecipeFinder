import React, { useState } from "react";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";

function DeleteAllHistory() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = () => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);

    axios
      .delete(
        `https://recipefinder-uch2.onrender.com/api/v1/prompt/deleteAllPromptHistory`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        enqueueSnackbar("all history deleted successfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div>
      <div className="p-4 h-screen flex flex-col justify-center items-center">
        {!loading ? (
          <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[300px] md:w-[600px] p-8 mx-auto">
            <h3 className="text-2xl text-white">
              Are You really want to delete all history?
            </h3>

            <button
              className="p-4 bg-red-600 text-white m-8 w-full"
              onClick={handleDelete}
            >
              Yes, delete
            </button>
            <button
              className="p-4 bg-green-600 text-white w-full"
              onClick={() => navigate("/history")}
            >
              NO
            </button>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}

export default DeleteAllHistory;
