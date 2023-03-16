import { objectType, extendType, nonNull, intArg } from "nexus";

export const Vote = objectType({
  name: "Vote",
  definition(t) {
    t.nonNull.field("user", { type: "User" });
    t.nonNull.field("link", { type: "Link" });
  },
});

export const VoteMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
      },
      async resolve(parent, args, context, info) {
        const userId = context.userId;
        if (!userId) {
          throw Error("Cannot vote without logging in");
        }

        const { linkId } = args;

        const link = await context.prisma.link.update({
          where: {
            id: linkId,
          },
          data: {
            voters: {
              connect: { id: userId },
            },
          },
        });

        const user = await context.prisma.user.findUniqueOrThrow({
          where: {
            id: userId,
          },
        });

        return {
          user,
          link,
        };
      },
    });
  },
});
