import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import Container from "../Container/Container.jsx";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { MdOutlineDeleteForever } from "react-icons/md";

function History() {
  const [historyResult, setHistoryResult] = useState([]); // State for fetched data
  const [error, setError] = useState(null); // State for error handling
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const [query, setQuery] = useState(""); // State for search query
  const [expandedItems, setExpandedItems] = useState([]); // State to track expanded items

  // Hook to detect mobile view
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { enqueueSnackbar } = useSnackbar();

  // Fetch history data from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `http://localhost:5555/api/v1/prompt/getResponseHistory?page=${currentPage}&query=${query}&limit=5`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const result = await response.json();
        const { result: fetchedData, totalPages } = result.data;

        setHistoryResult(fetchedData); // Set the fetched history data
        setTotalPages(totalPages); // Set the total pages for pagination
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to fetch history");
      }
    };

    fetchHistory();
  }, [currentPage, query]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update page when pagination is clicked
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on search
  };

  // Function to sanitize HTML
  const createMarkup = (htmlString) => {
    return { __html: DOMPurify.sanitize(htmlString) };
  };

  const handleAnsClick = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const isItemExpanded = prevExpandedItems.includes(index);
      return isItemExpanded
        ? prevExpandedItems.filter((item) => item !== index) // Close item
        : [...prevExpandedItems, index]; // Open item
    });
  };

  return (
    <Container>
      <div className="h-screen flex justify-center items-center mt-[40px] md:mt-[100px]">
        <div className="mx-auto w-full bg-gray-100 rounded-xl p-10 border border-black/10 h-screen overflow-y-auto mt-[20px] mb-[20px] md:mt-0 md:mb-0">
          <h2 className="text-center text-2xl font-bold leading-tight mb-[8px]">
            Your History
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex justify-center mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search history..."
              className="border rounded p-2 mr-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </form>

          {error && <p className="text-red-500">{error}</p>}

          {historyResult.length > 1 && (
            <div className="flex justify-end">
              <Link to="/DeleteAllHistory">
                <button className="m-4 p-4 hover:text-red-500 border shadow rounded-md">
                  <MdOutlineDeleteForever size={32} />
                  Delete All
                </button>
              </Link>
            </div>
          )}

          {historyResult.length > 0 ? (
            <ul>
              {historyResult.map((item, index) => (
                <li
                  key={index}
                  className={`mb-4 p-4 bg-white shadow rounded-md ${
                    expandedItems.includes(index) ? "active" : ""
                  }`}
                >
                  <Link to={`/deleteById/${item.promptId}`}>
                    <RiDeleteBin5Fill color="red" size={24} />
                  </Link>

                  <p>
                    <strong>CreatedAt :: </strong> {item.createdAt}
                  </p>
                  <br />
                  <p>
                    <strong>Prompt:</strong> {item.prompt}
                    <span
                      className="cursor-pointer"
                      onClick={() => handleAnsClick(index)}
                    >
                      {expandedItems.includes(index) ? (
                        <CiCircleChevDown size={32} />
                      ) : (
                        <CiCircleChevUp size={32} />
                      )}
                    </span>
                  </p>
                  <br />
                  {expandedItems.includes(index) && (
                    <div>
                      <p>
                        <strong>Generated Response:</strong>
                      </p>
                      <div
                        dangerouslySetInnerHTML={createMarkup(
                          item.generatedResponse
                        )}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No history available</p>
          )}

          {/* Pagination Component */}
          <Stack spacing={2} alignItems="center" className="mt-4">
            <Pagination
              count={totalPages} // Total number of pages from backend
              page={currentPage} // Current page
              onChange={handlePageChange} // Handle page change
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={isMobile ? 1 : 1}
              showFirstButton={!isMobile}
              showLastButton={!isMobile}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        </div>
      </div>
    </Container>
  );
}

export default History;
