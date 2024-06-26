import React from 'react';
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from 'react-redux';
import Alert from './Alert';
// import { IconButton as MuiIconButton, Typography } from '@mui/material';

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  margin: 10px 0;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Ensure consistent card width */
`;

const Thumbnail = styled.img`
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 20px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.h2`
  margin: 5px 0 0 0;
  font-size: 16px;
  color: ${({ theme }) => theme.textSoft};
  overflow-y: auto; 
  max-height: 100px; 
  word-wrap: break-word; 
  max-width: 700px;

  /* Hide scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }

  /* Hide scrollbar for other browsers */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;
const DescriptionContainer = styled.div`
  max-height: 100px;
  overflow-y: hidden;

  &:hover {
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 0px;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const IconButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px; /* Space between icons */
  margin-left: auto;
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
const ThumbnailWrapper = styled.label`
  cursor: pointer;
`;
const TextField = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;
const Info = styled.div`
  font-size: 14px;
  margin: 5px 0 0 0;
  color: ${({ theme }) => theme.textSoft};
`;
const AnotherCard = ({ video, handleDelete}) => {
    const {currentUser}=useSelector((state)=>state.user)
    const [title1,setTitle1]=useState(video.title.replace(/ /g, "-"));
    // console.log(video)
    const [title,setTitle]=useState(video?.title);
    const[description,setDescription]=useState(video?.description);
    const [thumbnail,setThumbnail]=useState(video?.thumbnail)
    const [editable,setEditable]=useState(false)
    const [newThumbNail,setNewThumbnail]=useState(null)
    const [showAlert,setShowAlert]=useState(false)
    const handleUpdate = async () => {
        if (editable) {
          try {
            const formData = new FormData();
            if (newThumbNail) {
                formData.append("thumbnail", newThumbNail);
            }
            if (title1.replace(/-/g, " ") !== title) {
                formData.append("newTitle", title);
            }
            formData.append("description", description);
            const res = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/${title1}`, formData, { withCredentials: true });

            setEditable(false);
            setTitle1(res.data.data.title.replace(/ /g, "-"));
            setTitle(res.data.data.title);
            setThumbnail(res.data.data.thumbnail);
            setDescription(res.data.data.description);
            setNewThumbnail(null);
            // setRefresh(true);
          } catch (error) {
            console.log("Error updating video details", error);
          }
        //   setEditable(false);
        //   setTitle1(res.data.data.title.replace(/ /g, "-"));
        //   setTitle(res.data.data.title);
        //   setThumbnail(res.data.data.thumbnail);
        //   setDescription(res.data.data.description);
        //   setNewThumbnail(null);
        } else {
          setEditable(true);
        }
    };
    function handleCancelClick(){
      setShowAlert(false)
    
    }
    function handleYesClick(){
      handleDelete(title1)
      setShowAlert(false)
      
    }
    
  return (
      <CardWrapper>
        {showAlert&&<Alert message="Are you sure you want to delete the video?" showCancelButton={true} showYesButton={true} handleCancelClick={handleCancelClick} handleYesClick={handleYesClick}></Alert>}
        {editable ? <ThumbnailWrapper>
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }}
          onChange={(e) => {
            setNewThumbnail(e.target.files[0]);
         
          }}
        //   onChange={handleThumbnailChange}
        />
        <Thumbnail src={thumbnail} alt={video.title} />
      </ThumbnailWrapper> : (
        <Link to={`/video/${title1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Thumbnail src={thumbnail} alt={video.title} />
        </Link>
      )}
      <Details>
        
          {editable?<TextField 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              variant="outlined" 
             
            />:<Title>{title}</Title>}
           <DescriptionContainer>

          {editable?<TextField 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              variant="outlined" 
              
            />:<Description>{description}</Description>}
            </DescriptionContainer>
         <Info>{video.views} views • {Math.round(video.ageInDays)} days ago</Info>
      </Details>
     {currentUser._id===video.owner._id&& <IconButtonContainer>
        <IconButton onClick={handleUpdate}>
         {!editable? <EditIcon />:<SaveIcon/>}
        </IconButton>
        <IconButton onClick={() =>{setShowAlert(true)}}>
          <DeleteIcon />
        </IconButton>
      </IconButtonContainer>}
    </CardWrapper>
  );
};

export default AnotherCard;
