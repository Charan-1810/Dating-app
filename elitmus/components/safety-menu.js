"use client";

import { useActionState, useState } from "react";
import { blockUser, reportUser } from "@/app/safety/actions";
import { REPORT_REASONS } from "@/lib/options";
import { BanIcon, FlagIcon, ShieldIcon } from "./icons";

export default function SafetyMenu({ userId, name }) {
  const [mode, setMode] = useState(null); // null | "block" | "report"
  const [blockState, blockAction, blockPending] = useActionState(blockUser, null);
  const [reportState, reportAction, reportPending] = useActionState(reportUser, null);

  if (mode === null) {
    return (
      <div id="safety" className="flex scroll-mt-20 flex-col items-center gap-3 pt-6 pb-2">
        <div className="flex gap-2">
          <button onClick={() => setMode("block")} className="btn btn-ghost text-muted">
            <BanIcon className="size-4" />
            Block {name}
          </button>
          <button onClick={() => setMode("report")} className="btn btn-ghost text-muted">
            <FlagIcon className="size-4" />
            Report
          </button>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <ShieldIcon className="size-3.5" />
          Blocking and reporting are always free and anonymous.
        </p>
      </div>
    );
  }

  if (mode === "block") {
    return (
      <form id="safety" action={blockAction} className="card flex scroll-mt-20 animate-rise flex-col gap-3 p-5">
        <input type="hidden" name="user_id" value={userId} />
        <p className="font-display text-xl">Block {name}?</p>
        <p className="text-sm leading-relaxed text-ink-soft">
          You won&apos;t see each other anywhere, and any match or chat between you will be removed.
          They won&apos;t be notified.
        </p>
        {blockState?.error && <p className="text-sm text-red-600">{blockState.error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setMode(null)} className="btn btn-ghost">
            Cancel
          </button>
          <button disabled={blockPending} className="btn btn-danger">
            {blockPending ? "Blocking…" : "Block"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form id="safety" action={reportAction} className="card flex scroll-mt-20 animate-rise flex-col gap-3 p-5">
      <input type="hidden" name="user_id" value={userId} />
      <p className="font-display text-xl">Report {name}</p>
      <select name="reason" required defaultValue="" className="field">
        <option value="" disabled>
          What&apos;s wrong?
        </option>
        {REPORT_REASONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <textarea
        name="details"
        maxLength={1000}
        rows={3}
        placeholder="Anything else we should know? (optional)"
        className="field resize-none"
      />
      <p className="text-xs leading-relaxed text-muted">
        Our team reviews every report. {name} won&apos;t know you reported them, and they&apos;ll be blocked for you
        right away.
      </p>
      {reportState?.error && <p className="text-sm text-red-600">{reportState.error}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setMode(null)} className="btn btn-ghost">
          Cancel
        </button>
        <button disabled={reportPending} className="btn btn-danger">
          {reportPending ? "Sending…" : "Report and block"}
        </button>
      </div>
    </form>
  );
}
