import React from "react";
import { useState } from "react";

import { SIGNUP_URL, USERS_URL } from "@/Constants";
import { NavLink, useNavigate } from "react-router-dom";

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

import { LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Signup = () => {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const checkUserAvailable = async (username) => {
		try {
			// make an api request here to check if the user exists
			const data = await fetch(`${USERS_URL}/${username}`, {
				method: "GET",
			});

			if (!data.ok) {
				throw new Error("Error acessing user resource");
			}

			const user = await data.json();

			if (Object.keys(user).length > 0) {
				// if asynch validation fails, set is loading to false
				setIsLoading(false);
				return false;
			} else {
				return true;
			}
		} catch (error) {
			console.error(error);
		}
	};

	const signUpFormSubmit = async (values) => {
		setIsLoading(true);

		try {
			let data = await fetch(SIGNUP_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (!data.ok) {
				// print the error message from server
				data = await data.json();

				console.error(data.error);
			}

			console.log(await data.json());

			// redirect to login page
			navigate("/login");
		} catch (error) {
			console.error(error);
		}
	};
	const signUpFormSchema = z.object({
		username: z
			.string()
			.min(1, {
				message: "Username must be at least 1 character",
			})
			.max(20, {
				message: "Username must be at most 20 characters",
			})
			.refine(checkUserAvailable, {
				message: "Username has already been taken",
			}),

		password: z
			.string()
			.min(4, {
				message: "Password must be at least 4 characters",
			})
			.max(20, {
				message: "Password must be at most 20 characters",
			})
			.regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
				message:
					"Password must contain at least one uppercase letter and one special character",
			}),
	});

	const signUpForm = useForm({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Card className=" m-2 flex flex-col gap-4 w-full max-w-xl">
				<CardHeader>
					<CardTitle className="text-2xl">Signup</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>

				<CardContent>
					{" "}
					<Form {...signUpForm}>
						<form
							onSubmit={signUpForm.handleSubmit(signUpFormSubmit)}
							className="flex flex-col gap-2"
						>
							<FormField
								control={signUpForm.control}
								name="username"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												Should be between 4-20
												characters
											</FormDescription>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={signUpForm.control}
								name="password"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="password"
												/>
											</FormControl>
											<FormDescription>
												Should be between 4-20
												characters, must include one
												uppercase and a special
												character
											</FormDescription>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<Button type="submit">
								{isLoading ? (
									<LoaderCircle className="w-10 h-10 animate-spin" />
								) : (
									"Signup"
								)}
							</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<NavLink to="/login" className="underline">
							Log In
						</NavLink>
					</div>
				</CardContent>

				<CardFooter></CardFooter>
			</Card>
		</div>
	);
};

export default Signup;
