import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}