import React from "react";

// css modules is for class names and id's, not for actual html tags
import styles from "./Navbar.module.css"; 

import { FaHome, FaUser, FaInbox, FaPlus, FaSearch, FaConnectdevelop } from "react-icons/fa";
import { NavLink } from "react-router-dom";

// React state, props are immutable during re-renders, everything in the function is also recom
// puted during re-renders

function Navbar() {
  return (
    <>
      <nav className={styles.navBar}>
        
        <ul className={styles.navBarNav}>

          <li className={styles.navBarItem}>
            {/* enter app name for branding */}
            <NavLink to="/" className={styles.navLink}  id= {styles.logoLink} end>
              <h1 className = {styles.logoText}>Connexion</h1>
            </NavLink>
          </li>


          <li className={styles.navBarItem}>
            <NavLink
              to="/Home"
              id={styles.navHomeLinkId}
              className={styles.navLink}
              end
            >
              <FaHome size={35} className = {styles.navIcons}/>
              <span>Home</span>
            </NavLink>

          </li>

          <li className={styles.navBarItem}>
            <NavLink to="/author" className={styles.navLink} end>
              <FaUser size={35} className = {styles.navIcons}/>
              <span>Profile</span>
            </NavLink>
          </li>

          <li className={styles.navBarItem}>
            <NavLink to="/FriendRequests" className={styles.navLink} end>
              <FaInbox className = {styles.navIcons} size={35} />
              <span>Requests</span>
            </NavLink>
          </li>

      
          <li className={styles.navBarItem}>
            <NavLink to="/Post" className={styles.navLink} id = {styles.postId} end>
              <FaPlus size={35} className = {styles.navIcons}/>
              <span>Post</span>
            </NavLink>
          </li>

          <li className={styles.navBarItem}>
            <NavLink to="/Search" className={styles.navLink} end>
              <FaSearch size={35} className = {styles.navIcons}/>
              <span>Search</span>
            </NavLink>
          </li>

          
        
          <li className={styles.navBarItem}>
            <NavLink to="/SearchRemote" className={styles.navLink} end>
              <FaConnectdevelop size={35} className = {styles.navIcons}/>
              <span>Discover</span>
            </NavLink>
          </li>


        </ul>
      </nav>
    </>
  );
}

export default Navbar;
