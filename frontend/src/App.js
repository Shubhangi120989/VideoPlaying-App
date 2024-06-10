import { useState, useEffect } from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
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
import History from "./pages/History";

// Global styles with media queries for device pixel ratios
const GlobalStyle = createGlobalStyle`
  @media only screen and (-webkit-min-device-pixel-ratio: 2),
         only screen and (min--moz-device-pixel-ratio: 2),
         only screen and (-o-min-device-pixel-ratio: 2/1),
         only screen and (min-device-pixel-ratio: 2),
         only screen and (min-resolution: 192dpi),
         only screen and (min-resolution: 2dppx) {
    body {
      font-size: 0.875rem; /* Example adjustment for high-DPI displays */
    }
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 3),
         only screen and (min--moz-device-pixel-ratio: 3),
         only screen and (-o-min-device-pixel-ratio: 3/1),
         only screen and (min-device-pixel-ratio: 3),
         only screen and (min-resolution: 288dpi),
         only screen and (min-resolution: 3dppx) {
    body {
      font-size: 0.75rem; /* Example adjustment for higher-DPI displays */
    }
  }
`;

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding: 22px 96px;

  @media only screen and (-webkit-min-device-pixel-ratio: 2),
         only screen and (min--moz-device-pixel-ratio: 2),
         only screen and (-o-min-device-pixel-ratio: 2/1),
         only screen and (min-device-pixel-ratio: 2),
         only screen and (min-resolution: 192dpi),
         only screen and (min-resolution: 2dppx) {
    padding: 18px 72px; /* Adjust padding for high-DPI displays */
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 3),
         only screen and (min--moz-device-pixel-ratio: 3),
         only screen and (-o-min-device-pixel-ratio: 3/1),
         only screen and (min-device-pixel-ratio: 3),
         only screen and (min-resolution: 288dpi),
         only screen and (min-resolution: 3dppx) {
    padding: 16px 64px; /* Adjust padding for higher-DPI displays */
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/current-user`,
          { withCredentials: true }
        );
        if (currentUser) {
          dispatch(loginSuccess(currentUser.data.data));
        }
      } catch (error) {
        console.log("error occurred while fetching");
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="history" element={<History />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="channel">
                  <Route path=":id" element={<ChannelStats />} />
                </Route>
                <Route path="search">
                  <Route path=":id" element={<Search />} />
                </Route>
                <Route path="subscriptions" element={<Subscriptions />} />
                <Route path="video">
                  <Route path=":id" element={<Video />} />
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
