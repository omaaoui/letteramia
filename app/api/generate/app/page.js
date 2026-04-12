"use client";
import { useState } from "react";

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
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ situation, docType, inputLang }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Error. Please try again."); setLoading(false); return; }
      setResult(json.text);
      setStep("result");
    } catch (e) {
      setError(`Error: ${e.message}`);
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d0b07 0%, #1a1209 50%, #0d0b07 100%)", fontFamily: "'Georgia', serif", color: "#e8dcc8" }}>
      <header style={{ borderBottom: `1px solid ${border}`, padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(13,11,7,0.9)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 26 }}>🇮🇹</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: gold }}>LetteraMia</div>
            <div style={{ fontSize: 10, color: textDim, letterSpacing: "0.14em", textTransform: "uppercase" }}>Expat Document Assistant · Italy</div>
          </div>
        </div>
        <a href="https://ko-fi.com" target="_blank" rel="noreferrer" style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#0a0a0a", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: "bold", textDecoration: "none" }}>☕ Support</a>
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
