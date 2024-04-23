
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Home() {
  const router = useRouter();
  let user;
  if (typeof window !== "undefined") {
    user = JSON.parse(localStorage.getItem("user")) || undefined
    
    if(!user){
      router.push('/login')
    }
  }

  return (
    <>
      <main>
        <h1>
          Olá {user?.name}
        </h1>
      </main>
    </>
  );
}
