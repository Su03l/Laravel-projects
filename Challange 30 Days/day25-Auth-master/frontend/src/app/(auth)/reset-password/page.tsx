import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Suspense } from "react"
// Suspense needed because we use useSearchParams

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
