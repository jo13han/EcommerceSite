import ResetPasswordForm from '@/sections/Login/ResetPasswordForm';

export default function ResetPasswordPage({ params }: any) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8">
        <ResetPasswordForm token={params.token} />
      </div>
    </div>
  );
} 