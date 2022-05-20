import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import JobsPage from "./pages/JobsPage";
import ResourcesPage from "./pages/ResourcesPage";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import CreateJobs from "./components/Admin/CreateJobs";
import MyJobs from "./components/Admin/MyJobs";
import JobApplications from "./components/Admin/JobApplications";
import Navbar from "./components/Navbar";
import {ChatState} from "./Context/ChatProvider";
import CreateResources from "./components/Admin/CreateResources";
import MyResources from "./components/Admin/MyResources";
import Header from "./components/Admin/Header";

function App() {

  const {user} = ChatState();
  console.log('user', user);
  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>
      <div className="App">
        {user != null && <Navbar />}
        {user != null && user._id === "6282b84e22de0cdcf16c17d2" && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/code" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
          {/* Admin Paths */}
          <Route exact path="/addjob" element={<CreateJobs />} />
          <Route exact path="/myjobs" element={<MyJobs />} />
          <Route exact path="/job/applications/:jobId" element={<JobApplications />} />
          <Route exact path="/addresources" element={<CreateResources />} />
          <Route exact path="/myresources" element={<MyResources />} />
          {/* Admin Paths */}
        </Routes>
      </div>
    </>
  );
}

export default App;
