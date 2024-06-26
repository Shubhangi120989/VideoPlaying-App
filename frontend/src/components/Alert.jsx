import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useEffect } from 'react';
const Alert = ({
  message,
  showCancelButton,
  showOKButton,
  showYesButton,
  handleCancelClick,
  handleOkClick,
  handleYesClick,
  timeout,
}) => {
    useEffect(() => {
        let timer;
        if (timeout) {
          // Set a timer to hide the alert after 2 seconds
          timer = setTimeout(() => {
            // Optional: Add logic to handle completion after timeout, e.g., redirect or clear state
            console.log("Alert will disappear after 2 seconds");
          }, 2000);
        }
        
        // Clean up the timer on component unmount or when timeout changes
        return () => clearTimeout(timer);
      }, [timeout]);
  return (
    <Overlay>
      <Container>
        <Message>{message}</Message>
        <ButtonContainer>
          {showCancelButton && <StyledButton onClick={handleCancelClick}>Cancel</StyledButton>}
          {showOKButton && <StyledButton onClick={handleOkClick}>OK</StyledButton>}
          {showYesButton && <StyledButton onClick={handleYesClick}>Yes</StyledButton>}
        </ButtonContainer>
      </Container>
    </Overlay>
  );
};



const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 250px;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4); /* Transparent overlay */
  display: flex;
  justify-content: center;
  
  z-index: 9999;
  opacity:1
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  gap: 20px;
  top:80px;
  background-color: ${({ theme }) => theme.bg}; /* Theme background color */
  opacity: 1; /* Full opacity for the container */
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9); /* Box shadow */
  max-width: 300px;
max-height: 150px;
  margin: 20px auto;
  z-index: 10000;
`;

const Message = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding:15px
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
`;


const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: ${({ theme }) => theme.buttonDisabled};
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  showCancelButton: PropTypes.bool,
  showOKButton: PropTypes.bool,
  showYesButton: PropTypes.bool,
  handleCancelClick: PropTypes.func,
  handleOkClick: PropTypes.func,
  handleYesClick: PropTypes.func,
};

Alert.defaultProps = {
  showCancelButton: false,
  showOKButton: false,
  showYesButton: false,
};

export default Alert;
