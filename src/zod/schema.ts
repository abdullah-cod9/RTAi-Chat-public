import { z } from "zod";
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit." })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    }),
});
export const EmailSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export const SignupSchema = z.object({
  username: z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters long.",
  })
  .max(64, {
    message: "Username must be at most 64 characters long.",
  })
  .regex(/^(?![.\-\s])[a-zA-Z0-9\u0600-\u06FF\s._-]+(?<![.\-\s])$/, {
    message:
      "Username can contain Arabic/English letters, numbers, spaces, '.', '_' and '-'. It can't start or end with '.', '-' or space.",
  }),

  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit." })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    }),
  confirmPassword: z.string(),
});
export const UsernameSchema = z.object({
 username: z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters long.",
  })
  .max(64, {
    message: "Username must be at most 64 characters long.",
  })
  .regex(/^(?![.\-\s])[a-zA-Z0-9\u0600-\u06FF\s._-]+(?<![.\-\s])$/, {
    message:
      "Username can contain Arabic/English letters, numbers, spaces, '.', '_' and '-'. It can't start or end with '.', '-' or space.",
  }),

});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one digit." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const addFriendSchema = z.object({
  userId: z
    .string()
    .max(36, { message: "User ID must not be more than 36 characters." }),
});

export const ChatNameSchema = z.object({
  chatName: z
    .string()
    .min(4, { message: "Chat name must be at least 4 characters long." }),
});

export const contactSchema = z.object({
 username: z
  .string()
  .min(2, {
    message: "Username must be at least 2 characters long.",
  })
  .max(64, {
    message: "Username must be at most 64 characters long.",
  })
  .regex(/^(?![.\-\s])[a-zA-Z0-9\u0600-\u06FF\s._-]+(?<![.\-\s])$/, {
    message:
      "Username can contain Arabic/English letters, numbers, spaces, '.', '_' and '-'. It can't start or end with '.', '-' or space.",
  }),


  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(100, "Email cannot exceed 100 characters."),

  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters long.")
    .max(2000, "Message cannot exceed 2000 characters."),

  type: z.enum(["feature", "bug", "billingIssues"], {
    errorMap: () => ({
      message: "Please choose one of the available options.",
    }),
  }),
});

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  addressLine: z.string().min(1, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(1, "Zip code must be at least 5 characters"),
  state: z.string().min(1, "State must be at least 2 characters"),
});