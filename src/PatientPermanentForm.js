import React from "react";

export default function PatientPermanentForm({ patientPermanent, onChange }) {
  function update(field, value) {
    onChange({ ...patientPermanent, [field]: value });
  }

  function updateArray(field, idx, subfield, value) {
    const next = structuredClone(patientPermanent);
    next[field][idx][subfield] = value;
    onChange(next);
  }

  function updateList(field, valueAsText) {
    const list = valueAsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ ...patientPermanent, [field]: list });
  }

  return (
    <div
      style={{
        padding: "16px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "16px", fontWeight: 600 }}>
        Patient Permanent Info (always prints)
      </h2>

      <LabeledInput
        label="Name"
        value={patientPermanent.name}
        onChange={(v) => update("name", v)}
      />

      <LabeledInput
        label="DOB"
        value={patientPermanent.dob}
        onChange={(v) => update("dob", v)}
      />

      <LabeledInput
        label="MRN"
        value={patientPermanent.mrn}
        onChange={(v) => update("mrn", v)}
      />

      <SectionLabel text="Chronic Problems (comma separated)" />
      <LabeledInput
        label="Chronic Problems"
        value={patientPermanent.chronicProblems.join(", ")}
        onChange={(v) => updateList("chronicProblems", v)}
      />

      <SectionLabel text="Allergies" />
      {patientPermanent.allergies.map((a, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "8px",
          }}
        >
          <LabeledInput
            label="Allergen"
            value={a.item}
            onChange={(v) => updateArray("allergies", idx, "item", v)}
          />
          <LabeledInput
            label="Reaction"
            value={a.reaction}
            onChange={(v) => updateArray("allergies", idx, "reaction", v)}
          />
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#111",
        marginTop: "16px",
        marginBottom: "8px",
        borderLeft: "3px solid #000",
        paddingLeft: "6px",
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
}

function LabeledInput({ label, value, onChange }) {
  return (
    <label
      style={{
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        color: "#111",
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: "14px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #bbb",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
        }}
      />
    </label>
  );
}
