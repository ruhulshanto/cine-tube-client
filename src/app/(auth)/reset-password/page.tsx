import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";
import { PageSkeleton } from "@/components/shared/AppSkeletons";

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton variant="auth" />}>
      <ResetPasswordPage />
    </Suspense>
  );
}
