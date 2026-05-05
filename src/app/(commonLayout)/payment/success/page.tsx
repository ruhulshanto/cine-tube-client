import { Suspense } from "react";
import PaymentSuccessPage from "./PaymentSuccessPage";
import { PageSkeleton } from "@/components/shared/AppSkeletons";

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton variant="detail" />}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
