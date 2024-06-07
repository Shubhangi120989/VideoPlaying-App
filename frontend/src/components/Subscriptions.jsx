import React, { useEffect,useState} from 'react'
import styled from "styled-components";
import axios from 'axios';
import ChannelCard from './ChannelCard';
const VideoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding:20px;
  
`;
const Heading = styled.h1`
color: ${({ theme }) => theme.text};
text-align: left; 
width: 100%;    
padding-left: 20px; 
position: relative;  // Required for positioning the pseudo-element
margin-bottom: 10px;  // Space below the heading to accommodate the underline

&::after {
  content: "";
  position: absolute;
  left: 0;  // Aligns the underline to the left of the heading
  bottom: -5px;  // Positions the underline just below the heading
  width: 100%;  // Ensures the underline spans the full width of the heading
  height: 2px;  // Adjusts the thickness of the underline
  background-color: ${({ theme }) => theme.text};  // Matches the color of the text
}
 
  
`;
const Subscriptions = () => {
    const [channels,setChannels]=useState([])
    useEffect(()=>{
        const fetchSubscribed=async()=>{
           try {
             const res=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/subscriptions/subscribed-channels`,{withCredentials:true})
             console.log(res.data.data);
             setChannels(res.data.data);
           } catch (error) {
            console.log('error while getting subscriptions',error)
           }


        }
        fetchSubscribed()
    },[])
  return (
    <>
         
    <VideoContainer>
    <Heading>Subscriptions</Heading> 

      {channels?.map(channel => (
        <ChannelCard key={channel?.channelDetails._id} channel={channel.channelDetails}/>
      ))}
    </VideoContainer>
    </>
  )
}

export default Subscriptions
