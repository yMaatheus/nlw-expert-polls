export enum ErrorTypes {
  PollNotFound = 'PollNotFound',
  NotVotedOnPoll = 'NotVotedOnPoll',
  NotFoundVoteOnPoll = 'NotFoundVoteOnPoll',
  HasVotedOnPoll = 'HasVotedOnPoll',
}

type ErrorResponseObject = {
  error: string;
  httpStatus: number
};

export type ErrorCatalog = {
  [key in ErrorTypes]: ErrorResponseObject
};

export const errorCatalog: ErrorCatalog = {
  PollNotFound: {
    error: 'Enquete não encontrada.',
    httpStatus: 404,
  },
  NotVotedOnPoll: {
    error: 'Você não votou em nenhuma opção desta enquete.',
    httpStatus: 404,
  },
  NotFoundVoteOnPoll: {
    error: 'Não foi posisvel encontrar seu voto nessa enquete.',
    httpStatus: 404,
  },
  HasVotedOnPoll: {
    error: 'Você já votou nesta enquete.',
    httpStatus: 409,
  },
};