"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { user, isSignedIn } = useUser();
  return (
    <div className="px-12 py-4 flex items-center justify-between shadow-sm">
      <Image src={"/logo.svg"} height={20} width={40} alt="logo" />

      {isSignedIn ? (
        <UserButton />
      ) : (
        <Button>
          <Link href={"/sign-in"}>Get started</Link>
        </Button>
      )}
    </div>
  );
};

export default Header;
