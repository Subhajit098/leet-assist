import React from 'react'
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function ErrorAlert(props) {
  return (
    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
    <AlertTitle>Error</AlertTitle>
    {props.data || "Something went wrong while fetching hints. Please try again."}
    </Alert>
  )
}
