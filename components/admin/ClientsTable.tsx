"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ClientDetail } from "@/lib/db";

interface ClientsTableProps {
  clients: ClientDetail[];
}

type SortField = "intake_date" | "first_name" | "last_name" | "email";
type FilterField = "first_name" | "last_name" | "email";

const SORT_LABELS: Record<SortField, string> = {
  intake_date: "Date of intake",
  first_name: "First name",
  last_name: "Last name",
  email: "Email",
};

const FILTER_LABELS: Record<FilterField, string> = {
  first_name: "First name",
  last_name: "Last name",
  email: "Email",
};

function formatDate(value: string | null): string {
  if (!value) return "Not yet";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Not yet";
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const [sortField, setSortField] = useState<SortField>("last_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filterField, setFilterField] = useState<FilterField>("last_name");
  const [filterValue, setFilterValue] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filtered = useMemo(() => {
    if (!filterValue.trim()) return clients;
    const needle = filterValue.trim().toLowerCase();
    return clients.filter((c) => (c[filterField] ?? "").toString().toLowerCase().includes(needle));
  }, [clients, filterField, filterValue]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp: number;
      if (sortField === "intake_date") {
        const aTime = a.intake_date ? new Date(a.intake_date).getTime() : 0;
        const bTime = b.intake_date ? new Date(b.intake_date).getTime() : 0;
        cmp = aTime - bTime;
      } else {
        cmp = (a[sortField] ?? "").toString().localeCompare((b[sortField] ?? "").toString(), undefined, {
          sensitivity: "base",
        });
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortField, sortDir]);

  return (
    <div>
      <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
        {/* Sort control */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: "var(--step-1)", padding: "0.55rem 1rem" }}
            onClick={() => {
              setShowSortMenu((v) => !v);
              setShowFilterMenu(false);
            }}
          >
            Sort by: {SORT_LABELS[sortField]} ({sortDir === "asc" ? "A→Z" : "Z→A"})
          </button>
          {showSortMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.4rem)",
                left: 0,
                zIndex: 10,
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius)",
                boxShadow: "0 8px 20px rgba(20,17,14,0.12)",
                padding: "var(--space-sm)",
                minWidth: "14rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => setSortField(field)}
                  className={sortField === field ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ justifyContent: "flex-start", fontSize: "var(--step-1)", padding: "0.5rem 0.75rem" }}
                >
                  {SORT_LABELS[field]}
                </button>
              ))}
              <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}>
                {(["asc", "desc"] as const).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setSortDir(dir)}
                    className={sortDir === dir ? "btn btn-primary" : "btn btn-secondary"}
                    style={{ flex: 1, fontSize: "var(--step-1)", padding: "0.5rem 0.75rem" }}
                  >
                    {dir === "asc" ? "A→Z / oldest" : "Z→A / newest"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter control */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: "var(--step-1)", padding: "0.55rem 1rem" }}
            onClick={() => {
              setShowFilterMenu((v) => !v);
              setShowSortMenu(false);
            }}
          >
            Filter by: {FILTER_LABELS[filterField]}
            {filterValue ? ` — "${filterValue}"` : ""}
          </button>
          {showFilterMenu && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.4rem)",
                left: 0,
                zIndex: 10,
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius)",
                boxShadow: "0 8px 20px rgba(20,17,14,0.12)",
                padding: "var(--space-sm)",
                minWidth: "16rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {(Object.keys(FILTER_LABELS) as FilterField[]).map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setFilterField(field)}
                    className={filterField === field ? "btn btn-primary" : "btn btn-secondary"}
                    style={{ flex: 1, fontSize: "var(--step-1)", padding: "0.5rem 0.6rem" }}
                  >
                    {FILTER_LABELS[field]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Filter by ${FILTER_LABELS[filterField].toLowerCase()}...`}
                autoFocus
              />
              {filterValue && (
                <button
                  type="button"
                  onClick={() => setFilterValue("")}
                  className="btn btn-secondary"
                  style={{ fontSize: "var(--step-1)", padding: "0.4rem 0.6rem" }}
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
        {sorted.length} client{sorted.length === 1 ? "" : "s"}
      </p>

      {sorted.length === 0 ? (
        <p style={{ color: "var(--color-ink-soft)" }}>No clients match.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sorted.map((client) => (
            <li key={client.id} className="card" style={{ marginBottom: "var(--space-sm)" }}>
              <Link href={`/portal/admin/clients/${client.id}`} style={{ textDecoration: "none" }}>
                <strong>
                  {client.first_name} {client.last_name}
                </strong>
              </Link>
              <p style={{ margin: "0.25rem 0 0", fontSize: "var(--step-1)", color: "var(--color-ink-soft)" }}>
                {client.email}
                {client.phone ? ` · ${client.phone}` : ""} &middot; {client.document_count} document
                {client.document_count === 1 ? "" : "s"} &middot; Intake: {formatDate(client.intake_date)}
              </p>
              <p style={{ margin: "0.35rem 0 0" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "var(--step-1)",
                    fontWeight: 700,
                    padding: "0.15rem 0.6rem",
                    borderRadius: "999px",
                    background: client.intake_complete
                      ? "var(--color-sage)"
                      : client.intake_started
                      ? "var(--color-accent-soft)"
                      : "var(--color-line)",
                    color: client.intake_complete ? "#ffffff" : "var(--color-ink)",
                  }}
                >
                  {client.intake_complete
                    ? "Health History complete"
                    : client.intake_started
                    ? "Health History in progress"
                    : "Health History not started"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
