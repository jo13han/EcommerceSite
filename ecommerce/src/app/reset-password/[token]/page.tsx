import ResetPasswordForm from '@/sections/Login/ResetPasswordForm';

export default function ResetPasswordPage(props: unknown) {
  // Type-narrowing for props and params
  if (
    !props ||
    typeof props !== 'object' ||
    !('params' in props) ||
    typeof (props as { params?: unknown }).params !== 'object' ||
    !('token' in (props as { params: unknown }).params) ||
    typeof ((props as { params: { token?: unknown } }).params.token) !== 'string'
  ) {
    return <div>Invalid token</div>;
  }

  const token = (props as { params: { token: string } }).params.token;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
} 