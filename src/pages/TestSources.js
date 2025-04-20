import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Page from "../components/Page";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Dropdown from "../components/Dropdown";
import { getApiKey } from "../utils/apiKey";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 100%;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
`;

const Result = styled.div`
  width: 100%;
  height: 100%;
  max-height: calc(100% - 5rem);
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Image = styled.img`
  box-sizing: border-box;
  max-width: 100%;
  max-height: 100%;

  object-fit: contain;
  opacity: ${(props) => (props.loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const TestSources = () => {
  const [query, setQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sourceOptions, setSourceOptions] = useState([]);

  // Fetch valid sources from server
  useEffect(() => {
    const fetchValidSources = async () => {
      try {
        const apiKey = getApiKey();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/metadata/valid-sources?key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch valid sources: ${response.statusText}`
          );
        }

        const { valid_sources } = await response.json();
        const options = valid_sources.map((source) => ({
          value: source,
          label: source.charAt(0).toUpperCase() + source.slice(1)
        }));
        setSourceOptions(options);

        // Set the first source as selected if available
        if (options.length > 0) {
          setSelectedSource(options[0].value);
        }
      } catch (error) {
        console.error("Error fetching valid sources:", error);
      }
    };

    fetchValidSources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiKey = getApiKey();

      if (!query || !selectedSource) {
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/test/${selectedSource}?${
          selectedSource === "text" ? "text" : "query"
        }=${encodeURIComponent(query)}&key=${apiKey}`
      );

      if (response.ok) {
        // Create a blob URL from the image data
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setResults([
          {
            url,
            title: selectedSource === "spotify" ? query : undefined,
            description: selectedSource === "unsplash" ? query : undefined
          }
        ]);
      }
    } catch (error) {
      console.error("Error testing endpoints:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Dropdown
            name="source"
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
            }}
            options={sourceOptions}
            placeholder="Select source"
          />
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Keyword"
          />
          <Button type="submit" disabled={loading || !query || !selectedSource}>
            {loading ? "Testing..." : "Test"}
          </Button>
        </Form>
        <Result>
          {loading ? (
            <Spinner />
          ) : (
            <Image
              src={results[0]?.url}
              alt={
                results[0]?.title ||
                results[0]?.description ||
                `${selectedSource} image`
              }
              loaded={results[0]?.url ? true : false}
              onLoad={(e) => {
                e.target.loaded = true;
              }}
            />
          )}
        </Result>
      </Container>
    </Page>
  );
};

export default TestSources;
