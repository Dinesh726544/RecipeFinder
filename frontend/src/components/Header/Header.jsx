import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import { useState } from "react";
import { Divider } from "@mui/material";

export default function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "black" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Link to="/">
              <button color="inherit" style={{ color: "white", fontSize: "1.2rem" }}>theCodeCrusaderX</button>
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
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
                <Link to="/user-profile">
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      marginRight: "1rem",  // Add space between profile button and menu
                      "&:hover": {
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                  >
                    Profile
                  </Button>
                </Link>

                {/* Drawer for mobile */}
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{
                    "&:hover": {
                      color: "black",
                      backgroundColor: "white",
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

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
    </Box>
  );
}
