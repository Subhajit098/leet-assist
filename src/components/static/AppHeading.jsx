import React from 'react'
import { AppBar, Toolbar, Typography } from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

export default function AppHeading() {
  return (
    <AppBar position="static"
        sx={{
            borderRadius: "8px 8px 0 0",
            width: "100%",
            boxShadow: "none"
        }}>
        <Toolbar variant="dense" sx={{ minHeight: 40, px: 1 }}>
            <RocketLaunchIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Leet Assist</Typography>
            
        </Toolbar>

    </AppBar>
  )
}
