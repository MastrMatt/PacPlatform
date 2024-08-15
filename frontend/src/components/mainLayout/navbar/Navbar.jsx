import React from "react";

// css modules is for class names and id's, not for actual html tags

import {
  FaHome,
  FaUser,
  FaInbox,
  FaPlus,
  FaSearch,
  FaConnectdevelop,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "./Navbar.css";

// React state, props are immutable during re-renders, everything in the function is also recom
// puted during re-renders

function Navbar() {
  return (
    <>
      <nav className="navBar">
        <ul className="navBarNav">
          <li className="navBarItem">
            <NavLink to="/home" id="navHomeLinkId" className="navLink" end>
              <FaHome size={35} className="navIcons" />
              <span>Home</span>
            </NavLink>
          </li>

          <li className="navBarItem">
            <NavLink to="/profile" className="navLink" end>
              <FaUser size={35} className="navIcons" />
              <span>Profile</span>
            </NavLink>
          </li>

          <li className="navBarItem">
            <NavLink to="/friendRequests" className="navLink" end>
              <FaInbox className="navIcons" size={35} />
              <span>Requests</span>
            </NavLink>
          </li>

          <li className="navBarItem">
            <NavLink to="/search" className="navLink" end>
              <FaSearch size={35} className="navIcons" />
              <span>Search</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
