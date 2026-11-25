// Radio buttons that look like tappable pills — nicer than a dropdown when there
// are only a few options. The real <input type="radio"> is visually hidden (sr-only)
// but still there, so keyboard, screen readers and form submission all keep working.
// `has-[:checked]:` styles the pill whose hidden radio is selected.

const COLUMNS = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" };

export default function ChoiceGroup({ label, name, options, defaultValue, columns = 3 }) {
  return (
    <fieldset>
      <legend className="label mb-2">{label}</legend>
      <div className={`grid gap-2 ${COLUMNS[columns]}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-center justify-center rounded-2xl border border-line bg-surface px-3 py-3 text-center text-sm font-medium text-ink-soft transition hover:border-ink/25 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ink/10"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              required
              defaultChecked={defaultValue === o.value}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
