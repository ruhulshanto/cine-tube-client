import { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading Payment Success...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}