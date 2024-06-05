import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
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

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("") 
  const [error,setError]=useState("")
  const [avatar, setAvatar] = useState(null);
  const [coverImage,setCoverImage]=useState(null)
  const [fullName,setFullName]=useState("")
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart())
    try {
      const result = await axios.post('http://localhost:8000/api/v1/users/login', { username, email, password }, { withCredentials: true });
      console.log(result.data.data.user);
      dispatch(loginSuccess(result.data.data.user))
      navigate("/"); // Redirect to home on successful login
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      dispatch(loginFailure())
    }
  };
  const handleAvatar = (e) => {
    e.preventDefault()

    const file = e.target.files[0];
    console.log(file)
    if (file) {
      const fileType = file.type;
      const validFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (validFileTypes.includes(fileType)) {
        console.log(file)
        setAvatar(file);
        console.log(avatar)
        setError(null);
      } else {
        setError('Only PNG, JPG, and PDF files are allowed.');
        setAvatar(null);
      }
    }
  };
  const handleCoverImage = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (validFileTypes.includes(fileType)) {
        setCoverImage(file);
        setError(null);
      } else {
        setError('Only PNG, JPG, and PDF files are allowed.');
        setCoverImage(null);
      }
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('username', username);
    if (avatar) {
      formData.append('avatar', avatar);
    }
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const result = await axios.post("http://localhost:8000/api/v1/users/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(result);
    } catch (error) {
      let errorMessage = 'An error occurred';
    if (error.response) {
      if (error.response.headers['content-type'].includes('text/html')) {
        // Parse the HTML to extract the error message
        const parser = new DOMParser();
        const doc = parser.parseFromString(error.response.data, 'text/html');
        const pre = doc.querySelector('pre');
        if (pre) {
          errorMessage = pre.textContent.trim();
        }
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }
    setError(errorMessage);
   
    }

  };
 
  

  return (
    <Container>
      <Wrapper>
        <Title>Sign in</Title>
        <SubTitle>to continue to YouTube</SubTitle>
        
        <h4>Username or Email</h4>
        <Input placeholder="username" onChange={(e)=>setUsername(e.target.value)} />
        <Input placeholder="email" onChange={(e)=>setEmail(e.target.value)} />
        <Input type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)}/>
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Input placeholder="fullname" onChange={(e)=>setFullName(e.target.value)} />
        <Input placeholder="username" onChange={(e)=>setUsername(e.target.value)}/>
        <Input placeholder="email" onChange={(e)=>setEmail(e.target.value)}/>
        <label htmlFor="fileInput" style={{textAlign:"left"}}> Avatar</label>
        <Input
          type="file"
          id="avatar"
          accept=".png, .jpg, .jpeg, .pdf"
          onChange={handleAvatar}
        />
        <label htmlFor="fileInput">CoverImage (optional)</label>
        <Input
          type="file"
          id="coverImage"
          accept=".png, .jpg, .jpeg, .pdf"
          onChange={handleCoverImage}
        />
        <Input type="password" placeholder="password" onChange={(e)=>setPassword(e.target.value)} />
        <Button onClick={handleRegister}>Sign up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
