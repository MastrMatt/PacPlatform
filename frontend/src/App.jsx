import { useState } from "react";

import {
	Route,
	Routes,
	Navigate,
	useLocation,
	useNavigate,
} from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import MainLayout from "./components/mainLayout/MainLayout";
import GameSetup from "./components/gameSetup/GameSetup";

function App() {
	const location = useLocation();

	const AuthLayout = ({ children }) => {
		return <>{children}</>;
	};

	const DefaultLayout = ({ children }) => {
		return <MainLayout>{children}</MainLayout>;
	};

	const Layout =
		location.pathname == "/login" || location.pathname == "/signup"
			? AuthLayout
			: DefaultLayout;

	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/home" element={<GameSetup />} />
				{/* <Route path="/friendRequests" element={<friendRequests />} /> */}

				{/* <Route path="/search" element={<Search />} /> */}

				{/* <Route path="/profile" element={<Profile />} /> */}
			</Routes>
		</Layout>
	);
}

export default App;
