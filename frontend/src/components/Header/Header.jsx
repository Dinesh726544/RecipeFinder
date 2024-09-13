import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {useSelector,useDispatch} from "react-redux"
import { logout } from "../../features/auth/authSlice.js"; 
import { toggleHistoryVisibility } from "../../features/visibility/visibilitySlice.js";

export default function Header() {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleHistoryVisibility());
  };

  const handleLogout = async() => {

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5555/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const result = await response.json();
      console.log(result);
      
    } catch (error) {
      console.error("Error:", error);
      setError("Recipe generation failed. Please try again.");
    }

    dispatch(logout());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "transparent", backdropFilter: "blur(10px)" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/">
            <button color="inherit">theCodeCrusaderX</button>
          </Link>

          <div>
            {!isAuthenticated ? (
              <>
                <Link to="/register">
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/history">
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                    onClick={handleToggle}
                  >
                    History
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    backgroundColor: "transparent",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "white",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
