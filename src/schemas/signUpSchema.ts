import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "username must be atleast 2 charecters")
    .max(20, "username must be no more then 20 charecters")
    .regex(/^[a-zA-Z0-9_]+$/, "username must not be contain special charecter")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "inavlid email address" }),
    password: z.string().min(6, { message: "password must be 6 charecters" })
})