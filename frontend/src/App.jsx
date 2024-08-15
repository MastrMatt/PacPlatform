import { useState } from "react";

import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import MainLayout from "./components/mainLayout/MainLayout";
import GameSetup from "./components/gameSetup/GameSetup";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<GameSetup />} />
        {/* <Route path="/friendRequests" element={<friendRequests />} /> */}

        {/* <Route path="/search" element={<Search />} /> */}

        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </MainLayout>
  );
}

export default App;
