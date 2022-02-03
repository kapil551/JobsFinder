import './App.css';
import { Button } from '@chakra-ui/react';
import { Routes, Route, Link } from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="bg-blue-300 p-4 text-center">
      Let us connect
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
