import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ShieldCheck, LockKeyhole, Sparkles } from "lucide-react";

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

      const user = {
        email,
        password,
      };

      const response = await loginUser(user);

      toast.success(response.data.message);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

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
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* ================================================= */}
      {/* LEFT SIDE - BRANDING */}
      {/* ================================================= */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-950 items-center justify-center">
        {/* Large gradient glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute -bottom-48 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* Decorative dots */}
        <div className="absolute top-[15%] left-[12%] w-3 h-3 rounded-full bg-violet-400/60" />

        <div className="absolute top-[22%] right-[18%] w-2 h-2 rounded-full bg-violet-300/40" />

        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full bg-indigo-300/40" />

        <div className="absolute bottom-[28%] right-[12%] w-3 h-3 rounded-full bg-violet-400/40" />

        {/* Main Branding Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Shield */}
          <div className="relative mb-10">
            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-violet-600/30 blur-2xl scale-150" />

            {/* Outer circle */}
            <div className="relative w-44 h-44 rounded-full border border-violet-400/20 flex items-center justify-center">
              {/* Inner circle */}
              <div className="w-32 h-32 rounded-full border border-violet-400/20 flex items-center justify-center">
                {/* Shield */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-900/50">
                  <ShieldCheck
                    size={42}
                    strokeWidth={1.7}
                    className="text-white"
                  />
                </div>
              </div>
            </div>

            {/* Floating lock */}
            <div className="absolute -right-2 top-6 w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
              <LockKeyhole size={16} className="text-violet-400" />
            </div>

            {/* Floating sparkle */}
            <div className="absolute -left-3 bottom-8 w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Sparkles size={14} className="text-violet-400" />
            </div>
          </div>

          {/* Brand Text */}
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Your workspace.
          </h2>

          <h3 className="text-4xl font-bold text-violet-400 mt-1">
            Securely managed.
          </h3>

          <p className="max-w-md mt-6 text-sm leading-6 text-slate-400">
            A secure workspace built to help teams manage access, collaboration,
            and everyday work with confidence.
          </p>

          {/* Bottom Statement */}
          <div className="flex items-center gap-3 mt-10">
            <div className="w-8 h-px bg-slate-700" />

            <span className="text-xs text-slate-500">WORKSPHERE</span>

            <div className="w-8 h-px bg-slate-700" />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* RIGHT SIDE - LOGIN */}
      {/* ================================================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">WS</span>
            </div>

            <div>
              <h1 className="font-bold text-slate-900">WorkSphere</h1>

              <p className="text-xs text-slate-500 mt-0.5">
                Access & Workspace Management
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>

            <p className="text-sm text-slate-500 mt-2">
              Sign in to access your workspace.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 bg-white rounded-lg px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-slate-900 font-semibold hover:text-violet-600 hover:underline cursor-pointer transition"
              >
                Create an account
              </button>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            WorkSphere · Role-based workspace management
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
