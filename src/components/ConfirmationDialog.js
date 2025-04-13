import React from "react";
import styled from "styled-components";
import Button from "./Button";

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
  max-width: 20rem;
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

const StyledButton = styled(Button)`
  flex: 1;
  && {
    background-color: ${(props) =>
      props.variant === "danger"
        ? "#dc3545"
        : props.variant === "secondary"
        ? "#6c757d"
        : "#007bff"};
    &:hover {
      background-color: ${(props) =>
        props.variant === "danger"
          ? "#c82333"
          : props.variant === "secondary"
          ? "#5a6268"
          : "#0056b3"};
    }
    &:active {
      background-color: ${(props) =>
        props.variant === "danger"
          ? "#b82532"
          : props.variant === "secondary"
          ? "#40464c"
          : "#004085"};
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
  confirmVariant = "danger"
}) => {
  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <Dialog>
        <TitleAndMessageContainer>
          <Title>{title}</Title>
          {message && <Message>{message}</Message>}
        </TitleAndMessageContainer>
        <ButtonContainer>
          <StyledButton variant="secondary" onClick={onClose}>
            {cancelText}
          </StyledButton>
          <StyledButton variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </StyledButton>
        </ButtonContainer>
      </Dialog>
    </>
  );
};

export default ConfirmationDialog;
