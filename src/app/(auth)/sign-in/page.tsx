"use client"
import { useSession, signIn , signOut } from "next-auth/react";

export default function Page(){
    const {data:session} = useSession()
    if (session) {
        return (
            <>
            Sign in as {session.user.email} <br /> 
            <button onClick={() => signOut()}>sign OUT</button>
            </>
        )
    }
    return (
        <>
        Not Sign in <br />
        <button onClick={()=>signIn()} className="bg-white px-2.5 py-4">Sign in</button>
        </>
    )
}