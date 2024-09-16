import React from "react";

import { useState, useEffect } from "react";

import { AuthService } from "@/api/AuthService";
import { requestClient } from "@/api/apiClient";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";

import { Check } from "lucide-react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	FRIEND_REQUESTS_URL,
	FRIENDS_URL,
	USERS_URL,
} from "@/api/APIConstants";

// function to make a friend request
async function makeFriendRequest(username, requestUsername) {
	try {
		const response = await requestClient.post(
			`/friendRequests/${username}`,
			{
				requestUsername: requestUsername,
			}
		);

		return response.data.message;
	} catch (error) {
		console.error("Make friend request failed " + error);
	}
}

export default function FriendRequests() {
	const [friendRequests, setFriendRequests] = useState([]);
	const [username, setUsername] = useState(() =>
		localStorage.getItem("username")
	);

	const getFriendRequests = async () => {
		try {
			const response = await requestClient.get(
				`${USERS_URL}/${username}${FRIEND_REQUESTS_URL}`
			);

			setFriendRequests(response.data.friendRequests);
		} catch (error) {
			console.error("Get friend requests failed " + error);
		}
	};

	useEffect(() => {
		try {
			AuthService.checkAuth();
			getFriendRequests();
		} catch (error) {
			console.error("Check auth failed " + error);
		}
	}, [username]);

	const acceptFriendRequest = (requestUsername) => async () => {
		try {
			await requestClient.post(`${USERS_URL}/${username}${FRIENDS_URL}`, {
				requestUsername,
			});

			// refresh friend requests
			getFriendRequests();
		} catch (error) {
			console.error("Accept friend request failed " + error);
		}
	};

	const rejectFriendRequest = (requestUsername) => async () => {
		try {
			await requestClient.delete(
				`${USERS_URL}/${username}${FRIEND_REQUESTS_URL}`,
				{
					requestUsername,
				}
			);

			// refresh friend requests
			getFriendRequests();
		} catch (error) {
			console.error("Reject friend request failed " + error);
		}
	};

	return (
		<div className=" w-full flex items-center justify-center">
			<Card className="m-2 w-2/3">
				<CardHeader className="mb-4">
					<CardTitle className="text-center">
						Friend Requests
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-8">
					{friendRequests.map((requestUsername) => (
						<div className="flex items-center gap-4">
							<Avatar className="hidden h-9 w-9 sm:flex">
								<AvatarImage
									src={requestUsername.imageURL}
									alt="Avatar"
								/>
								<AvatarFallback>
									{requestUsername.username.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid gap-1">
								<p className="text-sm font-medium leading-none">
									{requestUsername.username}
								</p>
							</div>
							<Button
								variant="ghost"
								className="ml-auto"
								onClick={acceptFriendRequest(requestUsername)}
							>
								<Check color="green" />
							</Button>
							<Button
								variant="ghost"
								onClick={rejectFriendRequest(requestUsername)}
							>
								<X color="red" />
							</Button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
