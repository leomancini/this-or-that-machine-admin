import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Page from "../components/Page";
import FullPageLoadingContainer from "../components/FullPageLoadingContainer";
import InfiniteScrollLoadingContainer from "../components/InfiniteScrollLoadingContainer";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { getApiKey } from "../utils/apiKey";

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 1rem;
  background: #f8d7da;
  border-radius: 0.25rem;
  margin: 1rem 0;
`;

const VotesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const VoteItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: 6rem;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const ImageContainer = styled.div`
  height: 100%;
  border-radius: ${(props) =>
    props.percentage === 0
      ? "0.75rem"
      : props.left
      ? "0.75rem 0 0 0.75rem"
      : "0 0.75rem 0.75rem 0"};
  overflow: hidden;
  position: relative;
`;

const OptionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BarContainer = styled.div`
  height: 100%;
  overflow: hidden;
  position: relative;
  flex: 1;
  display: flex;
  gap: 1rem;
`;

const BlurredBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  filter: blur(50px) brightness(0.8);
  transform: scale(2);
  width: 100%;
  height: 100%;
  min-width: 200px;
  min-height: 100px;
  z-index: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
`;

const Bar = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  ${(props) =>
    props.left
      ? `
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    `
      : `
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
    `}
  ${(props) =>
    props.percentage === 0 &&
    `
    background-color: transparent;
  `}
`;

const BarLabel = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  z-index: 2;
  ${(props) => (props.left ? "left: 1.5rem;" : "right: 1.5rem;")}
  ${(props) => props.percentage === 0 && "display: none;"}
`;

const Votes = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchVotes = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      if (shouldAppend) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
      }
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error("No API key found");
      }

      const queryParams = new URLSearchParams({
        key: apiKey,
        limit: 20,
        offset: (pageNum - 1) * 20
      });

      const url = `${process.env.REACT_APP_API_URL}/votes/get-all-votes?${queryParams}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to fetch votes: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setHasMore(data.votes.length === 20);

      if (shouldAppend) {
        setVotes((prev) => [...prev, ...data.votes]);
      } else {
        setVotes(data.votes);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      if (shouldAppend) {
        setIsLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchVotes(1, false);
  }, [fetchVotes]);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prev) => prev + 1);
      fetchVotes(page + 1, true);
    }
  };

  const { lastElementRef } = useInfiniteScroll({
    loading: isLoadingMore,
    hasMore,
    onLoadMore: loadMore
  });

  if (loading && votes.length === 0) {
    return (
      <Page>
        <FullPageLoadingContainer />
      </Page>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Page>
      <VotesGrid>
        {votes.map((vote, index) => {
          const totalVotes = vote.option_1.count + vote.option_2.count;
          const option1Percentage =
            totalVotes > 0
              ? Math.round((vote.option_1.count / totalVotes) * 100)
              : 0;
          const option2Percentage =
            totalVotes > 0
              ? Math.round((vote.option_2.count / totalVotes) * 100)
              : 0;

          return (
            <VoteItem
              key={index}
              ref={index === votes.length - 1 ? lastElementRef : null}
            >
              <OptionsContainer>
                <Option>
                  <ImageContainer left percentage={option1Percentage}>
                    <OptionImage src={vote.option_1.url} alt="Option 1" />
                  </ImageContainer>
                </Option>
                {totalVotes > 0 ? (
                  <BarContainer>
                    <Bar percentage={option1Percentage} left>
                      <BlurredBackground imageUrl={vote.option_1.url} />
                      <BarLabel left percentage={option1Percentage}>
                        {option1Percentage}%
                      </BarLabel>
                    </Bar>
                    <Bar percentage={option2Percentage}>
                      <BlurredBackground imageUrl={vote.option_2.url} />
                      <BarLabel percentage={option2Percentage}>
                        {option2Percentage}%
                      </BarLabel>
                    </Bar>
                  </BarContainer>
                ) : (
                  <BarContainer>
                    <Bar color="#8884d8" percentage={0} left>
                      <BarLabel left>0%</BarLabel>
                    </Bar>
                    <Bar color="#82ca9d" percentage={0}>
                      <BarLabel>0%</BarLabel>
                    </Bar>
                  </BarContainer>
                )}
                <Option>
                  <ImageContainer percentage={option2Percentage}>
                    <OptionImage src={vote.option_2.url} alt="Option 2" />
                  </ImageContainer>
                </Option>
              </OptionsContainer>
            </VoteItem>
          );
        })}
      </VotesGrid>

      {isLoadingMore && <InfiniteScrollLoadingContainer />}

      {!loading && votes.length === 0 && (
        <div style={{ textAlign: "center", padding: "1.25rem" }}>
          No votes found
        </div>
      )}
    </Page>
  );
};

export default Votes;
