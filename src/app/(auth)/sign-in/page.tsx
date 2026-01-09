"use client";
import React, { useState } from "react";
import {useDebounceValue} from "usehooks-ts"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
const debouncedUsername =  useDebounceValue(username , 300)

  return <div></div>;
};

export default Page;
