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
	useEffect(() => {
		try {
			AuthService.checkAuth();
		} catch (error) {
			console.error("Check auth failed " + error);
		}
	}, []);

	return (
		<div className=" w-full flex items-center justify-center">
			<Card className="m-2 w-2/3">
				<CardHeader className="mb-4">
					<CardTitle className="text-center">
						Friend Requests
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-8">
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/01.png" alt="Avatar" />
							<AvatarFallback>OM</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Olivia Martin
							</p>
							<p className="text-sm text-muted-foreground">
								olivia.martin@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/02.png" alt="Avatar" />
							<AvatarFallback>JL</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Jackson Lee
							</p>
							<p className="text-sm text-muted-foreground">
								jackson.lee@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/03.png" alt="Avatar" />
							<AvatarFallback>IN</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Isabella Nguyen
							</p>
							<p className="text-sm text-muted-foreground">
								isabella.nguyen@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/04.png" alt="Avatar" />
							<AvatarFallback>WK</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								William Kim
							</p>
							<p className="text-sm text-muted-foreground">
								will@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/05.png" alt="Avatar" />
							<AvatarFallback>SD</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Sofia Davis
							</p>
							<p className="text-sm text-muted-foreground">
								sofia.davis@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/05.png" alt="Avatar" />
							<AvatarFallback>SD</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Sofia Davis
							</p>
							<p className="text-sm text-muted-foreground">
								sofia.davis@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
					<div className="flex items-center gap-4">
						<Avatar className="hidden h-9 w-9 sm:flex">
							<AvatarImage src="/avatars/05.png" alt="Avatar" />
							<AvatarFallback>SD</AvatarFallback>
						</Avatar>
						<div className="grid gap-1">
							<p className="text-sm font-medium leading-none">
								Sofia Davis
							</p>
							<p className="text-sm text-muted-foreground">
								sofia.davis@email.com
							</p>
						</div>
						<Button variant="ghost" className="ml-auto">
							<Check color="green" />
						</Button>
						<Button variant="ghost">
							<X color="red" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
