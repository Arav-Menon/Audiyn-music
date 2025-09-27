"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) return <button onClick={() => signIn()}>signIn</button>;
  if (session) return <button onClick={() => signOut()}>signOut</button>;

  return (
    <>
      <p>Welcome {session} </p>
    </>
  );
}
