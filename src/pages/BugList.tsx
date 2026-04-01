import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { type Severity, type Status, type Tag } from "@/data/mockData";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const severities: Severity[] = ["Critical", "High", "Medium", "Low"];
const statuses: Status[] = ["Open", "In Progress", "Resolved", "Verified", "Closed"];
const tags: Tag[] = ["UI", "Backend", "Security", "Performance"];

export default function BugList() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "">("");
  const [filterStatus, setFilterStatus]     = useState<Status | "">("");
  const [filterTag, setFilterTag]           = useState<Tag | "">("");

  // Fetch bugs from backend whenever filters change
  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (filterSeverity) params.severity = filterSeverity;
    if (filterStatus)   params.status   = filterStatus;
    if (filterTag)      params.tag      = filterTag;
    if (search)         params.search   = search;

    api.getBugs(params)
      .then(data => setBugs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterSeverity, filterStatus, filterTag, search]);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Bug Constellation</h1>
            <p className="text-muted-foreground mt-1">Explore and track all bugs in the universe</p>
          </div>
          <button
            onClick={() => navigate("/bugs/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity neon-glow-pink"
          >
            <Plus size={16} /> New Bug
          </button>
        </div>

        {/* Search + Filters */}
        <GlassCard hover={false} className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword..."
              className="w-full bg-muted/50 border border-glass-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as Severity | "")} className="bg-muted/50 border border-glass-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Severities</option>
            {severities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as Status | "")} className="bg-muted/50 border border-glass-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterTag} onChange={(e) => setFilterTag(e.target.value as Tag | "")} className="bg-muted/50 border border-glass-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="">All Tags</option>
            {tags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </GlassCard>

        {/* Bug Grid */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Loading bugs from universe...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bugs.map((bug, i) => (
              <motion.div
                key={bug._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard glow={bug.severity === "Critical"} className="cursor-pointer group">
                  <div onClick={() => navigate(`/bugs/${bug._id}`)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        #{bug._id?.slice(-6)}
                      </span>
                      <SeverityBadge severity={bug.severity} />
                    </div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{bug.title}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge status={bug.status} />
                      <span className="text-xs text-muted-foreground">
                        {bug.assigned_to?.name || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {bug.tags?.map((t: string) => (
                        <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && bugs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No bugs found. The universe is clean!
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}