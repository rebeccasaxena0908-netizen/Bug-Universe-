import { Bug, AlertTriangle, CheckCircle, Flame, Activity } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { bugs, developers, activityFeed, bugTrendData } from "@/data/mockData";
import { AppLayout } from "@/components/AppLayout";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const stats = [
  { label: "Total Bugs", value: bugs.length, icon: Bug, color: "text-neon-cyan" },
  { label: "Open Bugs", value: bugs.filter(b => b.status === "Open").length, icon: AlertTriangle, color: "text-neon-pink" },
  { label: "Resolved", value: bugs.filter(b => b.status === "Resolved" || b.status === "Closed").length, icon: CheckCircle, color: "text-neon-purple" },
  { label: "Critical", value: bugs.filter(b => b.severity === "Critical").length, icon: Flame, color: "text-severity-critical" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold gradient-text">Galaxy Overview</h1>
          <p className="text-muted-foreground mt-1">Your Bug Universe at a glance</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <GlassCard key={s.label} glow>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
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
              <AreaChart data={bugTrendData}>
                <defs>
                  <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(340,82%,65%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(340,82%,65%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168,100%,48%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(168,100%,48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,10%,18%)" />
                <XAxis dataKey="week" stroke="hsl(240,5%,55%)" fontSize={12} />
                <YAxis stroke="hsl(240,5%,55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(240,10%,8%)", border: "1px solid hsl(240,10%,20%)", borderRadius: 8, color: "#fff" }} />
                <Area type="monotone" dataKey="opened" stroke="hsl(340,82%,65%)" fill="url(#openGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="hsl(168,100%,48%)" fill="url(#resolvedGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Bugs by Severity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "Critical", count: bugs.filter(b => b.severity === "Critical").length },
                { name: "High", count: bugs.filter(b => b.severity === "High").length },
                { name: "Medium", count: bugs.filter(b => b.severity === "Medium").length },
                { name: "Low", count: bugs.filter(b => b.severity === "Low").length },
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

        {/* Leaderboard + Activity */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">🏆 Top Bug Fixers</h3>
            <div className="space-y-3">
              {developers.slice(0, 5).map((dev, i) => (
                <div key={dev.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-purple border border-neon-purple/30">
                    {dev.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">{dev.bugsFixed} bugs fixed · avg {dev.avgResolutionHours}h</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold neon-text-cyan">{dev.bugsFixed}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              <Activity size={14} className="inline mr-1" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-pink mt-2 shrink-0 animate-pulse-glow" />
                  <div>
                    <p>{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.user} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
