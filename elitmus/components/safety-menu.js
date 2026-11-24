"use client";

import { useActionState, useState } from "react";
import { blockUser, reportUser } from "@/app/safety/actions";
import { REPORT_REASONS } from "@/lib/options";

export default function SafetyMenu({ userId, name }) {
  const [mode, setMode] = useState(null); // null | "block" | "report"
  const [blockState, blockAction, blockPending] = useActionState(blockUser, null);
  const [reportState, reportAction, reportPending] = useActionState(reportUser, null);

  if (mode === null) {
    return (
      <div id="safety" className="flex gap-4 py-4 text-sm text-gray-500">
        <button onClick={() => setMode("block")} className="underline">
          Block {name}
        </button>
        <button onClick={() => setMode("report")} className="underline">
          Report
        </button>
      </div>
    );
  }

  if (mode === "block") {
    return (
      <form id="safety" action={blockAction} className="flex w-full max-w-md flex-col gap-3 rounded-lg border p-4">
        <input type="hidden" name="user_id" value={userId} />
        <p className="font-medium">Block {name}?</p>
        <p className="text-sm text-gray-600">
          You won&apos;t see each other anywhere, and any match or chat between you will be removed.
          They won&apos;t be notified.
        </p>
        {blockState?.error && <p className="text-sm text-red-600">{blockState.error}</p>}
        <div className="flex gap-2">
          <button disabled={blockPending} className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50">
            {blockPending ? "Blocking..." : "Block"}
          </button>
          <button type="button" onClick={() => setMode(null)} className="px-4 py-2 text-sm">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <form id="safety" action={reportAction} className="flex w-full max-w-md flex-col gap-3 rounded-lg border p-4">
      <input type="hidden" name="user_id" value={userId} />
      <p className="font-medium">Report {name}</p>
      <select name="reason" required defaultValue="" className="rounded border p-2">
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
        className="rounded border p-2"
      />
      <p className="text-xs text-gray-500">
        Our team reviews every report. {name} won&apos;t know you reported them, and they&apos;ll be blocked for you
        right away.
      </p>
      {reportState?.error && <p className="text-sm text-red-600">{reportState.error}</p>}
      <div className="flex gap-2">
        <button disabled={reportPending} className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50">
          {reportPending ? "Sending..." : "Report and block"}
        </button>
        <button type="button" onClick={() => setMode(null)} className="px-4 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}