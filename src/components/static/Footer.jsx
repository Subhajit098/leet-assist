import React from 'react'
import { Typography, Box } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ mt: "auto", textAlign: "center", p: 1 }}>
        <Typography variant="caption" color="text.secondary">
            Made with ❤️ for LeetCode practice
        </Typography>
    </Box>
  )
}
