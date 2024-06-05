import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { Avatar as MuiAvatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import VideoList from './VideoList';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser } from '../redux/userSlice';
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  width: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 40px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Username = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: bold;
`;

const FullName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${({ theme }) => theme.textSoft};
  display: flex;
  align-items: center;
  padding: 10px;
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  gap: 10px;
  background-color: ${({ theme }) => theme.bgLighter};
  padding: 10px;
  border-radius: 5px;
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

const TextField = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const VideoGrid = styled.div`
  flex: 2;
`;

const ChannelStats = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState(null);
  const [channelStats, setChannelStats] = useState(null);
  const [editable, setEditable] = useState(false);
  const [email, setEmail] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const path = useLocation().pathname.split("/")[2];
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res1 = await axios.get(`http://localhost:8000/api/v1/users/c/${path}`,{withCredentials:true});
        setChannel(res1.data.data);
        setNewFullName(res1.data.data.fullName);
        setEmail(res1.data.data.email);
        setNewAvatar(res1.data.data.avatar);

        const res = await axios.get(`http://localhost:8000/api/v1/dashboard/stats/${path}`, { withCredentials: true });
        setChannelStats(res.data.data);
      } catch (error) {
        console.error("Error fetching channel data", error);
      }
    };

    fetchChannel();
  }, [path]);

  useEffect(() => {
    const handleAvatarUpdate = async () => {
      if (avatarFile) {
        try {
          const formData = new FormData();
          formData.append('avatar', avatarFile);
          const res = await axios.patch(`http://localhost:8000/api/v1/users/update-avatar`, formData, { withCredentials: true });
          dispatch(refreshUser(res.data.data));
          setNewAvatar(res.data.data.avatar);
        } catch (error) {
          console.log("Error while updating avatar", error);
        }
      }
    };

    handleAvatarUpdate();
  }, [avatarFile, dispatch]);

  const handleUpdate = async () => {
    if (editable) {
      try {
        await axios.patch(`http://localhost:8000/api/v1/users/update-account`, { email, fullName: newFullName }, { withCredentials: true });
      } catch (error) {
        console.log("Error updating details", error);
      }
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  if (!channel) return <div>Loading...</div>;

  return (
    <>
      <Container>
        <AvatarContainer>
          <MuiAvatar 
            src={newAvatar} 
            alt={`${channel?.username}'s avatar`} 
            sx={{ width: 100, height: 100 }} 
          />
          {currentUser._id === channel?._id && (
            <input 
              type="file" 
              accept="image/*" 
              style={{ position: 'absolute', top: 0, left: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          )}
        </AvatarContainer>
        <Details>
          <Username>{channel?.username}</Username>

          <FullName>
            {editable ? (
              <TextField 
                value={newFullName} 
                onChange={(e) => setNewFullName(e.target.value)} 
              />
            ) : (
              newFullName
            )}
            {currentUser._id === channel?._id && <IconButton onClick={handleUpdate}>
              {editable ? <SaveIcon /> : <EditIcon />}
            </IconButton>}
          </FullName>
          <FullName>
            {editable ? (
              <TextField 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            ) : (
              email
            )}
            {currentUser._id === channel?._id && <IconButton onClick={handleUpdate}>
              {editable ? <SaveIcon /> : <EditIcon />}
            </IconButton>}
          </FullName>
          <Stats>
            <Stat><PersonIcon /> Total Subscribers: {channelStats?.totalSubscribers}</Stat>
            <Stat><VisibilityIcon /> Total Views: {channelStats?.totalViews}</Stat>
            <Stat><ThumbUpIcon /> Total Likes: {channelStats?.totalLikes}</Stat>
            <Stat><VideoLibraryIcon /> Total Videos: {channelStats?.totalVideos}</Stat>
          </Stats>
        </Details>
      </Container>

      <VideoList channel={channel} />
    </>
  );
};

export default ChannelStats;
