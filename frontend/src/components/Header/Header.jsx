import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Drawer } from "@mui/material";
import Divider from "@mui/material/Divider";

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
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "black" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Link to="/">
              <button color="inherit">theCodeCrusaderX</button>
            </Link>
          </div>

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
                {/* Desktop buttons */}
                <Box
                  sx={{
                    display: { xs: "none", md: "block" }, // Hide on small screens
                  }}
                >
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
                    >
                      History
                    </Button>
                  </Link>

                  <Link to="/logout">
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
                      Logout
                    </Button>
                  </Link>
                </Box>

                <div className="md:hidden">
                  {/* Button to open the menu */}
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>

                  {/* Drawer with slide-in animation */}
                  <Drawer
                    anchor="right" // Slide-in from the right side
                    open={isOpen}
                    onClose={toggleDrawer(false)}
                    sx={{ width: 250 }} 
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    {/* The content of the Drawer */}
                    <div
                      className="flex flex-col h-full w-full p-4 bg-green-800"
                      onClick={toggleDrawer(false)}
                      onKeyDown={toggleDrawer(false)}
                    >
                      <h2 className="text-2xl font-bold mb-4 text-white">
                        Menu
                      </h2>
                      <Divider
                        sx={{
                          borderBottomWidth: 3,
                          borderColor: "black",
                          fontWeight: "bold",
                        }}
                      />
                      <nav className="space-y-4 flex flex-col">
                        <Link
                          to="/dashboard"
                          className="block text-xl hover:bg-black text-white font-bold py-2 px-4 rounded-full border border-white text-center mt-4"
                        >
                          <button>Dashboard</button>
                        </Link>

                        <Link
                          to="/history"
                          className="block text-xl hover:bg-black text-white font-bold py-2 px-4 rounded-full border border-white text-center"
                        >
                          <button>History</button>
                        </Link>

                        <Link to="/logout">
                          <button
                            className="block text-xl hover:bg-black text-white font-bold py-2 px-4 rounded-full hover:text-red-500 border border-white text-center"
                          >
                            Logout
                          </button>
                        </Link>
                      </nav>
                    </div>
                  </Drawer>
                </div>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
