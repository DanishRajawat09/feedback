import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        const user = await userModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                }, {
                status: 404
            }
            )
        }

        // is user accepting the messages

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                }, {
                status: 403
            }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent SuccessFully"
            }, {
            status: 200
        }
        )
    } catch (error) {
        console.error("failed to update user status to accept message", error);

        return Response.json(
            {
                success: false,
                message: "Failed to updated user status to accept message"
            }, {
            status: 500
        }
        )
    }


}