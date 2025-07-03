import ResetPasswordForm from '@/sections/Login/ResetPasswordForm';

// Helper type guards
function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

function hasTokenParam(obj: unknown): obj is { params: { token: string } } {
  if (!isObject(obj)) return false;
  const { params } = obj;
  if (!isObject(params)) return false;
  return typeof params.token === 'string';
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