import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";
import { ErrorTypes } from "../../utils/error-catalog";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const getPollParams = z.object({
      pollId: z
        .string({
          required_error: "O PollId é obrigatório.",
        })
        .uuid("O PollId precisa ser um UUID válido."),
    });

    const { pollId } = getPollParams.parse(request.params);

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!poll) throw Error(ErrorTypes.PollNotFound);

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

    const votes = result.reduce((acc, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];

        Object.assign(acc, { [line]: Number(score) });
      }

      return acc;
    }, {} as Record<string, number>);

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
  });
}
