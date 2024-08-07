import { useState } from 'react';

import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";


import "./App.css";

import MainLayout from "./components/mainLayout/MainLayout"
import Game from "./components/game/Game"

function App() {
  
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/Home" element={<Game/>} />

        {/* <Route path="/FriendRequests" element={<FollowRequests />} /> */}

        {/* <Route path="/Post" element={<Posting />} /> */}

        {/* <Route path="/Search" element={<AuthorSearch />} /> */}

        {/* <Route path="/SearchRemote" element={<SearchRemote />} /> */}

        {/* <Route path = "/HomeRemote" element = {<HomeRemote />} /> */}

      
      </Routes>
    </MainLayout>
  )

}

export default App
