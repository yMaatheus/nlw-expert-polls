import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { ErrorTypes, errorCatalog } from "../../utils/error-catalog";

export async function errorMiddleware(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);

    return reply.status(400).send({ message: validationError.toString() });
  }

  const messageAsErrorType = error.message as keyof typeof ErrorTypes;

  const mappedError = errorCatalog[messageAsErrorType];
  if (mappedError) {
    const { httpStatus, error } = mappedError;
    return reply.status(httpStatus).send({ message: error });
  }

  return reply.status(500).send({ message: "internal error" });
}
