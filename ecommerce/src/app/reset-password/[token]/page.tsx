import ResetPasswordForm from '@/sections/Login/ResetPasswordForm';

// Type guard for props
function hasTokenParam(obj: unknown): obj is { params: { token: string } } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'params' in obj &&
    typeof (obj as any).params === 'object' &&
    (obj as any).params !== null &&
    'token' in (obj as any).params &&
    typeof (obj as any).params.token === 'string'
  );
}

export default function ResetPasswordPage(props: unknown) {
  if (!hasTokenParam(props)) {
    return <div>Invalid token</div>;
  }
  const { token } = props.params;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
} 