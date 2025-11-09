import React from "react";

export default function VisitForm({ visitData, onChange }) {
  function update(path, value) {
    const next = structuredClone(visitData);
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) {
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    onChange(next);
  }

  function updateArray(field, idx, subfield, value) {
    const next = structuredClone(visitData);
    next[field][idx][subfield] = value;
    onChange(next);
  }

  function updateList(field, valueAsText) {
    const list = valueAsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ ...visitData, [field]: list });
  }

  // Add/remove meds
  function addMed() {
    const next = structuredClone(visitData);
    next.meds.push({ name: "", dose: "", freq: "" });
    onChange(next);
  }

  function removeMed(idx) {
    const next = structuredClone(visitData);
    next.meds.splice(idx, 1);
    if (next.meds.length === 0) {
      next.meds.push({ name: "", dose: "", freq: "" });
    }
    onChange(next);
  }

  // Add/remove labs
  function addLab() {
    const next = structuredClone(visitData);
    next.labs.push({ test: "", value: "", date: "" });
    onChange(next);
  }

  function removeLab(idx) {
    const next = structuredClone(visitData);
    next.labs.splice(idx, 1);
    if (next.labs.length === 0) {
      next.labs.push({ test: "", value: "", date: "" });
    }
    onChange(next);
  }

  return (
    <div
      style={{
        padding: "16px",
        borderBottom: "1px solid #ddd",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0, fontSize: "16px", fontWeight: 600 }}>
  Visit Info (only this visit)
</h2>

<LabeledInput
  label="Attending / Provider for this visit"
  value={visitData.provider}
  onChange={(v) => update(["provider"], v)}
/>

<LabeledInput
  label="Last Updated"
  value={visitData.lastUpdated}
  onChange={() => {}}
/>


      <SectionLabel text="Symptoms / Chief Concern" />
      <LabeledTextarea
        label="Symptoms / Story"
        value={visitData.symptoms}
        onChange={(v) => update(["symptoms"], v)}
      />

      <SectionLabel text="Today's Problems (comma separated)" />
      <LabeledInput
        label="Problems Today"
        value={visitData.problemsToday.join(", ")}
        onChange={(v) => updateList("problemsToday", v)}
      />

      <SectionLabel text="Vitals" />
      <TwoCol>
        <LabeledInput
          label="BP"
          value={visitData.vitals.bp}
          onChange={(v) => update(["vitals", "bp"], v)}
        />
        <LabeledInput
          label="HR"
          value={visitData.vitals.hr}
          onChange={(v) => update(["vitals", "hr"], v)}
        />
        <LabeledInput
          label="Temp"
          value={visitData.vitals.temp}
          onChange={(v) => update(["vitals", "temp"], v)}
        />
        <LabeledInput
          label="SpO₂"
          value={visitData.vitals.spo2}
          onChange={(v) => update(["vitals", "spo2"], v)}
        />
        <LabeledInput
          label="Weight"
          value={visitData.vitals.weight}
          onChange={(v) => update(["vitals", "weight"], v)}
        />
      </TwoCol>

      {/* Meds editor with add/remove */}
      <SectionLabel text="Meds for this visit" />
      {visitData.meds.map((m, idx) => (
        <Box key={idx}>
          <RowHeader>
            <span>Medication {idx + 1}</span>
            <button
              type="button"
              onClick={() => removeMed(idx)}
              style={removeBtnStyle}
            >
              Remove
            </button>
          </RowHeader>

          <LabeledInput
            label="Name"
            value={m.name}
            onChange={(v) => updateArray("meds", idx, "name", v)}
          />
          <LabeledInput
            label="Dose"
            value={m.dose}
            onChange={(v) => updateArray("meds", idx, "dose", v)}
          />
          <LabeledInput
            label="Schedule"
            value={m.freq}
            onChange={(v) => updateArray("meds", idx, "freq", v)}
          />
        </Box>
      ))}
      <button type="button" onClick={addMed} style={addBtnStyle}>
        + Add Medication
      </button>

      {/* Labs editor with add/remove */}
      <SectionLabel text="Labs" />
      {visitData.labs.map((lab, idx) => (
        <Box key={idx}>
          <RowHeader>
            <span>Lab {idx + 1}</span>
            <button
              type="button"
              onClick={() => removeLab(idx)}
              style={removeBtnStyle}
            >
              Remove
            </button>
          </RowHeader>

          <LabeledInput
            label="Test"
            value={lab.test}
            onChange={(v) => updateArray("labs", idx, "test", v)}
          />
          <LabeledInput
            label="Value"
            value={lab.value}
            onChange={(v) => updateArray("labs", idx, "value", v)}
          />
          <LabeledInput
            label="Date"
            value={lab.date}
            onChange={(v) => updateArray("labs", idx, "date", v)}
          />
        </Box>
      ))}
      <button type="button" onClick={addLab} style={addBtnStyle}>
        + Add Lab
      </button>

     {/*  <SectionLabel text="Clinician Notes / Plan" />
      <LabeledTextarea
        label="Notes"
        value={visitData.notes}
        onChange={(v) => update(["notes"], v)}
      /> */}
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
        flex: "1 1 160px",
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

function LabeledTextarea({ label, value, onChange }) {
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
            "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
        }}
      />
    </label>
  );
}

function TwoCol({ children }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{children}</div>
  );
}

function Box({ children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        marginBottom: "8px",
      }}
    >
      {children}
    </div>
  );
}

function RowHeader({ children }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#000",
        marginBottom: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      {children}
    </div>
  );
}

const addBtnStyle = {
  background: "#fff",
  border: "1px solid #4b5563",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 500,
  padding: "8px 10px",
  cursor: "pointer",
  marginBottom: "12px",
};

const removeBtnStyle = {
  background: "#fff",
  border: "1px solid #b91c1c",
  color: "#b91c1c",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 500,
  padding: "4px 8px",
  cursor: "pointer",
};
