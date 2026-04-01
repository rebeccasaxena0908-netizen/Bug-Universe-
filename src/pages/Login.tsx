import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bug, Eye, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ParticleField } from "@/components/ParticleField";
import { motion } from "framer-motion";
import type { Role } from "@/data/mockData";
import { api } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState<Role>("Developer");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) { setError("Name is required"); setLoading(false); return; }
        const res = await api.register({ name, email, password, role });
        if (res.error) { setError(res.error); setLoading(false); return; }
        // Auto login after register
        const loginRes = await api.login({ email, password });
        if (loginRes.error) { setError(loginRes.error); setLoading(false); return; }
        localStorage.setItem("token", loginRes.token);
        localStorage.setItem("user", JSON.stringify(loginRes.user));
        navigate("/");
      } else {
        const res = await api.login({ email, password });
        if (res.error) { setError(res.error); setLoading(false); return; }
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/");
      }
    } catch (err) {
      setError("Could not connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg relative">
      <ParticleField count={20} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <GlassCard glow hover={false} className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 neon-glow-pink">
              <Bug size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Bug Universe</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Create your account to join the galaxy" : "Sign in to track bugs across the galaxy"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name field — only on Sign Up */}
            {isSignUp && (
              <div>
                <label className="text-xs text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sana Bansal"
                  className="w-full mt-1 bg-muted/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@buguniverse.io"
                className="w-full mt-1 bg-muted/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-muted/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs text-muted-foreground">Role</label>
              <div className="flex gap-2 mt-1">
                {(["Admin", "Developer", "Reviewer"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      role === r
                        ? "bg-primary/15 border-primary text-primary neon-glow-pink"
                        : "bg-muted/30 border-glass-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-xs text-red-400 text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity neon-glow-pink disabled:opacity-50"
            >
              {loading
                ? (isSignUp ? "Creating Account..." : "Signing In...")
                : (isSignUp ? "Join the Universe" : "Enter the Universe")
              }
            </button>

            {/* Toggle between login and signup */}
            <div className="text-center pt-2">
              <span className="text-xs text-muted-foreground">
                {isSignUp ? "Already have an account? " : "New to Bug Universe? "}
              </span>
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="text-xs text-primary hover:opacity-80 transition-opacity font-medium"
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </button>
            </div>

          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}