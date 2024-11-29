import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Screens/LandingPage";
import ChatInitial from "./Screens/ChatInitial";

import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";
import Chat from "./Screens/Chat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatInitial />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
