import { useState } from 'react';

import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";


import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  
  // this is a component
  const MainLayout = ({children}) => (
    <>
      <Navbar />
    </>     

  )

  return (
    <MainLayout/>
  
  )

}

export default App
