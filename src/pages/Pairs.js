import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Page from "../components/Page";
import Spinner from "../components/Spinner";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const PairsContainer = styled.div`
  padding: 1.25rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  border: 0.0625rem solid #ccc;
  min-width: 9.375rem;
`;

const PairsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18.75rem, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
`;

const PairCard = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  transition: transform 0.3s;
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 0.625rem;
  margin-bottom: 0.625rem;
`;

const OptionContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
`;

const OptionImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
`;

const OptionInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.3125rem;
`;

const PairInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.625rem;
  padding-top: 0.625rem;
  border-top: 0.0625rem solid #eee;
`;

const DeleteButton = styled.button`
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #cc0000;
  }
`;

const ConfirmationDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  z-index: 10000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 1.25rem;
`;

const Pairs = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    source: ""
  });
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pairToDelete, setPairToDelete] = useState(null);

  const getApiKey = () => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      throw new Error("API key not found. Please log in first.");
    }
    return apiKey;
  };

  const fetchPairs = useCallback(
    async (pageNum = 1, shouldAppend = false) => {
      try {
        setLoading(true);
        const apiKey = getApiKey();
        const queryParams = new URLSearchParams({
          key: apiKey,
          limit: 20,
          offset: (pageNum - 1) * 20,
          ...(filters.type && { type: filters.type }),
          ...(filters.source && { source: filters.source })
        });

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/get-all-pairs?${queryParams}`
        );

        if (response.status === 401) {
          throw new Error("Invalid API key. Please log in again.");
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch pairs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched pairs data:", data);

        setHasMore(data.length === 20);

        if (shouldAppend) {
          setPairs((prev) => [...prev, ...data]);
        } else {
          setPairs(data);
        }
      } catch (err) {
        console.error("Error fetching pairs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchPairs(1, false);
  }, [fetchPairs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchPairs(page + 1, true);
    }
  };

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore
  });

  const handleDeletePair = async (pairId) => {
    try {
      const apiKey = getApiKey();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/delete-pair?id=${pairId}&key=${apiKey}`,
        {
          method: "DELETE"
        }
      );

      if (response.status === 401) {
        throw new Error("Invalid API key. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to delete pair: ${response.statusText}`);
      }

      // Remove the deleted pair from the state
      setPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== pairId));
      setPairToDelete(null);
    } catch (err) {
      console.error("Error deleting pair:", err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <Page>
        <ErrorMessage>
          {error}
          <button
            onClick={() => {
              setError(null);
              fetchPairs(1, false);
            }}
          >
            Retry
          </button>
        </ErrorMessage>
      </Page>
    );
  }

  return (
    <Page>
      <PairsContainer>
        <FiltersContainer>
          <FilterSelect
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="brand">Brand</option>
            <option value="animal">Animal</option>
            <option value="food">Food</option>
          </FilterSelect>

          <FilterSelect
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
          >
            <option value="">All Sources</option>
            <option value="logodev">LogoDev</option>
            <option value="unsplash">Unsplash</option>
            <option value="wikipedia">Wikipedia</option>
          </FilterSelect>
        </FiltersContainer>

        <PairsGrid>
          {pairs.map((pair, index) => (
            <PairCard
              key={pair.id}
              ref={index === pairs.length - 1 ? lastElementRef : null}
            >
              <OptionsContainer>
                {pair.options.map((option, optionIndex) => (
                  <OptionContainer key={optionIndex}>
                    <ImageWrapper>
                      <OptionImage
                        src={option.url}
                        alt={option.value}
                        loading="lazy"
                        onError={(e) => {
                          console.error(
                            `Failed to load image for option ${optionIndex} of pair ${pair.id}:`,
                            option.url
                          );
                          e.target.style.display = "none";
                        }}
                      />
                    </ImageWrapper>
                    <OptionInfo>
                      <span>{option.value}</span>
                      <span>Votes: {option.votes}</span>
                    </OptionInfo>
                  </OptionContainer>
                ))}
              </OptionsContainer>
              <PairInfo>
                <span>Type: {pair.type}</span>
                <span>Source: {pair.source}</span>
                <DeleteButton onClick={() => setPairToDelete(pair.id)}>
                  Delete
                </DeleteButton>
              </PairInfo>
            </PairCard>
          ))}
        </PairsGrid>

        {pairToDelete && (
          <>
            <Overlay onClick={() => setPairToDelete(null)} />
            <ConfirmationDialog>
              <h3>Are you sure you want to delete this pair?</h3>
              <p>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <DeleteButton onClick={() => handleDeletePair(pairToDelete)}>
                  Yes, delete
                </DeleteButton>
                <button onClick={() => setPairToDelete(null)}>Cancel</button>
              </div>
            </ConfirmationDialog>
          </>
        )}

        {loading && (
          <LoadingContainer>
            <Spinner />
          </LoadingContainer>
        )}

        {!hasMore && pairs.length > 0 && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No more pairs to load
          </div>
        )}

        {!loading && pairs.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No pairs found
          </div>
        )}
      </PairsContainer>
    </Page>
  );
};

export default React.memo(Pairs);
