import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // moon icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // sun icon
import "../../styles/DarkModeToggle.css";

export default function DarkModeToggle() {
  const [mode, setMode] = useState("light");

  const theme = createTheme({
    palette: {
      mode: mode,
      ...(mode === "dark" && {
        background: {
          default: "#2e2e2e", // soft ash/dark gray
          paper: "#383838",
        },
        text: {
          primary: "#ffffff",
          secondary: "#cfcfcf",
        },
      }),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="container">
        <IconButton
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          color="inherit"
        >
          {/* Show opposite icon to indicate what will happen */}
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </div>
    </ThemeProvider>
  );
}
