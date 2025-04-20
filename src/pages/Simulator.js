import React, { useState, useEffect } from "react";
import Page from "../components/Page";
import LoadingContainer from "../components/LoadingContainer";
import Image from "../assets/DevicePhoto.jpg";
import styled from "styled-components";

const SimulatorSection = styled.section`
  height: 100%;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;

const SimulatorFrame = styled.figure`
  position: relative;
  width: min(100%, calc((100vh - 4rem) * 4 / 3)); /* 4:3 aspect ratio */
  margin: 0 auto;
`;

const SimulatorAspectContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
`;

const SimulatorImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const SimulatorImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SimulatorButton = styled.button`
  background-color: transparent;
  position: absolute;
  width: 6.2%;
  aspect-ratio: 1;
  top: 77.8%;
  left: ${(props) => (props.side === "left" ? "33.43%" : "67.3%")};
  transform: translate(-50%, -50%);
  border-radius: 50%;
  opacity: 0.5;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 8px 4px rgba(0, 0, 0, 1);
  }
`;

const OptionImageContainer = styled.div`
  position: absolute;
  width: 32.2%;
  height: 43%;
  aspect-ratio: 1;
  top: 39.9%;
  left: ${(props) => (props.side === "left" ? "33.45%;" : "67.3%")};
  transform: translate(-50%, -50%);
  box-sizing: border-box;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 5px 10px 0 rgba(0, 0, 0, 0.25);
    border: ${(props) =>
      props.isSelected ? "20px solid rgb(0, 255, 0)" : "none"};
  }
`;

const OptionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Simulator = () => {
  const [options, setOptions] = useState(null);
  const [currentPairId, setCurrentPairId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  const getApiKey = () => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      throw new Error("API key not found. Please log in first.");
    }
    return apiKey;
  };

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const apiKey = getApiKey();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get-random-pair?key=${apiKey}`
      );
      const data = await response.json();
      setOptions(data.options);
      setCurrentPairId(data.id);
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (option) => {
    try {
      setSelectedOption(option);
      const apiKey = getApiKey();
      await fetch(
        `${process.env.REACT_APP_API_URL}/vote?id=${currentPairId}&option=${option}&key=${apiKey}`
      );
      // Wait for the border to be visible
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Fetch new options first
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get-random-pair?key=${apiKey}`
      );
      const data = await response.json();
      // Update both states together
      setOptions(data.options);
      setCurrentPairId(data.id);
      setSelectedOption(null);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      {loading ? (
        <LoadingContainer />
      ) : (
        <SimulatorSection>
          <SimulatorFrame>
            <SimulatorAspectContainer>
              <SimulatorImageContainer>
                <OptionImageContainer
                  side="left"
                  aria-label="Option 1 Image"
                  isSelected={selectedOption === 1}
                >
                  {options && (
                    <OptionImage src={options[0].url} alt={options[0].value} />
                  )}
                </OptionImageContainer>
                <OptionImageContainer
                  side="right"
                  aria-label="Option 2 Image"
                  isSelected={selectedOption === 2}
                >
                  {options && (
                    <OptionImage src={options[1].url} alt={options[1].value} />
                  )}
                </OptionImageContainer>
                <SimulatorButton
                  side="left"
                  aria-label="Option 1 Button"
                  onClick={() => handleVote(1)}
                />
                <SimulatorButton
                  side="right"
                  aria-label="Option 2 Button"
                  onClick={() => handleVote(2)}
                />
                <SimulatorImage src={Image} alt="This or That Machine" />
              </SimulatorImageContainer>
            </SimulatorAspectContainer>
          </SimulatorFrame>
        </SimulatorSection>
      )}
    </Page>
  );
};

export default Simulator;
