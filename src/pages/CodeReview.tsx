import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { Brain, MessageSquare, Lightbulb } from "lucide-react";

const codeLines = [
  { num: 1, content: 'function processUserData(user) {', comment: null },
  { num: 2, content: '  const name = user.name;', comment: null },
  { num: 3, content: '  const email = user.email;', comment: null },
  { num: 4, content: '  const age = user.age;', comment: "Consider destructuring: const { name, email, age } = user;" },
  { num: 5, content: '', comment: null },
  { num: 6, content: '  if (age != null) {', comment: "Use strict equality (===) instead of loose equality (!=)" },
  { num: 7, content: '    for (var i = 0; i < 1000; i++) {', comment: "Use 'let' instead of 'var'. Consider optimizing this loop." },
  { num: 8, content: '      console.log(user.name);', comment: "Avoid console.log in production. Use a proper logger." },
  { num: 9, content: '    }', comment: null },
  { num: 10, content: '  }', comment: null },
  { num: 11, content: '', comment: null },
  { num: 12, content: '  const result = null;', comment: null },
  { num: 13, content: '  return result.data;', comment: "⚠️ Possible null pointer exception — result is null" },
  { num: 14, content: '}', comment: null },
  { num: 15, content: '', comment: null },
  { num: 16, content: 'function fetchData(url) {', comment: null },
  { num: 17, content: '  fetch(url)', comment: "Missing error handling for fetch. Add .catch() or try/catch." },
  { num: 18, content: '    .then(res => res.json())', comment: null },
  { num: 19, content: '    .then(data => {', comment: null },
  { num: 20, content: '      globalState = data;', comment: "Avoid mutating global state directly. Use a state manager." },
  { num: 21, content: '    });', comment: null },
  { num: 22, content: '}', comment: null },
];

const aiSuggestions = [
  { type: "error", title: "Null pointer exception", desc: "Line 13: Accessing .data on a null value will throw at runtime.", icon: "🔴" },
  { type: "warning", title: "Optimize loop performance", desc: "Line 7: Loop runs 1000 times with console.log — significant perf impact.", icon: "🟡" },
  { type: "info", title: "Improve variable naming", desc: "Lines 2-4: Consider destructuring for cleaner code.", icon: "🔵" },
  { type: "warning", title: "Missing error handling", desc: "Line 17: fetch() call has no error handling. Network failures will silently fail.", icon: "🟡" },
  { type: "info", title: "Use strict equality", desc: "Line 6: Prefer === over != for type-safe comparisons.", icon: "🔵" },
];

export default function CodeReview() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Code Review</h1>
          <p className="text-muted-foreground mt-1">Review code with AI-powered suggestions</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Code Panel */}
          <div className="xl:col-span-2">
            <GlassCard hover={false} className="p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
                <div className="w-3 h-3 rounded-full bg-severity-critical opacity-60" />
                <div className="w-3 h-3 rounded-full bg-severity-medium opacity-60" />
                <div className="w-3 h-3 rounded-full bg-severity-low opacity-60" />
                <span className="text-xs text-muted-foreground ml-2 font-mono">user-service.js</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <tbody>
                    {codeLines.map((line) => (
                      <tr
                        key={line.num}
                        className={`group transition-colors ${
                          line.comment
                            ? "bg-severity-medium/5 hover:bg-severity-medium/10"
                            : "hover:bg-muted/20"
                        }`}
                        onMouseEnter={() => setHoveredLine(line.num)}
                        onMouseLeave={() => setHoveredLine(null)}
                      >
                        <td className="px-4 py-0.5 text-right text-muted-foreground select-none w-10 text-xs">
                          {line.num}
                        </td>
                        <td className="px-4 py-0.5 whitespace-pre relative">
                          <span>{line.content}</span>
                          {line.comment && hoveredLine === line.num && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute left-4 top-full z-20 mt-1 p-2 rounded-lg bg-card border border-neon-cyan/30 text-xs max-w-md neon-glow-cyan"
                            >
                              <MessageSquare size={10} className="inline mr-1 text-neon-cyan" />
                              {line.comment}
                            </motion.div>
                          )}
                        </td>
                        <td className="w-8 px-2">
                          {line.comment && (
                            <MessageSquare size={12} className="text-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* AI Suggestions Panel */}
          <div>
            <GlassCard hover={false} glow>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-neon-pink" />
                <h3 className="text-sm font-semibold">AI Suggestions</h3>
              </div>
              <div className="space-y-3">
                {aiSuggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-3 rounded-lg bg-muted/30 border border-glass-border hover:border-neon-pink/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm">{s.icon}</span>
                      <div>
                        <p className="text-xs font-semibold">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
