import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {

    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingVerifiedUserByUsername = await userModel.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUserByUsername) {
            return Response.json({ success: false, message: "username is already taken" }, { status: 400 })
        }

        const existingUserByEmail = await userModel.findOne({ email })
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 500 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = otp
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()

            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, otp)

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User register successfully. please verify your email"
        }, { status: 500 })
    } catch (error) {
        console.error("error registering user", error);

        return Response.json({
            success: false,
            message: "error registring user"
        }, {
            status: 500
        })

    }
}