import React from "react";
import Navbar from "./navbar/Navbar";

import "./MainLayout.css";

function MainLayout ({children}) { 

    return (
    <>
      <Navbar />
      <main>{children}</main>
    </>     
    );

}

export default MainLayout;
