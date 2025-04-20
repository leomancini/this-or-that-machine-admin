import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Page from "../components/Page";
import Spinner from "../components/Spinner";
import LoadingContainer from "../components/LoadingContainer";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Dropdown from "../components/Dropdown";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";

const FiltersContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const DropdownsContainer = styled.div`
  display: flex;
  gap: 1.25rem;
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
  transition: transform 0.2s;
  position: relative;

  &:hover .delete-button {
    opacity: 1;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const OptionContainer = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
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

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 1.25rem;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -0.75rem;
  right: -0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: white;
  background-color: rgb(154, 154, 154);
  transition: all 0.2s;
  opacity: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  font-size: 1rem;

  &:hover {
    background-color: rgb(128, 128, 128);
  }

  &:active {
    background-color: rgb(102, 102, 102);
    transform: scale(0.95);
  }
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
  const [typeOptions, setTypeOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all available types and sources
  const fetchOptions = useCallback(async () => {
    try {
      const apiKey = getApiKey();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get-metadata?key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const { types, sources } = await response.json();

      setTypeOptions(
        types
          .filter(Boolean)
          .map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1)
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      setSourceOptions(
        sources
          .filter(Boolean)
          .map((source) => ({
            value: source,
            label: source.charAt(0).toUpperCase() + source.slice(1)
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setError(err.message);
    }
  }, []);

  // Fetch options when component mounts
  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getApiKey = () => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      throw new Error("API key not found. Please log in first.");
    }
    return apiKey;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
    setPage(1);
  };

  // Add effect to fetch when filters change
  useEffect(() => {
    fetchPairs(1, false);
  }, [filters, fetchPairs]);

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

      setPairs((prevPairs) => prevPairs.filter((pair) => pair.id !== pairId));
      setPairToDelete(null);
    } catch (err) {
      console.error("Error deleting pair:", err);
      setError(err.message);
    }
  };

  const handleGeneratePairsWithImages = async () => {
    try {
      setIsGenerating(true);
      const apiKey = getApiKey();

      // First generate pairs
      const generateResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/generate-pairs?key=${apiKey}`,
        {
          method: "GET"
        }
      );

      if (!generateResponse.ok) {
        throw new Error(
          `Failed to generate pairs: ${generateResponse.statusText}`
        );
      }

      // Then add images
      const addImagesResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/add-images?key=${apiKey}`,
        {
          method: "GET"
        }
      );

      if (!addImagesResponse.ok) {
        throw new Error(
          `Failed to add images: ${addImagesResponse.statusText}`
        );
      }

      // Reset pagination state and fetch first page
      setPage(1);
      setHasMore(true);
      fetchPairs(1, false);
    } catch (err) {
      console.error("Error generating pairs with images:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
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
      <FiltersContainer>
        <DropdownsContainer>
          <Dropdown
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            options={typeOptions}
            placeholder="All Types"
          />
          <Dropdown
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            options={sourceOptions}
            placeholder="All Sources"
          />
        </DropdownsContainer>
        <Button
          onClick={handleGeneratePairsWithImages}
          isLoading={isGenerating}
          variant="primary"
        >
          Generate more pairs
        </Button>
      </FiltersContainer>

      <PairsGrid>
        {pairs.map((pair, index) => (
          <PairCard
            key={pair.id}
            ref={index === pairs.length - 1 ? lastElementRef : null}
          >
            <DeleteButton
              className="delete-button"
              onClick={() => setPairToDelete(pair.id)}
            >
              <FontAwesomeIcon icon={faClose} />
            </DeleteButton>
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
                </OptionContainer>
              ))}
            </OptionsContainer>
          </PairCard>
        ))}
      </PairsGrid>

      <ConfirmationDialog
        isOpen={!!pairToDelete}
        onClose={() => setPairToDelete(null)}
        onConfirm={() => handleDeletePair(pairToDelete)}
        title="Are you sure you want to delete this pair?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {loading && <LoadingContainer />}

      {!loading && pairs.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No pairs found
        </div>
      )}
    </Page>
  );
};

export default React.memo(Pairs);
