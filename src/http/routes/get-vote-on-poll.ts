import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getVoteOnPoll(app: FastifyInstance) {
  app.get("/polls/:pollId/vote", async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    let { sessionId } = request.cookies;

    if (!sessionId) {
      return reply
        .status(404)
        .send({ message: "You haven't voted on this poll." });
    }

    const userVoteOnPoll = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId,
        },
      },
    });

    if (!userVoteOnPoll) {
      return reply
        .status(404)
        .send({ message: "You haven't voted on this poll." });
    }

    return reply.send({
      pollId: userVoteOnPoll.pollId,
      pollOptionId: userVoteOnPoll.pollOptionId,
    })
  });
}
