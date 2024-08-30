import { useState, useEffect } from "react";

import { AuthService } from "@/api/AuthService";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const invoices = [
	{
		invoice: "INV001",
		paymentStatus: "Paid",
		totalAmount: "$250.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV002",
		paymentStatus: "Pending",
		totalAmount: "$150.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV003",
		paymentStatus: "Unpaid",
		totalAmount: "$350.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV004",
		paymentStatus: "Paid",
		totalAmount: "$450.00",
		paymentMethod: "Credit Card",
	},
	{
		invoice: "INV005",
		paymentStatus: "Paid",
		totalAmount: "$550.00",
		paymentMethod: "PayPal",
	},
	{
		invoice: "INV006",
		paymentStatus: "Pending",
		totalAmount: "$200.00",
		paymentMethod: "Bank Transfer",
	},
	{
		invoice: "INV007",
		paymentStatus: "Unpaid",
		totalAmount: "$300.00",
		paymentMethod: "Credit Card",
	},
];

import { Button } from "@/components/ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Car } from "lucide-react";

export default function Profile() {
	const [username, setUsername] = useState(() =>
		localStorage.getItem("username")
	);

	useEffect(() => {
		try {
			AuthService.checkAuth();
		} catch (error) {
			console.error("Check auth failed " + error.response.data);
		}
	}, []);

	const handleSelectChange = (value) => {
		console.log(value);
	};

	return (
		<div className="w-full h-screen flex flex-col items-center justify-evenly md:flex-row gap-10">
			<div className=" m-1 h-2/3 w-2/5 rounded-md border-2 border-foreground shadow-2xl shadow-foreground">
				<div className=" h-1/4 flex flex-row align-center justify-center gap-8 ">
					<Avatar className="h-15 w-15 ">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>Your Image</AvatarFallback>
					</Avatar>
					<div className="font-bold my-auto">{username}</div>
				</div>
				<Separator className="my-4 bg-black" />
				<Table>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow key={invoice.invoice}>
								<TableCell className="font-medium">
									{invoice.invoice}
								</TableCell>
								<TableCell>{invoice.paymentStatus}</TableCell>
								<TableCell>{invoice.paymentMethod}</TableCell>
								<TableCell className="text-right">
									{invoice.totalAmount}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3}>Total</TableCell>
							<TableCell className="text-right">
								$2,500.00
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>

				<div className="flex flex-col "></div>
			</div>

			<div className="m-1 p-2 h-2/3 w-2/5 rounded-md border-2 border-foreground shadow-2xl shadow-foreground">
				<div className="p-6 flex flex-row items-center justify-center gap-20 border-b-2">
					<div className="text-center pb-4 ">Leaderboard</div>

					<Select onValueChange={handleSelectChange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a fruit" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fruits</SelectLabel>
								<SelectItem value="apple">Apple</SelectItem>
								<SelectItem value="banana">Banana</SelectItem>
								<SelectItem value="blueberry">
									Blueberry
								</SelectItem>
								<SelectItem value="grapes">Grapes</SelectItem>
								<SelectItem value="pineapple">
									Pineapple
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col h-full">
					<ScrollArea className="h-2/3 w-full rounded-md border">
						<Table>
							<TableCaption>
								A list of your recent invoices.
							</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">
										Invoice
									</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Method</TableHead>
									<TableHead className="text-right">
										Amount
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((invoice) => (
									<TableRow key={invoice.invoice}>
										<TableCell className="font-medium">
											{invoice.invoice}
										</TableCell>
										<TableCell>
											{invoice.paymentStatus}
										</TableCell>
										<TableCell>
											{invoice.paymentMethod}
										</TableCell>
										<TableCell className="text-right">
											{invoice.totalAmount}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={3}>Total</TableCell>
									<TableCell className="text-right">
										$2,500.00
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
