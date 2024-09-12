import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export default function Header() {
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
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
