import React from "react";
import styled from "styled-components";
import Spinner from "./Spinner";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 2rem;
`;

const InfiniteScrollLoadingContainer = () => (
  <Container>
    <Spinner />
  </Container>
);

export default InfiniteScrollLoadingContainer;
