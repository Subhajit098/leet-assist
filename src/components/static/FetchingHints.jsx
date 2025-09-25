import React from 'react'
import { Typography} from "@mui/material";
import "../../styles/FetchingHints.css"

export default function FetchingHints() {
  return (
    <Typography
        variant="body2"
        align="center"
        sx={{
        mt: 2,
        fontWeight: "bold",
        color: "primary.main",
        "&::after": {
            content: '"..."',
            animation: "dots 1.5s steps(3, end) infinite",
        },
        }}
    >
        Fetching hints
    </Typography>
  )
}
