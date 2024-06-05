import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchFailure, fetchStart, fetchSuccess } from "../redux/videoSlice";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Recommendation from "../components/Recommendation";
const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
background-color: ${({ subscribed }) => (subscribed ? 'black' : 'red')};
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const Video = () => {
  const {currentUser}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const {currentVideo}=useSelector((state)=>state.video)
  //to extract the video title from the url
  const path=useLocation().pathname.split("/")[2]
  // const [video,setVideo]=useState({})
  const [channel,setChannel]=useState({})

  const [likes,setLikes]=useState(0);
  const[liked,setLiked]=useState(false)
  const[subscribed,setSubscribed]=useState(true)
  
  // console.log("The path is ",path)
  function formatDate(dateString) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${day}, ${year}`;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchStart());
      try {
        const videoRes = await axios.get(`http://localhost:8000/api/v1/videos/${path}`, { withCredentials: true });
        console.log(videoRes.data.data);
        // setVideo(videoRes.data.data);
        dispatch(fetchSuccess(videoRes.data.data));

        const username = videoRes.data.data.owner.username; // Use the returned data directly
        // const channelRes = await axios.get(`http://localhost:8000/api/v1/users/c/${username}`, { withCredentials: true });
        // setChannel(channelRes.data.data);
        // console.log("the channel data is ", channelRes.data.data);
        // setLiked(currentVideo?.isLiked);
        // setLikes(currentVideo?.likedCount)
        // setSubscribed(channel?.isSubscribed)
      } catch (error) {
        dispatch(fetchFailure());
        console.log("error occurred while loading video details:", error);
      }
    };

    fetchData();
  }, [path]); // Dependencies include dispatch and path to ensure proper re-fetching
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        if (currentVideo) {
          const username = currentVideo.owner.username;
          const channelRes = await axios.get(`http://localhost:8000/api/v1/users/c/${username}`, { withCredentials: true });
          setChannel(channelRes.data.data);
          console.log("the channel data is ", channelRes.data.data);
          setLiked(currentVideo.isLiked);
          setLikes(currentVideo.likedCount);
          setSubscribed(channelRes.data.data.isSubscribed);
        }
      } catch (error) {
        console.log("error while fetching channel data", error);
      }
    };

    fetchChannelData();
  }, [currentVideo,subscribed]);
 const channelLink=`/channel/${channel.username}`
  const toggleLike=async()=>{
    try {
      console.log("toggle like being called")
      console.log(currentVideo?._id)
      const result = await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${currentVideo?._id}`,
        {}, // Request body, if needed
        {
          withCredentials: true, // Include cookies
          headers: {
            'Content-Type': 'application/json', // Adjust if needed
            // 'Authorization': `Bearer ${token}`, // Uncomment and adjust if using authorization
          },
        }
      );
      if(liked){
        const l=likes-1
        setLikes(l)
        setLiked(false)
      }else{
        const l=likes+1
        setLikes(l)
        setLiked(true)
      }
      console.log(result.data)
    } catch (error) {
      console.log("error while toggling like")
      
    }
  }
  const toggleSubscribe = async () => {
    try {
      // console.log("toggle subscribe being called");
      const result = await axios.post(`http://localhost:8000/api/v1/subscriptions/c/${channel._id}`, {}, { withCredentials: true });
      // console.log(result.data);

      // if (result.data.success) {
      //   setSubscribed(result.data.subscribed);
      // }
      if(subscribed){
        setSubscribed(false)
      }else{
        setSubscribed(true)
      }
     
    } catch (error) {
      console.log("error while toggling subscription", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };
  return (
    <Container>
      <Content>
        <VideoWrapper>
          <iframe
            width="100%"
            height="720"
            src={currentVideo?.videoFile}
            title={currentVideo?.title}
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views} views • {formatDate(currentVideo?.createdAt)}</Info>
          <Buttons>
           {<Button onClick={toggleLike}>
            {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} {likes}
            </Button>}
            {/* <Button>
              <ThumbDownOffAltOutlinedIcon /> Dislike
            </Button> */}
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Link to={channelLink} style={{textDecoration:"none",color: 'inherit'}}>
            <Image src={channel?.avatar} />
            </Link>
            <ChannelDetail>
            <Link to={channelLink} style={{textDecoration:"none",color: 'inherit'}}>
              <ChannelName>{channel?.username}</ChannelName>
              </Link>
              <ChannelCounter>{channel?.subscribersCount
} subscribers</ChannelCounter>
              <Description>
                {currentVideo?.description}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
    <Subscribe subscribed={subscribed} onClick={toggleSubscribe}>
            {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments/>
      </Content>
    <Recommendation username={channel?.username}/>
    </Container>
  );
};

export default Video;
