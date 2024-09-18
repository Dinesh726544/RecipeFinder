import React, { useState } from "react";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useSnackbar } from "notistack";
import axios from "axios";

function Logout() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const token = localStorage.getItem("accessToken");
    setLoading(true);

    axios
      .post(
        `https://recipefinder-backend-7e25.onrender.com/api/v1/users/logout`,
        {}, // An empty object here to indicate no data in the POST request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Logout successfully", { variant: "success" });
        dispatch(logout());
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
              Are You really want to logout?
            </h3>

            <button
              className="p-4 bg-red-600 text-white m-8 w-full"
              onClick={handleLogout}
            >
              Yes, Logout
            </button>
            <button
              className="p-4 bg-green-600 text-white w-full"
              onClick={() => navigate("/")}
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

export default Logout;
