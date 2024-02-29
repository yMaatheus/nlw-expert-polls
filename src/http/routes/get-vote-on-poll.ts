import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { ErrorTypes } from "../../utils/error-catalog";

export async function getVoteOnPoll(app: FastifyInstance) {
  app.get("/polls/:pollId/vote", async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    let { sessionId } = request.cookies;

    if (!sessionId) throw Error(ErrorTypes.NotVotedOnPoll);

    const userVoteOnPoll = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          sessionId,
          pollId,
        },
      },
    });

    if (!userVoteOnPoll) throw Error(ErrorTypes.NotFoundVoteOnPoll);

    return reply.send({
      pollId: userVoteOnPoll.pollId,
      pollOptionId: userVoteOnPoll.pollOptionId,
    });
  });
}
