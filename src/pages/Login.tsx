import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bug, Eye, EyeOff } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ParticleField } from "@/components/ParticleField";
import { motion } from "framer-motion";
import type { Role } from "@/data/mockData";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Developer");
  const [showPw, setShowPw] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
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
            <p className="text-sm text-muted-foreground mt-1">Sign in to track bugs across the galaxy</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

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

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity neon-glow-pink"
            >
              Enter the Universe
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
