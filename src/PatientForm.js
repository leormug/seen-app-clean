import React from "react";

export default function PatientForm({ patient, onChange }) {
  function update(path, value) {
    const next = structuredClone(patient);
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) {
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    onChange(next);
  }

  return (
    <div style={{ padding: "16px", background: "#fff", borderBottom: "1px solid #ddd" }}>
      <h2 style={{ marginTop: 0, fontSize: "16px", fontWeight: 600 }}>
        Patient Info Editor
      </h2>

      <Section title="Identity">
        <Field
          label="Name"
          value={patient.name}
          onChange={(v) => update(["name"], v)}
        />
        <Field
          label="DOB"
          value={patient.dob}
          onChange={(v) => update(["dob"], v)}
        />
        {/* <Field
          label="MRN"
          value={patient.mrn}
          onChange={(v) => update(["mrn"], v)}
        /> */}
      </Section>

      {/* <Section title="Vitals">
        <Field
          label="BP"
          value={patient.vitals.bp}
          onChange={(v) => update(["vitals", "bp"], v)}
        />
        <Field
          label="HR"
          value={patient.vitals.hr}
          onChange={(v) => update(["vitals", "hr"], v)}
        />
        <Field
          label="Temp"
          value={patient.vitals.temp}
          onChange={(v) => update(["vitals", "temp"], v)}
        />
        <Field
          label="SpO₂"
          value={patient.vitals.spo2}
          onChange={(v) => update(["vitals", "spo2"], v)}
        />
        <Field
          label="Weight"
          value={patient.vitals.weight}
          onChange={(v) => update(["vitals", "weight"], v)}
        />
      </Section> */}

      <Section title="Problems (comma separated)">
        <Field
          label="Active Problems"
          value={patient.problems.join(", ")}
          onChange={(v) => {
            const list = v.split(",").map(s => s.trim()).filter(Boolean);
            onChange({ ...patient, problems: list });
          }}
        />
      </Section>

      <Section title="Meds">
        {patient.meds.map((m, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            <Field
              label="Name"
              value={m.name}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.meds[idx].name = v;
                onChange(next);
              }}
            />
            <Field
              label="Dose"
              value={m.dose}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.meds[idx].dose = v;
                onChange(next);
              }}
            />
            <Field
              label="Schedule"
              value={m.freq}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.meds[idx].freq = v;
                onChange(next);
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Allergies">
        {patient.allergies.map((a, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            <Field
              label="Allergen"
              value={a.item}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.allergies[idx].item = v;
                onChange(next);
              }}
            />
            <Field
              label="Reaction"
              value={a.reaction}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.allergies[idx].reaction = v;
                onChange(next);
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Labs">
        {patient.labs.map((lab, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              marginBottom: "8px",
            }}
          >
            <Field
              label="Test"
              value={lab.test}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.labs[idx].test = v;
                onChange(next);
              }}
            />
            <Field
              label="Value"
              value={lab.value}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.labs[idx].value = v;
                onChange(next);
              }}
            />
            <Field
              label="Date"
              value={lab.date}
              onChange={(v) => {
                const next = structuredClone(patient);
                next.labs[idx].date = v;
                onChange(next);
              }}
            />
          </div>
        ))}
      </Section>

      {/* <Section title="Notes">
        <Field
          label="Clinician Notes"
          textarea
          value={patient.notes}
          onChange={(v) => update(["notes"], v)}
        />
      </Section> */}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#111",
          marginBottom: "8px",
          borderLeft: "3px solid #000",
          paddingLeft: "6px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, textarea }) {
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
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            minHeight: "60px",
            fontSize: "14px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #bbb",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif",
          }}
        />
      ) : (
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
              "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Roboto, sans-serif",
          }}
        />
      )}
    </label>
  );
}
