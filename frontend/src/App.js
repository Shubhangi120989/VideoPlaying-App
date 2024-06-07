import { useState,useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { loginSuccess } from "./redux/userSlice";
import Search from "./pages/Search";
import ChannelStats from "./components/ChannelStats";
import Subscriptions from "./components/Subscriptions";
import History from "./pages/History"

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch=useDispatch();
  const {currentUser}=useSelector((state)=>state.user)
  useEffect(()=>{
    const fetchUser=async()=>{
      try {
        const currentUser=await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/current-user`, { withCredentials: true } )
        // console.log("the current user is: ",currentUser.data.data.fullName)
        if(currentUser){
          dispatch(loginSuccess(currentUser.data.data))

        }
        
        
      } catch (error) {
        console.log("error occured while fetching")
      }
    }
    fetchUser()
  },[])

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home/>} />
                  <Route path='history' element={<History/>}/>
                  <Route path="signin" element={<SignIn />} />
                  <Route path="channel" >
                  <Route path=":id" element={<ChannelStats/>}></Route>
                  </Route>
                  {/* <Route path="me" element=<{}></Route> */}
                  <Route path="search">
                    <Route path=":id" element={<Search />}></Route>
                  

                  </Route >
                  <Route path="subscriptions" element={<Subscriptions/>}/> 
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
