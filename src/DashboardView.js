import React from "react";

export default function DashboardView({
  patientPermanent,
  setPatientPermanent,
  visitData,
  setVisitData,
}) {
  // update helpers (same patterns as VisitForm / PatientPermanentForm)

  function updatePermanent(field, value) {
    setPatientPermanent({ ...patientPermanent, [field]: value });
  }

  function updatePermanentArray(field, idx, subfield, value) {
    const next = structuredClone(patientPermanent);
    next[field][idx][subfield] = value;
    setPatientPermanent(next);
  }

  function updatePermanentList(field, valueAsText) {
    const list = valueAsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setPatientPermanent({ ...patientPermanent, [field]: list });
  }

  function updateVisit(path, value) {
    const next = structuredClone(visitData);
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) {
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    setVisitData(next);
  }

  function updateVisitArray(field, idx, subfield, value) {
    const next = structuredClone(visitData);
    next[field][idx][subfield] = value;
    setVisitData(next);
  }

  function updateVisitList(field, valueAsText) {
    const list = valueAsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setVisitData({ ...visitData, [field]: list });
  }

  function addMed() {
    const next = structuredClone(visitData);
    next.meds.push({ name: "", dose: "", freq: "" });
    setVisitData(next);
  }

  function removeMed(idx) {
    const next = structuredClone(visitData);
    next.meds.splice(idx, 1);
    if (next.meds.length === 0) {
      next.meds.push({ name: "", dose: "", freq: "" });
    }
    setVisitData(next);
  }

  function addLab() {
    const next = structuredClone(visitData);
    next.labs.push({ test: "", value: "", date: "" });
    setVisitData(next);
  }

  function removeLab(idx) {
    const next = structuredClone(visitData);
    next.labs.splice(idx, 1);
    if (next.labs.length === 0) {
      next.labs.push({ test: "", value: "", date: "" });
    }
    setVisitData(next);
  }

  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#f5f6f8",
        color: "#1a1a1a",
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
      }}
    >
      {/* Top row: patient demographics and vitals snapshot */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Demographics / chronic / allergies card */}
        <Card>
          <SectionHeader>Patient</SectionHeader>

          <RowGrid>
            <Field
              label="Name"
              value={patientPermanent.name}
              onChange={(v) => updatePermanent("name", v)}
            />
            <Field
              label="DOB"
              value={patientPermanent.dob}
              onChange={(v) => updatePermanent("dob", v)}
            />
            <Field
              label="MRN"
              value={patientPermanent.mrn}
              onChange={(v) => updatePermanent("mrn", v)}
            />
          </RowGrid>

          <FieldBig
            label="Chronic Problems (comma separated)"
            value={patientPermanent.chronicProblems.join(", ")}
            onChange={(v) => updatePermanentList("chronicProblems", v)}
          />

          <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
            Allergies
          </div>
          {patientPermanent.allergies.map((a, idx) => (
            <Box key={idx}>
              <SmallField
                label="Allergen"
                value={a.item}
                onChange={(v) =>
                  updatePermanentArray("allergies", idx, "item", v)
                }
              />
              <SmallField
                label="Reaction"
                value={a.reaction}
                onChange={(v) =>
                  updatePermanentArray("allergies", idx, "reaction", v)
                }
              />
            </Box>
          ))}
        </Card>

        {/* Current vitals snapshot */}
        <Card>
          <SectionHeader>Vitals / Status</SectionHeader>
          <RowGrid>
            <SmallField
              label="BP"
              value={visitData.vitals.bp}
              onChange={(v) => updateVisit(["vitals", "bp"], v)}
            />
            <SmallField
              label="HR"
              value={visitData.vitals.hr}
              onChange={(v) => updateVisit(["vitals", "hr"], v)}
            />
            <SmallField
              label="Temp"
              value={visitData.vitals.temp}
              onChange={(v) => updateVisit(["vitals", "temp"], v)}
            />
            <SmallField
              label="SpO₂"
              value={visitData.vitals.spo2}
              onChange={(v) => updateVisit(["vitals", "spo2"], v)}
            />
            <SmallField
              label="Weight"
              value={visitData.vitals.weight}
              onChange={(v) => updateVisit(["vitals", "weight"], v)}
            />
            <SmallField
              label="Last Updated"
              value={visitData.lastUpdated}
              onChange={(v) => updateVisit(["lastUpdated"], v)}
            />
          </RowGrid>
        </Card>
      </div>

      {/* Problems today / Symptoms / Notes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <Card>
          <SectionHeader>Today's Problems</SectionHeader>
          <FieldBig
            label="Problems Today (comma separated)"
            value={visitData.problemsToday.join(", ")}
            onChange={(v) => updateVisitList("problemsToday", v)}
          />

          <SectionHeader>Symptoms / Chief Concern</SectionHeader>
          <FieldArea
            label="Symptoms / Story"
            value={visitData.symptoms}
            onChange={(v) => updateVisit(["symptoms"], v)}
          />

          {/* <SectionHeader>Clinician Notes / Plan</SectionHeader>
          <FieldArea
            label="Notes"
            value={visitData.notes}
            onChange={(v) => updateVisit(["notes"], v)}
          /> */}
        </Card>

        <Card>
          <SectionHeader>Key Labs</SectionHeader>
          {visitData.labs.map((lab, idx) => (
            <Box key={idx}>
              <RowHeader>
                <span>Lab {idx + 1}</span>
                <SmallRemoveButton onClick={() => removeLab(idx)} />
              </RowHeader>

              <SmallField
                label="Test"
                value={lab.test}
                onChange={(v) => updateVisitArray("labs", idx, "test", v)}
              />
              <SmallField
                label="Value"
                value={lab.value}
                onChange={(v) => updateVisitArray("labs", idx, "value", v)}
              />
              <SmallField
                label="Date"
                value={lab.date}
                onChange={(v) => updateVisitArray("labs", idx, "date", v)}
              />
            </Box>
          ))}
          <AddRowButton label="+ Add Lab" onClick={addLab} />

          <SectionHeader>Meds (current)</SectionHeader>
          {visitData.meds.map((m, idx) => (
            <Box key={idx}>
              <RowHeader>
                <span>Medication {idx + 1}</span>
                <SmallRemoveButton onClick={() => removeMed(idx)} />
              </RowHeader>

              <SmallField
                label="Name"
                value={m.name}
                onChange={(v) => updateVisitArray("meds", idx, "name", v)}
              />
              <SmallField
                label="Dose"
                value={m.dose}
                onChange={(v) => updateVisitArray("meds", idx, "dose", v)}
              />
              <SmallField
                label="Schedule"
                value={m.freq}
                onChange={(v) => updateVisitArray("meds", idx, "freq", v)}
              />
            </Box>
          ))}
          <AddRowButton label="+ Add Medication" onClick={addMed} />
        </Card>
      </div>
    </div>
  );
}

