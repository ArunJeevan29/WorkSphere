import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill all fields");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Password and Confirm Password must be same");
        return;
      }
      const newUser = {
        name,
        email,
        password,
        confirmPassword,
      };
      const response = await registerUser(newUser);
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

            <h2 className="text-2xl font-bold text-slate-900">
              Create your account
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Register for Secure Access Hub and get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 active:scale-[0.99] transition cursor-pointer"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-slate-900 font-semibold hover:underline cursor-pointer"
              >
                Sign in
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

export default Register;
