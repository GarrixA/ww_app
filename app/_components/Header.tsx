"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className="px-12 py-4 flex items-center justify-between shadow border-b">
      <Image src={"/logo.svg"} height={20} width={40} alt="logo" />

      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <Link
            className="block w-full rounded px-12 py-3 text-black cursor-pointer font-bold text-lg"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <UserButton />
        </div>
      ) : (
        <Button>
          <Link href={"/sign-in"}>Get started</Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
