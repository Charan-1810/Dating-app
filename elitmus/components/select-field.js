// A labelled dropdown, shared by onboarding and settings.
// defaultValue = "" shows a "Choose..." placeholder; pass a value to pre-select it.
export default function SelectField({ label, name, options, defaultValue = "" }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label">{label}</span>
      <select name={name} required defaultValue={defaultValue} className="field">
        <option value="" disabled>
          Choose…
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
