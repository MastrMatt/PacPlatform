/**
 * Login component for user authentication.
 *
 * @returns {JSX.Element} The rendered Login component.
 */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthService } from "@/api/AuthService";

import { NavLink } from "react-router-dom";
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

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	const loginFormSchema = z.object({
		username: z.string().max(20, {
			message: "Username cannot be more than 20 characters",
		}),

		password: z.string().max(20, {
			message: "Password must be at most 20 characters",
		}),
	});

	const loginForm = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const loginFormSubmit = async ({ username, password }) => {
		setIsLoading(true);

		try {
			const response = await AuthService.login(username, password);

			// set the response data in local storage
			localStorage.setItem("username", response.data.username);

			// navigate to the home page if successful
			navigate("/home");
		} catch (error) {
			if (
				error?.response?.status === 401 ||
				error?.response?.status === 403
			) {
				setLoginError(
					"Incorrect username or password. Please try again."
				);
			} else {
				setLoginError("An error occurred. Please try again later.");
			}

			console.error(error);
			loginForm.reset();
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full min-h-screen flex justify-center items-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl sm:text-3xl">
						Login
					</CardTitle>
					<CardDescription className="text-sm sm:text-base">
						Enter your information below to login to your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					{loginError && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{loginError}</AlertDescription>
						</Alert>
					)}
					<Form {...loginForm}>
						<form
							onSubmit={loginForm.handleSubmit(loginFormSubmit)}
							className="flex flex-col gap-4"
						>
							<FormField
								control={loginForm.control}
								name="username"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											{/* <FormDescription>This is the username</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={loginForm.control}
								name="password"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														{...field}
														type={showPassword ? "text" : "password"}
													/>
													<button
														type="button"
														className="absolute inset-y-0 right-0 pr-3 flex items-center"
														onClick={() => setShowPassword(!showPassword)}
													>
														{showPassword ? (
															<EyeOff className="h-4 w-4 text-gray-500" />
														) : (
															<Eye className="h-4 w-4 text-gray-500" />
														)}
													</button>
												</div>
											</FormControl>
											{/* <FormDescription>This is the password</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<Button type="submit" className="w-full">
								{isLoading ? (
									<>
										<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
										Logging in...
									</>
								) : (
									"Login"
								)}
							</Button>
						</form>
					</Form>
					<div className="mt-6 text-center text-sm sm:text-base">
						Don't have an account?{" "}
						<NavLink to="/signup" className="underline leading-loose py-1">
							Sign up
						</NavLink>
					</div>
				</CardContent>

				<CardFooter></CardFooter>
			</Card>
		</div>
	);
};

export default Login;
