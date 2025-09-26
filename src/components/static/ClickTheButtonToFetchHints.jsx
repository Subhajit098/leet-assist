import React from 'react'
import { Typography} from "@mui/material";
import "../../styles/ClickTheButtonToFetchHints.css";


export default function ClickTheButtonToFetchHints() {
  return (
    <Typography
        variant="body1"
        align="center"
        sx={{
        fontWeight: "bold",
        color: "primary.main",
        mt: 2,
        animation: "pulse 1.5s infinite",
        }}
    >
        👉 Click the button above to fetch hints!
    </Typography>
  )
}
