import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid transparent;
  border-radius: 50%;
  border-top-color: rgba(0, 0, 0, 0.8);
  border-right-color: rgba(0, 0, 0, 0.8);
  border-bottom-color: rgba(0, 0, 0, 0.8);
  animation: ${spin} 0.8s linear infinite;
`;
