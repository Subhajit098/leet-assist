import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../styles/HintPagination.css"
import { Typography, Box } from "@mui/material";

export default function HintPagination(props) {
  const [page, setPage] = useState(1); // current page (1-indexed)
  const hintsPerPage = 1;

  const handleChange = (event, value) => {
    setPage(value);
  };

  // get the current hint
  const currentHint = props.data.slice(page - 1, page - 1 + hintsPerPage);

  return (
    <div className="hintParent">
      <Typography variant="subtitle1" fontWeight="bold" p={2}>
        💡 Hints : 
      </Typography>

    <div className="hintChild">
      {currentHint.map((hint, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            💡 Hint - {index + 1}
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {hint}
          </Typography>
        </Box>
      ))}
    </div>


      <Stack spacing={2} alignItems="center">
        <Pagination
          count={props.data.length} // total number of pages = number of hints
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
