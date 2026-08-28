"use client";

import { useMemo, useState } from "react";
import type { ClientDetail } from "@/lib/db";
import { EMAIL_TEMPLATES, EMAIL_FROM_ADDRESSES, renderTemplate } from "@/lib/email-templates";

interface EmailComposerProps {
  clients: ClientDetail[];
}

export default function EmailComposer({ clients }: EmailComposerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [from, setFrom] = useState(EMAIL_FROM_ADDRESSES[0] ?? "");
  const [templateId, setTemplateId] = useState(EMAIL_TEMPLATES[0]?.id ?? "");
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0]?.subject ?? "");
  const [body, setBody] = useState(EMAIL_TEMPLATES[0]?.body ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const needle = search.trim().toLowerCase();
    return clients.filter(
      (c) =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(needle) ||
        c.email.toLowerCase().includes(needle)
    );
  }, [clients, search]);

  function toggleClient(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllFiltered() {
    setSelected((prev) => {
      const next = new Set(prev);
      filteredClients.forEach((c) => next.add(c.id));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === id);
    if (tpl) {
      setSubject(tpl.subject);
      setBody(tpl.body);
    }
  }

  async function handleSend() {
    if (selected.size === 0 || !subject.trim() || !body.trim()) return;
    setStatus("sending");
    setResultMessage(null);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientIds: Array.from(selected),
          from,
          subject,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setResultMessage(data?.error ?? "Something went wrong sending these emails.");
        return;
      }
      setStatus("done");
      setResultMessage(
        `Sent to ${data.sent} of ${data.total} client${data.total === 1 ? "" : "s"}${
          data.failed ? ` (${data.failed} failed)` : ""
        }.`
      );
    } catch {
      setStatus("error");
      setResultMessage("Something went wrong sending these emails.");
    }
  }

  const previewName = clients.find((c) => selected.has(c.id))?.first_name || "there";
  const bracketPlaceholders = Array.from(new Set(body.match(/\[[^\]]+\]/g) ?? []));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--space-lg)", alignItems: "start" }}>
      {/* Recipient picker */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-1)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-ink-soft)",
            marginBottom: "var(--space-xs)",
          }}
        >
          Recipients ({selected.size} selected)
        </p>

        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "var(--space-xs)" }}
        />

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "var(--space-sm)" }}>
          <button type="button" onClick={selectAllFiltered} className="btn btn-secondary" style={{ fontSize: "var(--step-1)", padding: "0.4rem 0.75rem" }}>
            Select all shown
          </button>
          <button type="button" onClick={clearSelection} className="btn btn-secondary" style={{ fontSize: "var(--step-1)", padding: "0.4rem 0.75rem" }}>
            Clear
          </button>
        </div>

        <div
          style={{
            border: "1px solid var(--color-line)",
            borderRadius: "var(--radius)",
            background: "var(--color-surface)",
            maxHeight: "24rem",
            overflowY: "auto",
          }}
        >
          {filteredClients.length === 0 ? (
            <p style={{ padding: "var(--space-sm)", color: "var(--color-ink-soft)", margin: 0 }}>No clients match.</p>
          ) : (
            filteredClients.map((client) => (
              <label
                key={client.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 0.85rem",
                  borderBottom: "1px solid var(--color-line)",
                  cursor: "pointer",
                  fontSize: "var(--step-1)",
                }}
              >
                <input type="checkbox" checked={selected.has(client.id)} onChange={() => toggleClient(client.id)} />
                <span>
                  <strong>
                    {client.first_name} {client.last_name}
                  </strong>{" "}
                  <span style={{ color: "var(--color-ink-soft)" }}>{client.email}</span>
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Composer */}
      <div>
        <div className="field">
          <label>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            {EMAIL_FROM_ADDRESSES.map((addr) => (
              <option key={addr} value={addr}>
                {addr}
              </option>
            ))}
          </select>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step-1)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--color-ink-soft)",
            marginBottom: "var(--space-xs)",
          }}
        >
          Template
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "var(--space-sm)" }}>
          {EMAIL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => applyTemplate(tpl.id)}
              className={templateId === tpl.id ? "btn btn-primary" : "btn btn-secondary"}
              style={{ fontSize: "var(--step-1)", padding: "0.5rem 0.85rem" }}
            >
              {tpl.label}
            </button>
          ))}
        </div>

        <div className="field">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="field">
          <label>
            Body
            <span style={{ display: "block", fontWeight: 400, color: "var(--color-ink-soft)", fontSize: "var(--step-1)" }}>
              <code>{"{{firstName}}"}</code> and the Health History / Food Diary / Temperature Record links fill in
              automatically. Anything in [SQUARE BRACKETS] is different for each client — replace it here before sending.
            </span>
          </label>
          <textarea rows={22} value={body} onChange={(e) => setBody(e.target.value)} style={{ fontFamily: "var(--font-body)" }} />
        </div>

        {bracketPlaceholders.length > 0 && (
          <div
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius)",
              padding: "var(--space-sm)",
              marginBottom: "var(--space-sm)",
              fontSize: "var(--step-1)",
            }}
          >
            <strong>Still needs filling in:</strong>
            <ul style={{ margin: "0.35rem 0 0", paddingLeft: "1.1rem" }}>
              {bracketPlaceholders.map((ph) => (
                <li key={ph}>{ph}</li>
              ))}
            </ul>
          </div>
        )}

        <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
          Preview greeting: "{renderTemplate(body.split("\n")[0] || "", { firstName: previewName })}"
        </p>

        <button
          type="button"
          onClick={handleSend}
          disabled={selected.size === 0 || status === "sending"}
          className="btn btn-primary"
          style={{ marginTop: "var(--space-sm)" }}
        >
          {status === "sending" ? "Sending..." : `Send to ${selected.size} client${selected.size === 1 ? "" : "s"}`}
        </button>

        {resultMessage && (
          <p style={{ marginTop: "var(--space-sm)", color: status === "error" ? "var(--color-danger)" : "var(--color-sage)" }}>
            {resultMessage}
          </p>
        )}
      </div>
    </div>
  );
}
