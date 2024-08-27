import React from "react";

import { LOGIN_URL } from "@/Constants";

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

import { LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginFormSubmit = (values) => {};

const Login = () => {
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

	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Card className="m-2 w-full flex flex-col gap-4 max-w-xl">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your information below to login to your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					{" "}
					<Form {...loginForm}>
						<form
							onSubmit={loginForm.handleSubmit(loginFormSubmit)}
							className="flex flex-col gap-2"
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
												<Input
													{...field}
													type="password"
												/>
											</FormControl>
											{/* <FormDescription>This is the password</FormDescription> */}
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<LoaderCircle className="w-10 h-10 animate-spin" />

							<Button type="submit">Login</Button>
						</form>
					</Form>
					<div className="mt-4 text-center text-sm">
						Don't have an account?{" "}
						<NavLink to="/signup" className="underline">
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
