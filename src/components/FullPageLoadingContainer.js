import React from "react";
import styled from "styled-components";
import Spinner from "./Spinner";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
`;

const FullPageLoadingContainer = ({ children }) => {
  return <Container>{children || <Spinner />}</Container>;
};

export default FullPageLoadingContainer;
