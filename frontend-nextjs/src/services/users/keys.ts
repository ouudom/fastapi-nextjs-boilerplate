export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (page: number, size: number) =>
    [...userKeys.lists(), { page, size }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
