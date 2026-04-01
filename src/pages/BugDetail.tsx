import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, MessageSquare, Clock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { type Status } from "@/data/mockData";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const statusFlow: Status[] = ["Open", "In Progress", "Resolved", "Verified", "Closed"];

export default function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug]           = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading]   = useState(true);
  const [sending, setSending]   = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getBug(id), api.getComments(id)])
      .then(([bugData, commentData]) => {
        setBug(bugData);
        setComments(Array.isArray(commentData) ? commentData : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: Status) => {
    const updated = await api.updateBug(id!, { status: newStatus });
    setBug(updated);
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSending(true);
    try {
      const comment = await api.addComment({
        bug_id:  id,
        user_id: currentUser.id,
        comment: newComment.trim(),
      });
      setComments(prev => [...prev, comment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <AppLayout><div className="text-center py-20 text-muted-foreground">Loading bug...</div></AppLayout>;
  if (!bug)    return <AppLayout><div className="text-center py-20 text-muted-foreground">Bug not found.</div></AppLayout>;

  const statusIndex = statusFlow.indexOf(bug.status);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Main Card */}
        <GlassCard glow hover={false}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-muted-foreground">#{bug._id?.slice(-6)}</span>
              <h1 className="text-2xl font-bold mt-1">{bug.title}</h1>
            </div>
            <SeverityBadge severity={bug.severity} />
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{bug.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              {/* Clickable status dropdown */}
              <select
                value={bug.status}
                onChange={(e) => handleStatusChange(e.target.value as Status)}
                className="bg-muted/50 border border-glass-border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {statusFlow.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Assigned to</p>
              <p className="text-sm font-medium mt-1">{bug.assigned_to?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm mt-1">{new Date(bug.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Updated</p>
              <p className="text-sm mt-1">{new Date(bug.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-6">
            {bug.tags?.map((t: string) => (
              <span key={t} className="px-3 py-1 text-xs font-medium rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">{t}</span>
            ))}
          </div>

          {/* Lifecycle Stepper */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3">Bug Lifecycle</p>
            <div className="flex items-center gap-1">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`h-2 flex-1 rounded-full transition-colors ${i <= statusIndex ? "bg-neon-cyan" : "bg-muted"}`} />
                  {i < statusFlow.length - 1 && <div className="w-1" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {statusFlow.map(s => <span key={s} className="text-[10px] text-muted-foreground">{s}</span>)}
            </div>
          </div>

          <div className="border border-dashed border-glass-border rounded-lg p-6 text-center">
            <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Drop files here or click to upload screenshots/logs</p>
          </div>
        </GlassCard>

        {/* Comments */}
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-neon-pink" /> Comments ({comments.length})
          </h3>
          <div className="space-y-4">
            {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>}
            {comments.map((c: any) => (
              <div key={c._id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center text-[10px] font-bold text-neon-cyan">
                    {c.user_id?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </div>
                  <span className="text-xs font-medium">{c.user_id?.name || "Unknown"}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm ml-8">{c.comment}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              placeholder="Add a comment..."
              className="flex-1 bg-muted/50 border border-glass-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSendComment}
              disabled={sending}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </GlassCard>

        {/* Activity Timeline — from bug.activity */}
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock size={16} className="text-neon-cyan" /> Activity Timeline
          </h3>
          <div className="space-y-3 border-l-2 border-glass-border ml-2 pl-4">
            {bug.activity?.length > 0 ? bug.activity.map((a: any, i: number) => (
              <div key={i} className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neon-cyan" />
                <p className="text-sm">{a.action}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</p>
              </div>
            )) : (
              <>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-neon-pink" />
                  <p className="text-sm">Bug created</p>
                  <p className="text-xs text-muted-foreground">{new Date(bug.createdAt).toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </AppLayout>
  );
}