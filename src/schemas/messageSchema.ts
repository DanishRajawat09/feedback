import { z } from "zod"

export const messageSchema = z.object({
    content: z.string().min(10, { message: "Content must be atleast of 10 charecters " }).max(300, { message: "Content must be no longer then 300 charecters" }),
})