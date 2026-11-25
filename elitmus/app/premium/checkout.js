"use client";

import { useActionState, useState } from "react";
import { activatePremium, cancelPremium } from "./actions";
import { PREMIUM_PRICE } from "@/lib/premium";
import { CheckIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

// Two steps: "Upgrade" → order summary with a clearly labelled demo payment
export function Checkout() {
  const [step, setStep] = useState("plan"); // "plan" | "pay"
  const [state, payAction, paying] = useActionState(activatePremium, null);

  if (step === "plan") {
    return (
      <button onClick={() => setStep("pay")} className="btn btn-accent w-full py-3.5 text-[15px]">
        <SparklesIcon className="size-4" />
        Get Premium · ₹{PREMIUM_PRICE}/month
      </button>
    );
  }

  return (
    <form action={payAction} className="flex animate-rise flex-col gap-4 rounded-2xl border border-line bg-paper p-4">
      <div className="flex items-center justify-between text-sm">
        <span>Premium · 1 month</span>
        <span className="font-medium">₹{PREMIUM_PRICE}.00</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Includes GST · renews monthly · cancel any time</span>
      </div>
      <div className="h-px bg-line" />
      <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
        <ShieldIcon className="mt-0.5 size-4 shrink-0" />
        Demo payment: no money is charged. In production this step opens Razorpay, and Premium turns on only after the
        payment is confirmed.
      </p>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={() => setStep("plan")} className="btn btn-ghost">
          Back
        </button>
        <button disabled={paying} className="btn btn-accent flex-1 py-3">
          {paying ? "Processing…" : `Pay ₹${PREMIUM_PRICE} (demo)`}
        </button>
      </div>
    </form>
  );
}

export function CancelButton() {
  const [confirming, setConfirming] = useState(false);
  const [state, cancelAction, cancelling] = useActionState(cancelPremium, null);

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="btn btn-ghost text-muted">
        Cancel subscription
      </button>
    );
  }
  return (
    <form action={cancelAction} className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-ink-soft">Cancel Premium? Free features stay exactly the same.</span>
      <button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost">
        Keep it
      </button>
      <button disabled={cancelling} className="btn btn-outline">
        {cancelling ? "Cancelling…" : "Yes, cancel"}
      </button>
      {state?.error && <p className="w-full text-red-600">{state.error}</p>}
    </form>
  );
}

export function Included({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-soft text-sage">
        <CheckIcon className="size-3" />
      </span>
      <span>{children}</span>
    </li>
  );
}
