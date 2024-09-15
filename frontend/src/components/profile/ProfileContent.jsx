import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

function ProfileContent({ user }) {
	return (
		<div className="md:min-w-80 w-2/5 rounded-md shadow-2xl shadow-foreground flex flex-col gap-12">
			<div className="h-1/4 flex flex-row items-center justify-center gap-8">
				<Avatar className="mt-1 w-8 h-8 md:w-16 md:h-16">
					<AvatarImage src={user.imageURL} />
					<AvatarFallback>User Image</AvatarFallback>
				</Avatar>
				<div className="font-bold">{user.username}</div>
			</div>
			<Card className="h-full">
				<CardContent className="flex flex-col">
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Highest Score</TableCell>
								<TableCell>{user.highestScore}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Total Score</TableCell>
								<TableCell>{user.totalScore}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>SPG</TableCell>
								<TableCell>{user.SPG}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProfileContent;