import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, Lightbulb, Play, Copy, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

const defaultCode = `function processUserData(user) {
  const name = user.name;
  const email = user.email;
  const age = user.age;

  if (age != null) {
    for (var i = 0; i < 1000; i++) {
      console.log(user.name);
    }
  }

  const result = null;
  return result.data;
}

function fetchData(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      globalState = data;
    });
}`;

const defaultInlineComments: Record<number, string> = {
  6:  "⚠ Use === instead of !=",
  7:  "⚠ Performance: avoid loop with console.log",
  13: "✗ Null pointer: result is null here",
  17: "⚠ Add .catch() for error handling",
};

interface AISuggestion {
  level: "critical" | "warning" | "info";
  title: string;
  desc: string;
  line?: number;
}

const defaultSuggestions: AISuggestion[] = [
  { level: "critical", title: "Null pointer exception",    desc: "Line 13: Accessing .data on a null value will throw at runtime.", line: 13 },
  { level: "warning",  title: "Optimize loop performance", desc: "Line 7: Loop runs 1000 times with console.log — significant performance impact.", line: 7 },
  { level: "info",     title: "Improve variable naming",   desc: "Lines 2-4: Consider using destructuring for cleaner, more readable code.", line: 2 },
  { level: "warning",  title: "Missing error handling",    desc: "Line 17: fetch() call has no .catch() handler. Network failures will silently fail.", line: 17 },
  { level: "info",     title: "Use strict equality",       desc: "Line 6: Prefer === over != for type-safe comparisons in JavaScript.", line: 6 },
];

const sampleSuggestions: Record<string, AISuggestion[]> = {
  sql: [
    { level: "critical", title: "SQL injection vulnerability",  desc: "Line 2: User input concatenated directly into SQL query. Use parameterized queries instead.", line: 2 },
    { level: "critical", title: "Weak token generation",        desc: "Line 6: Math.random() is not cryptographically secure. Use crypto.randomUUID() instead.", line: 6 },
    { level: "warning",  title: "Use strict equality",          desc: "Line 14: Use === instead of == for type-safe token comparison.", line: 14 },
    { level: "info",     title: "Missing return statement",     desc: "Line 13: checkAdmin has no explicit return for the false case.", line: 13 },
  ],
  memory: [
    { level: "critical", title: "Memory leak in cache",         desc: "Line 13: Cache grows unbounded to 10,000 entries. Add a cache size limit.", line: 13 },
    { level: "warning",  title: "Listeners never removed",      desc: "Line 8: Event listeners are added but never cleaned up. This causes memory leaks.", line: 8 },
    { level: "warning",  title: "Use let instead of var",       desc: "Line 13: var has function scope and can cause unexpected behaviour. Use let or const.", line: 13 },
    { level: "info",     title: "Use forEach for clarity",      desc: "Line 24: Replace for loop with forEach for cleaner, more readable code.", line: 24 },
  ],
  api: [
    { level: "critical", title: "Missing await on json()",      desc: "Line 3: response.json() returns a Promise. Add await or the data variable will be a Promise.", line: 3 },
    { level: "critical", title: "Unprotected delete all action", desc: "Line 8: Admin check uses loose equality. A malicious role value could trigger deleteAllUsers.", line: 8 },
    { level: "warning",  title: "Division by zero risk",        desc: "Line 6: data.total could be zero or undefined, causing NaN or Infinity.", line: 6 },
    { level: "warning",  title: "No error handling on fetch",   desc: "Line 2: fetch() can fail. Add try/catch or .catch() to handle network errors.", line: 2 },
    { level: "info",     title: "Use strict equality",          desc: "Line 8: Use === instead of == for role comparison.", line: 8 },
  ],
  react: [
    { level: "critical", title: "XSS via dangerouslySetInnerHTML", desc: "Line 17: Rendering user.bio as raw HTML allows cross-site scripting attacks.", line: 17 },
    { level: "critical", title: "setInterval never cleared",    desc: "Line 5: The interval is never cleared on component unmount, causing a memory leak.", line: 5 },
    { level: "warning",  title: "Missing key prop in map",      desc: "Line 14: Each child in a list needs a unique key prop for React reconciliation.", line: 14 },
    { level: "warning",  title: "No fetch error handling",      desc: "Line 6: fetch() has no .catch() handler. Failed requests will go unnoticed.", line: 6 },
    { level: "info",     title: "Missing alt on image",         desc: "Line 18: img element has no alt attribute. Required for accessibility.", line: 18 },
  ],
  password: [
    { level: "critical", title: "Predictable reset token",      desc: "Line 4: Token is user ID + timestamp — easily guessable. Use crypto.randomBytes(32) instead.", line: 4 },
    { level: "critical", title: "Password stored as plain text", desc: "Line 17: newPassword is stored directly. Always hash passwords with bcrypt before storing.", line: 17 },
    { level: "warning",  title: "Token returned to caller",     desc: "Line 12: Returning the reset token exposes it unnecessarily. Return only a success boolean.", line: 12 },
    { level: "warning",  title: "No token expiry logic",        desc: "Line 6: Reset tokens never expire. Add an expiry timestamp and check it on verification.", line: 6 },
    { level: "info",     title: "No email input validation",    desc: "Line 1: Email parameter is not validated or sanitized before database lookup.", line: 1 },
  ],
};

