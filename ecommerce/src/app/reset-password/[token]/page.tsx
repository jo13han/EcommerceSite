import ResetPasswordForm from '@/sections/Login/ResetPasswordForm';

export default function ResetPasswordPage({ params }: unknown) {
  // Type-narrowing for params
  if (
    !params ||
    typeof params !== 'object' ||
    !('token' in params) ||
    typeof (params as { token?: unknown }).token !== 'string'
  ) {
    return <div>Invalid token</div>;
  }

  const { token } = params as { token: string };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
} 