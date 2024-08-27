import React from "react";

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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const checkEmailAvailable = async (email) => {
	// make an api request here to check if the email is available

	return true;
};

const checkUserAvailable = async (username) => {
	// make an api request here to check if the username is available

	return true;
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

	email: z
		.string()
		.email({
			message: "Invalid email",
		})
		.refine(checkEmailAvailable, {
			message: "Email has already been taken",
		}),
});

const signUpForm = useForm({
	resolver: zodResolver(signUpFormSchema),
	defaultValues: {
		username: "",
		password: "",
		email: "",
	},
});

const signUpFormSubmit = async (values) => {
	// make an api request to create a new user
};

const Signup = () => {
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Signup</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
			</Card>

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
									{/* <FormDescription>This is the username</FormDescription> */}
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
										<Input {...field} type="password" />
									</FormControl>
									{/* <FormDescription>This is the password</FormDescription> */}
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<FormField
						control={signUpForm.control}
						name="email"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} type="email" />
									</FormControl>
									{/* <FormDescription>This is the password</FormDescription> */}
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</form>
			</Form>

			<div className="mt-4 text-center text-sm">
				Already have an account?
				<NavLink to="/login" className="underline">
					Log In
				</NavLink>
			</div>

			<CardContent></CardContent>
		</>
	);
};