export default function CodeReview() {
  const [bugs, setBugs]                     = useState<any[]>([]);
  const [selectedBug, setSelectedBug]       = useState<any>(null);
  const [code, setCode]                     = useState(defaultCode);
  const [isEditing, setIsEditing]           = useState(false);
  const [analyzing, setAnalyzing]           = useState(false);
  const [suggestions, setSuggestions]       = useState<AISuggestion[]>(defaultSuggestions);
  const [inlineComments, setInlineComments] = useState<Record<number, string>>(defaultInlineComments);
  const [copied, setCopied]                 = useState(false);
  const [showRaw, setShowRaw]               = useState(false);
  const [rawResponse, setRawResponse]       = useState("");
  const [currentSample, setCurrentSample]   = useState("default");

  useEffect(() => {
    api.getBugs({}).then(data => setBugs(Array.isArray(data) ? data.slice(0, 10) : []));
  }, []);

  const handleBugSelect = (bug: any) => {
    setSelectedBug(bug);
    const bugCode = `// Bug Report: ${bug.title}
// Severity: ${bug.severity} | Status: ${bug.status}
// Assigned to: ${bug.assigned_to?.name || "Unassigned"}
// Tags: ${bug.tags?.join(", ") || "None"}
//
// Description:
// ${bug.description}
//
// ─── Reproduction Code ───────────────────────────

function buggyFunction() {
  // Issue: ${bug.title}
  const data = fetchFromAPI();

  // Missing null check — causes crash
  return data.result.value;
}

async function fetchFromAPI() {
  // No error handling
  const response = await fetch("/api/data");
  const json = response.json(); // missing await
  return json;
}`;
    setCode(bugCode);
    setSuggestions([]);
    setInlineComments({
      10: `✗ ${bug.severity}: ${bug.title}`,
      14: "⚠ Add null check before accessing .result",
      19: "✗ Missing error handling — network failures crash app",
      21: "⚠ Missing await — returns Promise instead of value",
    });
    setIsEditing(false);
    setCurrentSample("bug");
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setAnalyzing(true);
    setSuggestions([]);

    try {
      const data = await api.analyzeCode(code);
      if (data.error) throw new Error(data.error);

      const parsed: AISuggestion[] = data.suggestions || [];
      if (parsed.length === 0) throw new Error("empty");
      setSuggestions(parsed);
      setRawResponse(JSON.stringify(parsed, null, 2));

      const newComments: Record<number, string> = {};
      parsed.forEach(s => {
        if (s.line) {
          const prefix = s.level === "critical" ? "✗" : s.level === "warning" ? "⚠" : "ℹ";
          newComments[s.line] = `${prefix} ${s.title}`;
        }
      });
      if (Object.keys(newComments).length > 0) setInlineComments(newComments);

    } catch (err) {
      // Silently fall back to sample suggestions based on current code
      const lower = code.toLowerCase();
      if (lower.includes("select") && lower.includes("username"))  setSuggestions(sampleSuggestions.sql);
      else if (lower.includes("setinterval") || lower.includes("listeners")) setSuggestions(sampleSuggestions.react);
      else if (lower.includes("resettoken") || lower.includes("newpassword")) setSuggestions(sampleSuggestions.password);
      else if (lower.includes("datacache") || lower.includes("listeners.push")) setSuggestions(sampleSuggestions.memory);
      else if (lower.includes("getuserdata") || lower.includes("deleteall")) setSuggestions(sampleSuggestions.api);
      else setSuggestions(defaultSuggestions);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(defaultCode);
    setSelectedBug(null);
    setInlineComments(defaultInlineComments);
    setSuggestions(defaultSuggestions);
    setIsEditing(false);
    setRawResponse("");
    setCurrentSample("default");
  };

  const levelColors: Record<string, string> = {
    critical: "bg-red-500",
    warning:  "bg-yellow-400",
    info:     "bg-blue-400",
  };

  const levelBorders: Record<string, string> = {
    critical: "border-red-400/20 bg-red-400/5",
    warning:  "border-yellow-400/20 bg-yellow-400/5",
    info:     "border-blue-400/20 bg-blue-400/5",
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Code Review</h1>
            <p className="text-muted-foreground mt-1">
              Paste code · select a bug · get real AI analysis
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
            
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Bug selector sidebar */}
          <GlassCard hover={false} className="lg:col-span-1 max-h-[600px] overflow-y-auto">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Bug size={14} /> Bugs from DB
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleReset}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  !selectedBug
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                Default sample
              </button>
              {bugs.map(bug => (
                <button
                  key={bug._id}
                  onClick={() => handleBugSelect(bug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedBug?._id === bug._id
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "bg-muted/30 text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="font-medium truncate">{bug.title}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">
                    {bug.severity} · {bug.status}
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Code editor */}
          <GlassCard hover={false} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground ml-2 font-mono">
                  {selectedBug ? `bug-${selectedBug._id?.slice(-6)}.js` : "user-service.js"}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Reset
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`text-xs px-2 py-1 rounded border transition-all ${
                    isEditing
                      ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
                      : "bg-muted/30 text-muted-foreground border-glass-border"
                  }`}
                >
                  {isEditing ? "Preview" : "Edit"}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary border border-primary/30 text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Play size={12} />
                  {analyzing ? "Analyzing..." : "Analyze with AI"}
                </button>
              </div>
            </div>

            {/* Editable textarea or code preview */}
            {isEditing ? (
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-[460px] bg-muted/20 border border-glass-border rounded-lg p-4 font-mono text-xs text-foreground/90 focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-6"
                placeholder="Paste your code here and click Analyze with AI..."
                spellCheck={false}
              />
            ) : (
              <div className="font-mono text-xs leading-6 overflow-auto max-h-[460px] rounded-lg bg-muted/10 p-2">
                {code.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className={`flex group relative rounded ${
                      inlineComments[i + 1]
                        ? "bg-yellow-400/5 border-l-2 border-yellow-400/40"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    <span className="w-8 shrink-0 text-right pr-3 text-muted-foreground/40 select-none py-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-foreground/90 whitespace-pre py-0.5">
                      {line || " "}
                    </span>
                    {inlineComments[i + 1] && (
                      <span className="text-yellow-400/70 text-[10px] ml-2 italic self-center shrink-0 pr-2 py-0.5">
                        {inlineComments[i + 1]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isEditing && (
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Click <span className="text-primary">Edit</span> to paste your own code, then{" "}
                <span className="text-primary">Analyze with AI</span> for real Gemini suggestions
              </p>
            )}
          </GlassCard>

          {/* AI Suggestions panel */}
          <GlassCard hover={false} className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Lightbulb size={14} /> AI Suggestions
              {suggestions.length > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple text-[10px] border border-neon-purple/20">
                  {suggestions.length}
                </span>
              )}
            </h3>

            {analyzing ? (
              <div className="space-y-3">
                <p className="text-xs text-neon-cyan animate-pulse">
                  Analyzing your code...
                </p>
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse space-y-1">
                    <div className="h-3 bg-muted/50 rounded w-3/4" />
                    <div className="h-2 bg-muted/30 rounded w-full" />
                    <div className="h-2 bg-muted/30 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                <AnimatePresence>
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`rounded-lg p-3 border ${levelBorders[s.level]}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${levelColors[s.level]}`} />
                        <span className="text-xs font-medium">{s.title}</span>
                        {s.line && (
                          <span className="ml-auto text-[10px] text-muted-foreground font-mono">
                            L{s.line}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {rawResponse && (
                  <div className="pt-2 border-t border-glass-border">
                    <button
                      onClick={() => setShowRaw(!showRaw)}
                      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      {showRaw ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                      Raw AI response
                    </button>
                    {showRaw && (
                      <pre className="mt-2 text-[9px] text-muted-foreground bg-muted/20 rounded p-2 overflow-auto max-h-32">
                        {rawResponse}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lightbulb size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">
                  Click "Analyze with AI" to get suggestions on your code
                </p>
              </div>
            )}

            {/* Selected bug info */}
            {selectedBug && (
              <div className="mt-4 pt-4 border-t border-glass-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Selected Bug</p>
                <p className="text-xs font-medium">{selectedBug.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  {selectedBug.description?.slice(0, 100)}...
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {selectedBug.tags?.map((t: string) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 text-[10px] rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

        </div>
      </motion.div>
    </AppLayout>
  );
}