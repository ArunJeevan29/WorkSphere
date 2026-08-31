import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Login() {
  const { fetchCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please fill all the fields");
        return;
      }
      const user = { email, password };
      const response = await loginUser(user);
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token);
      await fetchCurrentUser();
      navigate("/");
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
    }
  }
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center mb-5">
              <span className="text-white font-bold text-lg">SA</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-slate-900 font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Secure Access Hub · Role-based access management
        </p>
      </div>
    </div>
  );
}

export default Login;
