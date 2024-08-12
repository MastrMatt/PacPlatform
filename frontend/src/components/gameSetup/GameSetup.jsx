import React from "react";
import { useState, useEffect, useRef } from "react";

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

import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { io } from "socket.io-client";
import { Navigate, useNavigate } from "react-router-dom";
import Game from "../game/Game";

function GameSetup() {
  const [roomID, setRoomID] = useState(null);
  const [numPlayers, setNumPlayers] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const navigate = useNavigate();

  const roomIDAvailable = async (roomID) => {
    // TODO: Check if roomID is available
    return true;
  };

  const roomIDCreated = async (roomID) => {
    // TODO: Check if roomID has already been created

    return true;
  };

  // 1. Define form schema
  const createFormSchema = z.object({
    roomID: z
      .string()
      .min(1, {
        message: "Room ID must be at least 1 character",
      })
      .refine(roomIDAvailable, {
        // specify a room ID error occured
        message: "Room ID is not available",
      }),
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
      .refine(roomIDCreated, {
        // specify a room ID error occured
        message: "Room ID does not exist",
      }),
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
    console.log(values);
    setRoomID(values.roomID);
    setNumPlayers(values.numPlayers);
    setStartGame(true);
  };

  const joinFormSubmit = (values) => {
    console.log(values);
    setRoomID(values.roomID);
    setNumPlayers(values.numPlayers);
    setStartGame(true);
  };

  return startGame ? (
    <Game roomID={roomID} numPlayers={numPlayers} />
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
                      <FormLabel>Number of Players</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      {/* <FormDescription>This is the room id</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button type="submit">Create</Button>
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
              <Button type="submit">Join</Button>
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
