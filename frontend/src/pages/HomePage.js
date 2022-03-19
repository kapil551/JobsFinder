import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";

const HomePage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <>
      <div className="min-w-screen min-h-screen bg-white sm:flex items-center justify-center">
      <Container
          maxW="92%"
          className="bg-[#6749DC] text-white text-center text-3xl sm:hidden flex items-center justify-center h-[4rem] sm:h-screen sm:rounded-none rounded-md mt-3"
      >
          Let us connect 
        </Container>
        <Container className="">
          <Box className="bg-gray-100 my-4 p-4 sm:rounded-none rounded-md">
            <Tabs variant="soft-rounded">
              <TabList className="mb-1">
                <Tab className="w-1/2">Login</Tab>
                <Tab className="w-1/2">Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <SignUp />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
        <Container
          maxW="92%"
          className="bg-[#6749DC] text-white text-center text-4xl hidden sm:flex items-center justify-center h-[16rem] sm:h-screen sm:rounded-none rounded-md"
        >
          Let us connect
        </Container>
      </div>
    </>
  );
};

export default HomePage;
