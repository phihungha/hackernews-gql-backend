import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { objectType, extendType, nonNull, stringArg } from "nexus";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const { name, email, password } = args;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await context.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

        return { token, user };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const { email, password } = args;

        const user = await context.prisma.user.findUniqueOrThrow({
          where: {
            email,
          },
        });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

        return { token, user };
      },
    });
  },
});
