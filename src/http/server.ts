import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import fastify from "fastify";
import { parseEnv } from "../lib/env";
import { errorMiddleware } from './middlewares/error-middleware';
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { getVoteOnPoll } from "./routes/get-vote-on-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import { pollResults } from "./ws/poll-results";

const { PORT: port, HOST: host, origin } = parseEnv(process.env)

const app = fastify();

app.register(cors, {
  origin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest",
});

app.setErrorHandler(errorMiddleware)

app.register(websocket);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(getVoteOnPoll)

app.register(pollResults);

app.listen({ port, host }).then(() => {
  console.log("HTTP server running!");
});
