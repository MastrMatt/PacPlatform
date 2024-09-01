import React from "react";
import { useState } from "react";

import { AuthService } from "@/api/AuthService";
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

	const signUpFormSubmit = async ({ username, password, imageURL }) => {
		setIsLoading(true);

		try {
			await AuthService.signup(username, password, imageURL);

			// navigate to the login page
			navigate("/login");
		} catch (error) {
			console.error(error.response.data);
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
			.refine(AuthService.checkUserAvailable, {
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

		imageURL: z.string().optional(),
	});

	const signUpForm = useForm({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			username: "",
			password: "",
			imageURL:
				"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
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
							<FormField
								control={signUpForm.control}
								name="imageURL"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Image URL</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												URL for your profile image
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
