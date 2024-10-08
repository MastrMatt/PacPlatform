import React, { useEffect } from "react";
import { useState } from "react";

import { AuthService } from "@/api/AuthService";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { BACKEND_URL } from "@/api/APIConstants";
import { io } from "socket.io-client";

import Game from "../game/Game";
import { Loader2 } from "lucide-react";

function GameSetup() {
	const [socket, setSocket] = useState(() => io(BACKEND_URL));
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		try {
			AuthService.checkAuth();
		} catch (error) {
			console.error("Check auth failed " + error.response.data);
		}
	}, []);

	const [roomID, setRoomID] = useState(null);
	const [gameType, setGameType] = useState(null);
	const [numPlayers, setNumPlayers] = useState(0);

	const [startGame, setStartGame] = useState(false);

	const roomIDAvailable = (roomID) => {
		return new Promise((resolve, reject) => {
			// Listen for the server's response
			socket.once("roomIDAvailabilityResponse", (isAvailable) => {
				if (isAvailable) {
					resolve(true);
				} else {
					resolve(false);
				}
			});

			// Emit the event to check room ID availability
			socket.emit("checkRoomID", roomID);

			// Set a timeout for the server to respond
			setTimeout(() => {
				reject(new Error("Server did not respond in time"));
			}, 5000); // 5 second timeout
		});
	};

	const roomIDCreated = async (roomID) => {
		return new Promise((resolve, reject) => {
			// Listen for the server's response
			socket.once("roomIDCreatedResponse", (isCreated) => {
				if (isCreated) {
					resolve(true);
				} else {
					resolve(false);
				}
			});

			// Emit the event to check room ID availability
			socket.emit("checkCreatedRoomID", roomID);

			// Set a timeout for the server to respond
			setTimeout(() => {
				reject(new Error("Server did not respond in time"));
			}, 5000); // 5 second timeout
		});
	};

	// 1. Define form schema
	const createFormSchema = z.object({
		roomID: z
			.string()
			.min(1, {
				message: "Room ID must be at least 1 character",
			})
			.refine(
				async (roomID) => {
					try {
						return await roomIDAvailable(roomID);
					} catch (error) {
						// Handle any errors (e.g., timeout)
						console.error(
							"Error checking room availability:",
							error
						);
						return false;
					}
				},
				{
					message: "Room ID is not available",
				}
			),
		numPlayers: z.coerce
			.number({
				message: "Number of players must be a number",
			})
			.min(1, {
				message: "Number of players must be > 1",
			})
			.max(4, {
				message: "Number of players must be < 4",
			}),
	});

	const joinFormSchema = z.object({
		roomID: z
			.string()
			.min(1, {
				message: "Room ID must be at least 1 character",
			})
			.refine(
				async (roomID) => {
					try {
						return await roomIDCreated(roomID);
					} catch (error) {
						// Handle any errors (e.g., timeout)
						console.error(
							"Error checking room availability:",
							error
						);
						return false;
					}
				},
				{
					message: "Room ID has not been created",
				}
			),
	});

	// 2. instantiate the form using the schema, default values are a must
	const createForm = useForm({
		resolver: zodResolver(createFormSchema),
		defaultValues: {
			roomID: "",
			numPlayers: 2,
		},
	});

	const joinForm = useForm({
		resolver: zodResolver(joinFormSchema),
		defaultValues: {
			roomID: "",
		},
	});

	// 3. need a submit handler if validation passes
	const createFormSubmit = (values) => {
		setIsLoading(true);
		setRoomID(values.roomID);
		setNumPlayers(values.numPlayers);
		setGameType("create");
		setStartGame(true);
	};

	const joinFormSubmit = (values) => {
		setIsLoading(true);
		setRoomID(values.roomID);
		setGameType("join");
		setStartGame(true);
	};

	return startGame ? (
		<Game
			socket={socket}
			setStartGame={setStartGame}
			gameType={gameType}
			roomID={roomID}
			numPlayers={numPlayers}
		/>
	) : (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<Card className="w-full max-w-3xl m-4">
				<CardHeader>
					<CardTitle className="text-center">Create Game</CardTitle>
					{/* <CardDescription>
            Enter your email below to login to your account.
          </CardDescription> */}
				</CardHeader>
				<CardContent>
					<Form {...createForm}>
						<form
							onSubmit={createForm.handleSubmit(createFormSubmit)}
							className="flex flex-col gap-2"
						>
							<FormField
								control={createForm.control}
								name="roomID"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>RoomID</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											{/* <FormDescription>This is the room id</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={createForm.control}
								name="numPlayers"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>
												Number of Players
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="number"
												/>
											</FormControl>
											{/* <FormDescription>This is the room id</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<Button type="submit">
								{isLoading ? (
									<Loader2 className="w-10 h-10 animate-spin">
										{" "}
									</Loader2>
								) : (
									"Create"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
					{/* <Button className="w-full">Sign in</Button> */}
				</CardFooter>
			</Card>
			<h1 className="font-bold text-center">Or</h1>
			<Card className="w-full max-w-3xl m-4">
				<CardHeader>
					<CardTitle className="text-center">Join Game</CardTitle>
					{/* <CardDescription>
            Enter your email below to login to your account.
          </CardDescription> */}
				</CardHeader>
				<CardContent>
					<Form {...joinForm}>
						<form
							onSubmit={joinForm.handleSubmit(joinFormSubmit)}
							className="flex flex-col gap-2"
						>
							<FormField
								control={joinForm.control}
								name="roomID"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>RoomID</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											{/* <FormDescription>This is the room id</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<Button type="submit">
								{isLoading ? (
									<Loader2 className="w-10 h-10 animate-spin">
										{" "}
									</Loader2>
								) : (
									"Join"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter>
					{/* <Button className="w-full">Sign in</Button> */}
				</CardFooter>
			</Card>
		</div>
	);
}

export default GameSetup;
