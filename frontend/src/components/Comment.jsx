import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from "react-redux";
import SaveIcon from '@mui/icons-material/Save'; // Import the Save icon
import axios from "axios";
import Alert from "./Alert";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
  flex-grow: 1;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Dates = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;  /* Reduced gap between buttons */
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;  /* Reduced padding */
  margin: 0;  /* Removed margin */
  font-size: 0.8rem;  /* Reduced font size */

  &:hover {
    color: ${({ theme }) => theme.primary};
  }

  svg {
    font-size: 1rem;  /* Reduced icon size */
  }
`;
const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Comment = ({ comment,handleDelete }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [editable, setEditable] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [showAlert,setShowAlert]=useState(false)

  const calculateDaysOld = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const today = new Date();
    const differenceInMs = today - createdAtDate;
    const daysOld = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
    return daysOld;
  };

  

  const handleUpdate = async () => {
    if (editable) {
      try {
        const res = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/comments/c/${comment._id}`, { content }, { withCredentials: true });
        // console.log(res);
      } catch (error) {
        console.log("Error updating comment", error);
      }
      setEditable(false);
    } else {
      setEditable(true);
    }
  };
  const addDelete=()=>{
    setShowAlert(true)
  }
  function handleCancelClick(){
    setShowAlert(false)
  }
  function handleYesClick(){
    handleDelete(comment._id)
    setShowAlert(false)
  }

  return (
    <Container>
      {showAlert&&<Alert message="Are you sure you want to delete the Comment?" showCancelButton={true} showYesButton={true} handleCancelClick={handleCancelClick} handleYesClick={handleYesClick}/>}

      <Avatar src={comment.owner.avatar} />
      <Details>
        <Name>
          {comment.owner.username} <Dates>{`${calculateDaysOld(comment.createdAt)} days ago`}</Dates>
        </Name>
        {editable ? (
          <Input
            placeholder=""
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        ) : (
          <Text>
            {content}
          </Text>
        )}
      </Details>
      {currentUser?._id === comment.owner._id && (
        <ButtonContainer>
          <IconButton 
          onClick={addDelete}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={handleUpdate}>
            {editable ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default Comment;