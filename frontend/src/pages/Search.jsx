import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
  const [videos, setVideos] = useState([]);
  const query = useLocation().pathname.split("/")[2];
  console.log(query)

  useEffect(() => {
    const fetchVideos = async () => {
     try {
         const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/videos/search?search=${query}`);
         console.log(res.data.data)
         setVideos(res.data.data);
     } catch (error) {
        console.log(error)
        console.log('error while getting searched video')
     }
    };
    fetchVideos();
  }, [query]);

  return <Container>
    {videos.map(video=>(
      <Card key={video._id} video={video}/>
    ))}
  </Container>;
};

export default Search;