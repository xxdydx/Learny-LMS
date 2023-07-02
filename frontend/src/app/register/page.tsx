"use client";

import SignUp from "../components/SignUp";
import { useAuth } from "../hooks";
import { useAppDispatch } from "../hooks";
import { useRouter } from "next/navigation";
import LoadingPage from "../components/LoadingPage";
import { useEffect } from "react";

export default function MyPage() {
  const [isLoading, user] = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [isLoading, user]);

  if (isLoading || user) {
    return <LoadingPage />;
  }

  if (user) {
    router.push("/");
  }
  return (
    <div className="dark">
      <SignUp />
    </div>
  );
}
