// A labelled dropdown, shared by onboarding and settings.
// defaultValue = "" shows a "Choose..." placeholder; pass a value to pre-select it.
export default function SelectField({ label, name, options, defaultValue = "" }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <select name={name} required defaultValue={defaultValue} className="rounded border p-2">
        <option value="" disabled>
          Choose...
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