// UI atoms

function Card({ children }) {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        padding: "16px 20px",
        minWidth: 0,
      }}
    >
      {children}
    </section>
  );
}

function SectionHeader({ children }) {
  return (
    <div
      style={{
        fontSize: "14px",
        fontWeight: 600,
        color: "#111",
        marginBottom: "8px",
        borderLeft: "3px solid #000",
        paddingLeft: "6px",
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  );
}

function RowGrid({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label style={{ flex: "1 1 160px", fontSize: "13px", color: "#111" }}>
      <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function SmallField({ label, value, onChange }) {
  return (
    <label style={{ flex: "1 1 120px", fontSize: "13px", color: "#111" }}>
      <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function FieldBig({ label, value, onChange }) {
  return (
    <label style={{ display: "block", fontSize: "13px", color: "#111" }}>
      <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, width: "100%", marginBottom: "12px" }}
      />
    </label>
  );
}

function FieldArea({ label, value, onChange }) {
  return (
    <label style={{ display: "block", fontSize: "13px", color: "#111" }}>
      <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          width: "100%",
          minHeight: "60px",
          resize: "vertical",
          marginBottom: "12px",
        }}
      />
    </label>
  );
}

function Box({ children }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px",
        marginBottom: "12px",
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

function AddRowButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #4b5563",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 500,
        padding: "8px 10px",
        cursor: "pointer",
        marginBottom: "12px",
      }}
    >
      {label}
    </button>
  );
}

function SmallRemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #b91c1c",
        color: "#b91c1c",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: 500,
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      Remove
    </button>
  );
}

const inputStyle = {
  width: "100%",
  fontSize: "14px",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
};
