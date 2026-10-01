import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { toast } from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const passwords = {
        password,
        confirmPassword,
      };

      const response = await resetPassword(token, passwords);

      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const errors = error.response?.data?.error;
      const message = error.response?.data?.message;

      if (errors && errors.length > 0) {
        toast.error(errors[0].msg);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="w-full h-[74px] bg-white border-b border-slate-200 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg">
            WS
          </div>

          <div>
            <h1 className="text-[17px] font-semibold text-slate-900 leading-tight">
              WorkSphere
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Access & Workspace Management
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Secure workspace access
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px]">
          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-violet-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 15v2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M8 11V8a4 4 0 118 0v3"
                />

                <rect
                  x="5"
                  y="11"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-semibold text-slate-900">
              Reset your password
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Create a new password for your WorkSphere account. Make sure your
              new password is secure and easy for you to remember.
            </p>

            {/* Form */}
            <form
              onSubmit={handleResetPassword}
              className="mt-7 space-y-5"
            >
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  New Password
                </label>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full h-[50px] px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Confirm Password
                </label>

                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full h-[50px] px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* Message area */}
              <div className="hidden rounded-lg px-4 py-3 text-sm">
                Message
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full h-[50px] rounded-lg text-white text-sm font-semibold transition ${
                  loading
                    ? "bg-violet-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-7 pt-6 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition"
              >
                ← Back to Sign in
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            WorkSphere · Role-based workspace management
          </p>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;