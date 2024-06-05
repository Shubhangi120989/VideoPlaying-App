import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendation = ({username}) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
     try {
         const res = await axios.get(`http://localhost:8000/api/v1/dashboard/videos/${username}`,{withCredentials:true});
         console.log(res.data.data)
         setVideos(res.data.data);
     } catch (error) {
        console.log(error)
        console.log("error while fetching recommendation")
     }
    };
    fetchVideos();
  }, [username]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendation;