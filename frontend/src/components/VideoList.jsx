import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import axios from 'axios';
// import AnotherCard from './AnotherCard';
import AnotherCard from './AnotherCard';

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

const VideoList = ({channel}) => {
    const [videos, setVideos] = useState([]);
    const [refresh,setRefresh]=useState(false);
    useEffect(() => {
        const fetchVideos = async () => {
         try {
             const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/dashboard/videos/${channel?.username}`,{withCredentials:true});
             console.log(res.data.data)
             setVideos(res.data.data);
             setRefresh(false)
         } catch (error) {
            console.log(error)
            console.log("error while fetching channel videos")
         }
        };
        fetchVideos();
      }, [channel,refresh]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/channel/${channel.username}`, { withCredentials: true });
//         setVideos(res.data.videos);
//       } catch (error) {
//         console.error("Error fetching videos", error);
//       }
//     };

//     if (channel) {
//       fetchVideos();
//     }
//   }, [channel]);

const handleDelete = async (videoId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/${videoId}`, { withCredentials: true });
      console.log("Video deleted");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      alert("Failed to delete the comment. Please try again later.");
    }
  };

 

//   if (videos.length === 0) return <div>No videos available.</div>;

  return (
    <>
         
    <VideoContainer>
    <Heading>Videos</Heading> 

      {videos.map(video => (
        <AnotherCard key={video?._id} video={video} handleDelete={handleDelete}/>
      ))}
    </VideoContainer>
    </>
  );
};

export default VideoList;
