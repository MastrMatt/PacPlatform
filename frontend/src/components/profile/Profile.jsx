import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
function Profile({ user }) {
	return (
		<div className="w-2/5 rounded-md shadow-2xl shadow-foreground flex flex-col gap-12">
			<div className="h-1/4 flex flex-row items-center justify-center gap-8">
				<Avatar className="mt-1 w-8 h-8 md:w-16 md:h-16">
					<AvatarImage src={user.imageURL} />
					<AvatarFallback>Your Image</AvatarFallback>
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
				<CardFooter className="flex flex-row justify-center">
					<Button>Sign Out</Button>
				</CardFooter>
			</Card>
		</div>
	);
}

export default Profile;
