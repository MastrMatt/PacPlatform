import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/api/AuthService";
import { useNavigate } from "react-router-dom";

function Profile({ user, isPersonal }) {
	const navigate = useNavigate();

	const handleSignout = async () => {
		try {
			await AuthService.logout();
			// Redirect to login page after successful sign-out
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
			// You might want to show an error message to the user here
		}
	};

	return (
		<div className="w-full md:w-4/5 max-w-md rounded-md shadow-2xl shadow-foreground flex flex-col gap-6 md:gap-12">
			<div className="h-1/4 flex flex-row items-center justify-center gap-4 md:gap-8">
				<Avatar className="mt-1 w-12 h-12 md:w-16 md:h-16">
					<AvatarImage src={user.imageURL} />
					<AvatarFallback>Your Image</AvatarFallback>
				</Avatar>
				<div className="font-bold text-lg md:text-xl">
					{user.username}
				</div>
			</div>
			<Card className="h-full">
				<CardContent className="flex flex-col p-4 md:p-6">
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
				<CardFooter className="flex flex-row justify-center p-4 md:p-6">
					{isPersonal && (
						<Button onClick={handleSignout}>Sign Out</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}

export default Profile;
