import React, { useState } from "react";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { requestClient } from "@/api/apiClient";
import { FRIENDS_URL, LEADERBOARD_URL, USERS_URL } from "@/api/APIConstants";

function Leaderboard() {
	const [username, setUsername] = useState(() =>
		localStorage.getItem("username")
	);

	const [leaderboard, setLeaderboard] = useState([]);

	const getLeaderboard = async (type) => {
		try {
			const response = await requestClient.get(
				`${USERS_URL}/${username}${FRIENDS_URL}${LEADERBOARD_URL}/${type}`
			);

			const data = response.data;

			setLeaderboard(data.leaderboard);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectChange = (value) => {
		getLeaderboard(value);
	};

	return (
		<Card className="w-full md:w-2/5 max-w-md h-[500px] rounded-md shadow-2xl shadow-foreground flex flex-col">
			<CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 p-4 md:p-6">
				<div className="text-center font-bold text-lg md:text-xl">
					Leaderboard
				</div>
				<Select onValueChange={handleSelectChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select filter" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Filter Type</SelectLabel>
							<SelectItem value="highestScore">
								High Score
							</SelectItem>
							<SelectItem value="totalScore">
								Total Score
							</SelectItem>
							<SelectItem value="SPG">SPG</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</CardHeader>

			<CardContent className="flex-grow p-4 md:p-6 flex flex-col">
				<div className="text-center mb-4">Top 10 between Friends:</div>
				<ScrollArea className="flex-grow w-full rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username</TableHead>
								<TableHead>Value</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{leaderboard.map((user) => (
								<TableRow key={user.username}>
									<TableCell className="font-medium">
										{user.username}
									</TableCell>
									<TableCell>{user.value}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}

export default Leaderboard;
