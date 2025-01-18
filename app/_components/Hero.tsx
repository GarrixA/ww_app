"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const { user, isSignedIn } = useUser();

  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:flex lg:items-center xl:py-32 xl:px-8">
        <div className="mx-auto text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl xl:text-5xl">
            Take Control of Your Finances.
            <strong className="font-extrabold text-blue-700 block text-xl lg:text-2xl xl:text-4xl">
              Manage Your Budget & Expenses <br /> According To Your Income
              Amount.
            </strong>
          </h1>

          <p className="mt-4 sm:text-lg max-w-xl m-auto px-4 sm:px-0 xl:text-xl">
            Effortlessly track your spending, set budgets, and reach your
            financial goals. Our app helps you stay on top of your finances and
            make smarter decisions every day!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                  href="/dashboard"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <Link
                className="block w-full rounded bg-blue-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
                href="/sign-in"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
