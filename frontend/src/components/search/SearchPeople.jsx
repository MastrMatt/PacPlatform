import React from "react";
import { useState, useEffect } from "react";

import { requestClient } from "@/api/apiClient";
import { AuthService } from "@/api/AuthService";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { USERS_SEARCH_URL, USERS_URL } from "@/api/APIConstants";

import Profile from "../profile/Profile";

// Import Dialog components
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

export default function SearchPeople() {
	const [searchResults, setSearchResults] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [sentRequests, setSentRequests] = useState({});

	useEffect(() => {
		try {
			AuthService.checkAuth();
		} catch (error) {
			console.error("Check auth failed " + error.response.data);
		}
	}, []);

	const handleSearch = async (e) => {
		if (e.target.value === "") {
			setSearchResults([]);
			return;
		}

		try {
			const response = await requestClient.get(
				USERS_URL + USERS_SEARCH_URL + "/" + e.target.value
			);

			console.log(response.data.users);
			setSearchResults(response.data.users);
		} catch (error) {
			console.error("Search failed " + error.response.data);
		}
	};

	const viewProfile = async (user) => {
		try {
			const response = await requestClient.get(
				USERS_URL + "/" + user.username
			);
			setSelectedUser(response.data);
			setIsDialogOpen(true);
		} catch (error) {
			console.error(
				"Failed to fetch user profile: " + error.response.data
			);
		}
	};

	const sendFriendRequest = async (user) => {
		const requestUsername = localStorage.getItem("username");

		try {
			const response = await requestClient.post(
				USERS_URL + "/" + user.username + "/friendRequests",
				{ requestUsername }
			);

			console.log(response.data);
			setSentRequests((prev) => ({ ...prev, [user.username]: true }));
		} catch (error) {
			if (error.response && error.response.status === 409) {
				// Handle the case where users are already friends
				console.log("Friend request already sent");
				setSentRequests((prev) => ({ ...prev, [user.username]: true }));
			} else {
				console.error("Friend request failed " + error.response.data);
			}
		}
	};

	return (
		<div className="w-full flex items-center justify-center">
			<Card className="m-2 w-2/3">
				<CardHeader className="mb-4">
					<div className="w-full relative ml-auto flex-1 md:grow-0">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search for People ..."
							className="w-full rounded-lg bg-background pl-8"
							onChange={handleSearch}
						/>
					</div>
				</CardHeader>
				<CardContent className="grid gap-8">
					{searchResults.map((user) => (
						<div
							key={user.username}
							className="flex items-center gap-4"
						>
							<Avatar className="h-9 w-9">
								<AvatarImage
									src={user.imageURL}
									alt={user.username}
								/>
								<AvatarFallback>
									{user.username.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<p className="text-sm font-medium leading-none">
									{user.username}
								</p>
							</div>
							<Button
								className="ml-auto"
								onClick={() => viewProfile(user)}
							>
								View
							</Button>
							<Button
								onClick={() => sendFriendRequest(user)}
								disabled={sentRequests[user.username]}
								className={
									sentRequests[user.username]
										? "bg-green-500 hover:bg-green-600"
										: ""
								}
							>
								{sentRequests[user.username]
									? "Previously Sent"
									: "Send Friend Request"}
							</Button>
						</div>
					))}
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px] w-100">
					<DialogHeader>
						<DialogTitle>User Profile</DialogTitle>
						<DialogDescription>
							View detailed information about this user.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-center items-center w-full">
						{selectedUser && (
							<Profile user={selectedUser} isPersonal={false} />
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
