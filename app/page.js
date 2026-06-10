"use client";
import { useState } from "react";
import Logo from "./components/Logo";

const DOC_TYPES = [
  { id: "residenza", label: "Residenza / Anagrafe", icon: "🏛️" },
  { id: "landlord", label: "Landlord / Affitto", icon: "🏠" },
  { id: "bank", label: "Bank / Banca", icon: "🏦" },
  { id: "work", label: "Work / Lavoro", icon: "💼" },
  { id: "asl", label: "ASL / Healthcare", icon: "🏥" },
  { id: "complaint", label: "Complaint / Reclamo", icon: "⚖️" },
  { id: "other", label: "Other / Altro", icon: "📄" },
];

const LANGS = ["English", "Français", "العربية", "Italiano"];

export default function App() {
  const [step, setStep] = useState("form");
  const [docType, setDocType] = useState(null);
  const [inputLang, setInputLang] = useState("English");
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!docType || !situation.trim()) return;
    setLoading(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation, docType, inputLang }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Error. Please try again."); setLoading(false); return; }
      setResult(json.text);
      setStep("result");
    } catch (e) {
      clearTimeout(timeout);
      setError(e.name === "AbortError" ? "Request timed out. Please try again." : `Error: ${e.message}`);
    }
    setLoading(false);
  }

  function parseResult(raw) {
    const italianMatch = raw.match(/---ITALIAN---\n([\s\S]*?)---SUMMARY---/);
    const summaryMatch = raw.match(/---SUMMARY---\n([\s\S]*)/);
    return {
      italian: italianMatch ? italianMatch[1].trim() : raw,
      summary: summaryMatch ? summaryMatch[1].trim() : "",
    };
  }

  function reset() { setStep("form"); setResult(""); setSituation(""); setDocType(null); setError(""); }

  const { italian, summary } = result ? parseResult(result) : { italian: "", summary: "" };
  const gold = "#c9a84c"; const goldLight = "#e8c86a"; const border = "#2a2010"; const textMuted = "#9a8a6a"; const textDim = "#5a4a2a";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d0b07 0%, #1a1209 50%, #0d0b07 100%)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif", color: "#e8dcc8" }}>
      <header style={{ borderBottom: `1px solid ${border}`, padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(13,11,7,0.9)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Logo variant="dark" size="sm" />
        </div>
        <a href="https://ko-fi.com/omaoui" target="_blank" rel="noreferrer" style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#0a0a0a", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: "bold", textDecoration: "none" }}>☕ Support</a>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        {step === "form" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: "bold", color: gold, lineHeight: 1.2, marginBottom: 12, fontStyle: "italic" }}>Write it in Italian.<br />Perfectly.</h1>
              <p style={{ color: textMuted, fontSize: 15, lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>Describe your situation in any language — get a formal Italian document ready to send.</p>
            </div>

            <section style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: textDim, display: "block", marginBottom: 12 }}>1 · Type of document</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 9 }}>
                {DOC_TYPES.map((d) => (
                  <button key={d.id} onClick={() => setDocType(d.id)} style={{ background: docType === d.id ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${docType === d.id ? gold : border}`, color: docType === d.id ? gold : textMuted, padding: "11px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
                    <span>{d.icon}</span>{d.label}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: textDim, display: "block", marginBottom: 12 }}>2 · Your language</label>
              <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setInputLang(l)} style={{ background: inputLang === l ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)", border: `1px solid ${inputLang === l ? gold : border}`, color: inputLang === l ? gold : textMuted, padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", color: textDim, display: "block", marginBottom: 12 }}>3 · Describe your situation</label>
              <textarea value={situation} onChange={(e) => setSituation(e.target.value)} placeholder={`E.g. "I registered for residenza 3 months ago and haven't heard back. I want to follow up with the Municipio."`} rows={5}
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${border}`, borderRadius: 10, color: "#e8dcc8", fontSize: 15, padding: "16px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, outline: "none", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = gold)} onBlur={(e) => (e.target.style.borderColor = border)} />
            </section>

            {error && <div style={{ color: "#d08080", fontSize: 12, marginBottom: 16, padding: "12px 16px", background: "rgba(180,60,60,0.08)", borderRadius: 8, border: "1px solid #5a2a2a", fontFamily: "monospace", wordBreak: "break-word" }}>{error}</div>}

            <button onClick={generate} disabled={!docType || !situation.trim() || loading}
              style={{ width: "100%", background: (!docType || !situation.trim()) ? "#1a1409" : `linear-gradient(135deg, ${gold}, ${goldLight})`, color: (!docType || !situation.trim()) ? textDim : "#0a0a0a", border: "none", padding: "17px", borderRadius: 10, fontSize: 16, fontWeight: "bold", cursor: (!docType || !situation.trim()) ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "✍️  Drafting your letter…" : "✨  Generate Italian Document"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: textDim, marginTop: 14 }}>Not legal advice · For administrative assistance only</p>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button onClick={reset} style={{ background: "none", border: `1px solid ${border}`, color: textMuted, padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← New document</button>
            </div>
            {summary && (
              <div style={{ background: "rgba(201,168,76,0.06)", border: `1px solid ${border}`, borderRadius: 10, padding: "16px 20px", marginBottom: 22, fontSize: 14, color: "#b0985a", lineHeight: 1.7 }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: textDim, display: "block", marginBottom: 6 }}>Summary</span>
                {summary}
              </div>
            )}
            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${border}`, borderRadius: 10, padding: "26px", fontSize: 15, lineHeight: 1.95, color: "#ddd0b8", whiteSpace: "pre-wrap", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif", marginBottom: 18 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: textDim, marginBottom: 14 }}>🇮🇹 Italian Document</div>
              {italian}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { navigator.clipboard.writeText(italian); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ flex: 1, background: copied ? "rgba(70,120,50,0.2)" : "rgba(201,168,76,0.1)", border: `1px solid ${copied ? "#4a8a3a" : gold}`, color: copied ? "#7aba6a" : gold, padding: "14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: "bold", fontFamily: "inherit" }}>
                {copied ? "✓ Copied!" : "📋 Copy Document"}
              </button>
              <a href="https://ko-fi.com/omaoui" target="_blank" rel="noreferrer" style={{ flex: 1, background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#0a0a0a", padding: "14px", borderRadius: 8, fontSize: 14, fontWeight: "bold", textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>☕ Support the project</a>
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: textDim, marginTop: 18, lineHeight: 1.7 }}>Replace all [PLACEHOLDER] fields before sending.<br />Not legal advice.</p>
          </>
        )}
      </main>
    </div>
  );
}
