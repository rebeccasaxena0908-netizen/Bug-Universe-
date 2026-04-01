import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

function autoSeverity(description: string) {
  const d = description.toLowerCase();
  if (d.includes('crash') || d.includes('security') || d.includes('injection') || d.includes('vulnerability')) return 'Critical';
  if (d.includes('error') || d.includes('fail') || d.includes('freeze') || d.includes('upload') || d.includes('500')) return 'High';
  if (d.includes('slow') || d.includes('performance') || d.includes('rendering') || d.includes('notification')) return 'Medium';
  return 'Low';
}

export default function NewBug() {
  const navigate = useNavigate();
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);
  const [suggestedSeverity, setSuggestedSeverity] = useState("Medium");

  const [form, setForm] = useState({
    title:       "",
    description: "",
    severity:    "",
    status:      "Open",
    assigned_to: "",
    tags:        [] as string[],
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    api.getUsers().then(data => setUsers(Array.isArray(data) ? data : []));
  }, []);

  const handleDescriptionChange = (val: string) => {
    setForm(f => ({ ...f, description: val }));
    setSuggestedSeverity(autoSeverity(val));
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter(t => t !== tag)
        : [...f.tags, tag]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return alert("Title and description are required!");
    setLoading(true);
    try {
      await api.createBug({
        ...form,
        severity:   form.severity || suggestedSeverity,
        created_by: currentUser.id,
        assigned_to: form.assigned_to || null,
      });
      navigate("/bugs");
    } catch (err) {
      console.error(err);
      alert("Failed to create bug. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const severityColors: Record<string, string> = {
    Critical: "text-red-400 border-red-400/50 bg-red-400/10",
    High:     "text-orange-400 border-orange-400/50 bg-orange-400/10",
    Medium:   "text-yellow-400 border-yellow-400/50 bg-yellow-400/10",
    Low:      "text-green-400 border-green-400/50 bg-green-400/10",
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h1 className="text-3xl font-bold gradient-text">Report a Bug</h1>
          <p className="text-muted-foreground mt-1">Add a new bug to the universe</p>
        </div>

        <GlassCard hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Bug Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. App crashes on login"
                className="w-full bg-muted/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Description *</label>
              <textarea
                value={form.description}
                onChange={e => handleDescriptionChange(e.target.value)}
                placeholder="Describe the bug in detail..."
                rows={4}
                className="w-full bg-muted/50 border border-glass-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              {/* Smart severity suggestion */}
              {form.description && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">AI suggests severity:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${severityColors[suggestedSeverity]}`}>
                    {suggestedSeverity}
                  </span>
                </div>
              )}
            </div>

            {/* Severity + Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Severity <span className="text-muted-foreground/50">(auto-detected if empty)</span>
                </label>
                <select
                  value={form.severity}
                  onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                  className="w-full bg-muted/50 border border-glass-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Auto detect</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full bg-muted/50 border border-glass-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Verified">Verified</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Assign to */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Assign To</label>
              <select
                value={form.assigned_to}
                onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                className="w-full bg-muted/50 border border-glass-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs text-muted-foreground block mb-2">Tags</label>
              <div className="flex gap-2 flex-wrap">
                {["UI", "Backend", "Security", "Performance"].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      form.tags.includes(tag)
                        ? "bg-neon-purple/20 text-neon-purple border-neon-purple/50"
                        : "bg-muted/30 text-muted-foreground border-glass-border hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity neon-glow-pink disabled:opacity-50"
            >
              {loading ? "Creating Bug..." : "Launch Bug into Universe"}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}