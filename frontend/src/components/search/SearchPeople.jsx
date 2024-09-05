import React from "react";
import { useState, useEffect } from "react";

import { requestClient } from "@/api/apiClient";
import { AuthService } from "@/api/AuthService";

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	CardDescription,
} from "@/components/ui/card";

import { Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { USERS_URL } from "@/api/APIConstants";

export default function SearchPeople() {
	const [searchResults, setSearchResults] = useState([]);

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
				USERS_URL + "/" + e.target.value
			);

			console.log(response.data.users);
			setSearchResults(response.data.users);
		} catch (error) {
			console.error("Search failed " + error.response.data);
		}
	};

	const viewProfile = async (user) => {
		console.log(user);
	};

	return (
		<div className=" w-full flex items-center justify-center">
			<Card className="m-2 w-2/3">
				<CardHeader className="mb-4">
					<div className=" w-full relative ml-auto flex-1 md:grow-0">
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
							<Avatar className="hidden h-9 w-9 sm:flex">
								<AvatarImage
									src="/avatars/01.png"
									alt="Avatar"
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
							<Button>Send Friend Request</Button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
