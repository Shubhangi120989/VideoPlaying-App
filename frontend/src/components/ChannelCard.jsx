import React from 'react';
import styled from "styled-components";
import MuiAvatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 20px; /* Adjust padding */
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  width: 100%; /* Use full width */
  max-width: 800px; /* Set a max-width */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  box-sizing: border-box; /* Ensure padding is included in width calculations */
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 20px; /* Adjusted for better alignment */
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`;

const Username = styled.h2`
  margin: 0;
  font-size: 24px; /* Adjust font size */
  font-weight: bold;
  word-wrap: break-word; /* Ensure long words are wrapped */
`;

const FullName = styled.h3`
  margin: 0;
  font-size: 18px; /* Adjust font size */
  color: ${({ theme }) => theme.textSoft};
  padding: 5px 0; /* Adjust padding for better spacing */
  word-wrap: break-word; /* Ensure long words are wrapped */
`;

const ChannelCard = ({ channel }) => {
  return (
    <Link to={`/channel/${channel.username}`} style={{ textDecoration: "none", width: '100%' }}>
      <Container>
        <AvatarContainer>
          <MuiAvatar 
            src={channel?.avatar} 
            alt={`${channel.username}'s avatar`} 
            sx={{ width: 100, height: 100 }} 
          />
        </AvatarContainer>
        <Details>
          <Username>{channel?.username}</Username>
          <FullName>{channel?.fullName}</FullName>
          <FullName>{channel?.email}</FullName>
        </Details>
      </Container>
    </Link>
  );
};

export default ChannelCard;
