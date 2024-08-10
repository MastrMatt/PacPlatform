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
import { Label } from "@/components/ui/label";

import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function GameSetup() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl m-4">
        <CardHeader>
          <CardTitle className="text-center">Create Game</CardTitle>
          {/* <CardDescription>
            Enter your email below to login to your account.
          </CardDescription> */}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form>
            <Label htmlFor="roomId"> Room ID: </Label>
            <div className="flex flex-row gap-2">
              <Input id="roomId" placeholder="Enter the room ID" required />
              <Button type="submit">Create</Button>
            </div>
          </form>
          {error && (
            <Alert variant="destructive">
              <CircleAlert className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to create room with that ID, try different ID.
              </AlertDescription>
            </Alert>
          )}
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
        <CardContent className="flex flex-col gap-4">
          <form>
            <Label htmlFor="roomId"> Room ID: </Label>
            <div className="flex flex-row gap-2">
              <Input id="roomId" placeholder="Enter the room ID" required />
              <Button type="submit">Join</Button>
            </div>
          </form>
          {error && (
            <Alert variant="destructive">
              <CircleAlert className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Unable to join room with that ID, try different ID.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {/* <Button className="w-full">Sign in</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default GameSetup;
