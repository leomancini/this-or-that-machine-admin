import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./Button";
import { getButtonColors } from "../utils/buttonColors";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 24rem;
`;

const TitleAndMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0rem;
  margin-top: 1rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0 2rem;
  margin: 0;
  max-width: 16rem;
`;

const Message = styled.p`
  font-size: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex: 1;
  width: 100%;
`;

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isLoading = false
}) => {
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || isLoading) return;

      if (event.key === "Escape") {
        setActiveButton("cancel");
        setTimeout(() => {
          onClose();
        }, 100);
      } else if (event.key === "Enter") {
        setActiveButton("confirm");
        setTimeout(() => {
          onConfirm();
        }, 100);
      }
    };

    const handleKeyUp = () => {
      setActiveButton(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, onClose, onConfirm, isLoading]);

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={isLoading ? undefined : onClose} />
      <Dialog>
        <TitleAndMessageContainer>
          <Title>{title}</Title>
          {message && <Message>{message}</Message>}
        </TitleAndMessageContainer>
        <ButtonContainer>
          <Button
            variant="secondary"
            onClick={isLoading ? undefined : onClose}
            isActive={activeButton === "cancel"}
            disabled={isLoading}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={isLoading ? undefined : onConfirm}
            isActive={activeButton === "confirm"}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? <Spinner /> : confirmText}
          </Button>
        </ButtonContainer>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
