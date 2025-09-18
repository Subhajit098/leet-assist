import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "../styles/HintPagination.css"

export default function HintPagination(props) {
  const [page, setPage] = useState(1); // current page (1-indexed)
  const hintsPerPage = 1;

  const handleChange = (event, value) => {
    setPage(value);
  };

  // get the current hint
  const currentHint = props.data.slice(page - 1, page - 1 + hintsPerPage);

  return (
    <div className="parentBody">
      <h2>💡 Hint {page}</h2>

      <div className="childBody">
        {currentHint.map((hint, index) => (
          <p key={index}>{hint}</p>
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
