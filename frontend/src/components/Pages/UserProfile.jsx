import React, { useState, useEffect } from "react";
import { Drawer, Box, IconButton, Divider, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Input from "../Input";
import Spinner from "../Spinner";

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      setLoading(true);

      try {
        const res = await axios.get(`http://localhost:5555/api/v1/users/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setUsername(res.data.data.username);
        setEmail(res.data.data.email);
        setAvatar(res.data.data.avatar);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const create = async (data) => {
    console.log(data);
    setError("");
    setLoading(true);

    if (!data.Updateavatar || !data.Updateavatar[0]) {
      setError("No avatar file selected");
      enqueueSnackbar("No avatar file selected", { variant: "warning" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("Updateavatar", data.Updateavatar[0]);

    try {
      const token = localStorage.getItem("accessToken");
      setLoading(true);
      const response = await fetch(
        "http://localhost:5555/api/v1/users/update-profile-avatar",
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        setAvatar(result.data.avatar);
        console.log("Avatar updated successfully");
        enqueueSnackbar("Avatar updated successfully", { variant: "success" });
      } else {
        setLoading(false);

        setError(result.message || "Avatar update failed");
        enqueueSnackbar(result.message || "Avatar update failed", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong while updating Avatar");
      enqueueSnackbar("Error while updating Avatar", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h1 className="h-screen flex justify-center items-center">
        <Spinner></Spinner>
      </h1>
    );
  }

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        background: "linear-gradient(to bottom, #1c1c1c, #0c0c0c)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center"
        style={{ maxWidth: "400px", textAlign: "center" }}
      >
        <h2 className="text-3xl font-bold mb-4">{username}</h2>
        <p className="text-gray-400 mb-4">{email}</p>
        {avatar && (
          <img
            src={avatar}
            alt="User avatar"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          />
        )}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="Update Avatar: "
              type="file"
              placeholder="Update your avatar"
              {...register("Updateavatar")}
            />
            <Button type="submit" className="w-full">
              update avatar
            </Button>
          </div>
        </form>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        {/* Buttons */}
        <div className="mt-6 space-y-4">
          <Link to="/dashboard">
            <Button
              sx={{
                color: "white",
                margin: "10px",
                backgroundColor: "#2e2e2e",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#f1f1f1",
                },
              }}
              fullWidth
            >
              Dashboard
            </Button>
          </Link>

          <Link to="/history">
            <Button
              sx={{
                color: "white",
                margin: "10px",

                backgroundColor: "#2e2e2e",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#f1f1f1",
                },
              }}
              fullWidth
            >
              History
            </Button>
          </Link>

          <Link to="/logout">
            <Button
              sx={{
                margin: "10px",
                color: "white",
                backgroundColor: "#2e2e2e",
                "&:hover": {
                  color: "black",
                  backgroundColor: "#f1f1f1",
                },
              }}
              fullWidth
            >
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Drawer for mobile */}
      <div className="md:hidden absolute top-4 right-4">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </div>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{ width: 250 }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div
          className="flex flex-col h-full w-full p-4 bg-gray-800"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Menu</h2>
          <Divider
            sx={{
              borderBottomWidth: 3,
              borderColor: "white",
              fontWeight: "bold",
            }}
          />
          <nav className="space-y-4 flex flex-col mt-6">
            <Link
              to="/dashboard"
              className="block text-xl text-white hover:bg-gray-700 rounded-full py-2 px-4 text-center"
            >
              Dashboard
            </Link>

            <Link
              to="/history"
              className="block text-xl text-white hover:bg-gray-700 rounded-full py-2 px-4 text-center"
            >
              History
            </Link>

            <Link
              to="/logout"
              className="block text-xl text-white hover:bg-gray-700 rounded-full py-2 px-4 text-center"
            >
              Logout
            </Link>
          </nav>
        </div>
      </Drawer>
    </div>
  );
}

export default UserProfile;
