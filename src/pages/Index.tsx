import { useEffect, useState } from "react";
import { Bug, AlertTriangle, CheckCircle, Flame, Activity } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { api } from "@/lib/api";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ total: 0, open: 0, resolved: 0, critical: 0, high: 0, medium: 0, low: 0, trend: [] });
  const [recentBugs, setRecentBugs] = useState<any[]>([]);
  const [topFixers, setTopFixers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStats(),
      api.getBugs({ limit: 5 }),
      api.getUsers()
    ]).then(([statsData, bugsData, usersData]) => {
      setStats(statsData);
      setRecentBugs(Array.isArray(bugsData) ? bugsData.slice(0, 5) : []);
      setTopFixers(Array.isArray(usersData) ? usersData : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Bugs", value: stats.total,    icon: Bug,           color: "text-neon-cyan" },
    { label: "Open Bugs",  value: stats.open,     icon: AlertTriangle, color: "text-neon-pink" },
    { label: "Resolved",   value: stats.resolved, icon: CheckCircle,   color: "text-neon-purple" },
    { label: "Critical",   value: stats.critical, icon: Flame,         color: "text-severity-critical" },
  ];

  const trendData = [
    { week: "Week 1", opened: 4,  resolved: 2 },
    { week: "Week 2", opened: 6,  resolved: 4 },
    { week: "Week 3", opened: 5,  resolved: 6 },
    { week: "Week 4", opened: 8,  resolved: 5 },
    { week: "Week 5", opened: 3,  resolved: 7 },
    { week: "Today",  opened: stats.total || 16, resolved: stats.resolved || 1 },
  ];

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold gradient-text">Galaxy Overview</h1>
          <p className="text-muted-foreground mt-1">Your Bug Universe at a glance</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <GlassCard key={s.label} glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">
                    {loading ? "—" : s.value}
                  </p>
                </div>
                <s.icon className={`${s.color} opacity-80`} size={32} />
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Bug Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(340,82%,65%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(340,82%,65%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(168,100%,48%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(168,100%,48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,10%,18%)" />
                <XAxis dataKey="week" stroke="hsl(240,5%,55%)" fontSize={12} />
                <YAxis stroke="hsl(240,5%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(240,10%,8%)", border: "1px solid hsl(240,10%,20%)", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="opened"   stroke="hsl(340,82%,65%)"  fill="url(#openGrad)"     strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="hsl(168,100%,48%)" fill="url(#resolvedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Bugs by Severity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "Critical", count: stats.critical      },
                { name: "High",     count: stats.high   || 0   },
                { name: "Medium",   count: stats.medium || 0   },
                { name: "Low",      count: stats.low    || 0   },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,10%,18%)" />
                <XAxis dataKey="name" stroke="hsl(240,5%,55%)" fontSize={12} />
                <YAxis stroke="hsl(240,5%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(240,10%,8%)", border: "1px solid hsl(240,10%,20%)", borderRadius: 8, color: "#fff" }} />
                <Bar dataKey="count" fill="hsl(270,60%,45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Top Fixers + Recent Activity */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top Bug Fixers — real users from MongoDB */}
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">🏆 Top Bug Fixers</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : topFixers.slice(0, 5).map((user: any, i: number) => (
                <div key={user._id} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple border border-neon-purple/30">
                    {user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role} · {user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity — real bugs from MongoDB */}
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              <Activity size={14} className="inline mr-1" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : recentBugs.length > 0 ? (
                recentBugs.map((bug: any) => (
                  <div key={bug._id} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-pink mt-2 shrink-0 animate-pulse-glow" />
                    <div>
                      <p>Bug: {bug.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {bug.status} · {new Date(bug.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </GlassCard>

        </motion.div>
      </motion.div>
    </AppLayout>
  );
}