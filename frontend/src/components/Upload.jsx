import React, { useState } from 'react'
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1001;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Label = styled.label`
  font-size: 14px;
`;
const Upload = ({setOpen}) => {
    const navigate = useNavigate();
  const [videoPerc, setVideoPerc] = useState(0);
  const [imgPerc, setImgPerc] = useState(0);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (videoFile) {
      formData.append("videoFile", videoFile);
    }
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/v1/videos/", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (formData.get('videoFile')) {
            setVideoPerc(percentage);
          }
          if (formData.get('thumbnail')) {
            setImgPerc(percentage);
          }
        },
      });
      console.log("Video uploaded successfully", res.data);
      setOpen(false);
      navigate("/"); // Redirect to home after successful upload
    } catch (error) {
      console.error("Error uploading video data", error);
    }
  };
  return (
    <Container>
    <Wrapper>
      <Close onClick={() => setOpen(false)}>X</Close>
      <Title>Upload a New Video</Title>
      <Label>Video:</Label>
      {videoPerc > 0 ? (
        "Uploading: " + videoPerc + "%"
      ) : (
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
      )}
      <Input
        type="text"
        placeholder="Title"
        name="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <Desc
        placeholder="Description"
        name="description"
        rows={8}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Label>Thumbnail:</Label>
      {imgPerc > 0 ? (
        "Uploading: " + imgPerc + "%"
      ) : (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
      )}
      <Button onClick={handleUpload}>Upload</Button>
    </Wrapper>
  </Container>
  )
}

export default Upload
