import cookie from "@fastify/cookie";
import fastify from "fastify";
import { createPoll } from "./routes/create-poll";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: 'onRequest',
})

app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!");
});
