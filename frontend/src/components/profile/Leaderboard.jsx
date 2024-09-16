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
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { requestClient } from "@/api/apiClient";
import { FRIENDS_URL, LEADERBOARD_URL, USERS_URL } from "@/api/APIConstants";

function Leaderboard() {
	const [leaderboard, setLeaderboard] = useState([]);

	const getLeaderboard = async (type) => {
		try {
			const response = await requestClient.get(
				`${USERS_URL}/${username}/${FRIENDS_URL}/${LEADERBOARD_URL}/${type}`
			);

			const data = response.data;

			setLeaderboard(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectChange = (value) => {
		getLeaderboard(value);
	};

	return (
		<Card className=" h-4/6 w-2/5 rounded-md shadow-2xl shadow-foreground">
			<CardHeader className="flex flex-row items-center justify-center gap-20 ">
				<div className="text-center font-bold">Leaderboard</div>

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

			<CardContent className="h-full">
				<div className="text-center ">Top 10 between Friends:</div>

				<ScrollArea className="h-3/5 w-full rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username </TableHead>
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
