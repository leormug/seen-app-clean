import React from "react";

export default function PatientSummaryView({ patientPermanent, visitData }) {
  return (
  <>
    <style>{printCSS}</style>

    <div
      style={{
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
        color: "#000",
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        lineHeight: 1.45,
        fontSize: "14px",
        backgroundColor: "#fff",
      }}
    >
      {/* HEADER: Identity */}
      <h1
        style={{
          fontSize: "20px",
          fontWeight: 600,
          margin: "0 0 4px 0",
          lineHeight: 1.2,
        }}
      >
        {patientPermanent.name || "Name not provided"}
      </h1>

      <div
        style={{
          fontSize: "13px",
          color: "#555",
          lineHeight: 1.4,
          marginBottom: "24px",
        }}
      >
        DOB: {patientPermanent.dob || "—"}
        <br />
        Last Updated: {visitData.lastUpdated || "—"}
      </div>

      {/* MAIN CONCERN NOW (visitData.symptoms) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Main Concern Now
        </h2>
        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {visitData.symptoms && visitData.symptoms.trim()
            ? visitData.symptoms
            : "No current concern documented."}
        </p>
      </section>

      {/* TODAY'S PROBLEMS (visitData.problemsToday) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Today's Problems / Assessment
        </h2>

        <ul style={{ marginTop: 0 }}>
          {visitData.problemsToday && visitData.problemsToday.length > 0 ? (
            visitData.problemsToday.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))
          ) : (
            <li>No problems for today recorded.</li>
          )}
        </ul>
      </section>

      {/* Complaints and Story Paragraph */}
<section style={{ marginBottom: "24px" }}>
  <div
    style={{
      marginTop: "4px",
      fontSize: "14px",
      color: "#1a1a1a",
      lineHeight: 1.6,
      whiteSpace: "pre-wrap",
    }}
  >
    {visitData.symptoms
      ? visitData.symptoms
      : "Patient presents with ongoing complaints and relevant history. No additional narrative provided."}
  </div>
</section>


      {/* VITALS (visitData.vitals) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Vitals (This Visit)
        </h2>
        <ul style={{ marginTop: 0 }}>
          <li>BP: {visitData.vitals?.bp || "—"}</li>
          <li>HR: {visitData.vitals?.hr || "—"}</li>
          <li>Temp: {visitData.vitals?.temp || "—"}</li>
          <li>SpO₂: {visitData.vitals?.spo2 || "—"}</li>
          <li>Weight: {visitData.vitals?.weight || "—"}</li>
        </ul>
      </section>
<Card title="Chronic Problems / Allergies">
  {/* Chronic problems list */}
  <div style={{ marginBottom: "12px" }}>
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#111",
        marginBottom: "4px",
        lineHeight: 1.2,
      }}
    >
      Chronic Problems
    </div>
    <ul
      style={{
        margin: 0,
        paddingLeft: "20px",
        fontSize: "14px",
        lineHeight: 1.4,
      }}
    >
      {patientPermanent.chronicProblems &&
      patientPermanent.chronicProblems.length ? (
        patientPermanent.chronicProblems.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))
      ) : (
        <li>No chronic problems documented.</li>
      )}
    </ul>
  </div>

  {/* Allergies list */}
  <div>
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#111",
        marginBottom: "4px",
        lineHeight: 1.2,
      }}
    >
      Allergies
    </div>
    <ul
      style={{
        margin: 0,
        paddingLeft: "20px",
        fontSize: "14px",
        lineHeight: 1.4,
      }}
    >
      {patientPermanent.allergies && patientPermanent.allergies.length ? (
        patientPermanent.allergies.map((a, idx) => (
          <li key={idx}>
            {a.item}
            {a.reaction ? ` (${a.reaction})` : ""}
          </li>
        ))
      ) : (
        <li>No known drug allergies.</li>
      )}
    </ul>
  </div>
</Card>


      {/* MEDICATIONS (patientPermanent.meds first, then visitData.meds additions) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Current Medications
        </h2>

        <ul style={{ marginTop: 0 }}>
          {patientPermanent.meds && patientPermanent.meds.length > 0 ? (
            patientPermanent.meds.map((m, idx) => (
              <li key={`perm-${idx}`}>
                <strong>{m.name || "Unnamed med"}</strong>
                {m.dose ? ` ${m.dose}` : ""}{" "}
                {m.freq ? ` — ${m.freq}` : ""}
              </li>
            ))
          ) : (
            <li>No long-term medications listed.</li>
          )}

          {visitData.meds && visitData.meds.length > 0
            ? visitData.meds.map((m, idx) => (
                <li key={`visit-${idx}`}>
                  <strong>{m.name || "Unnamed med"}</strong>
                  {m.dose ? ` ${m.dose}` : ""}{" "}
                  {m.freq ? ` — ${m.freq}` : ""}
                </li>
              ))
            : null}
        </ul>
      </section>

      {/* ALLERGIES (patientPermanent.allergies) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Allergies
        </h2>
        <ul style={{ marginTop: 0 }}>
          {patientPermanent.allergies &&
          patientPermanent.allergies.length > 0 ? (
            patientPermanent.allergies.map((a, idx) => (
              <li key={idx}>
                <strong>{a.item || "Allergen not specified"}</strong>
                {a.reaction ? ` — ${a.reaction}` : ""}
              </li>
            ))
          ) : (
            <li>No allergies documented.</li>
          )}
        </ul>
      </section>

      {/* RECENT LABS (patientPermanent.labs and visitData.labs) */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Recent Labs
        </h2>

        <ul style={{ marginTop: 0 }}>
          {patientPermanent.labs && patientPermanent.labs.length > 0
            ? patientPermanent.labs.map((lab, idx) => (
                <li key={`plab-${idx}`}>
                  <strong>{lab.test || "Test"}</strong>: {lab.value || "—"}{" "}
                  {lab.date ? `(${lab.date})` : ""}
                </li>
              ))
            : null}

          {visitData.labs && visitData.labs.length > 0
            ? visitData.labs.map((lab, idx) => (
                <li key={`vlab-${idx}`}>
                  <strong>{lab.test || "Test"}</strong>: {lab.value || "—"}{" "}
                  {lab.date ? `(${lab.date})` : ""}
                </li>
              ))
            : null}

          {(!patientPermanent.labs ||
            patientPermanent.labs.length === 0) &&
          (!visitData.labs || visitData.labs.length === 0) ? (
            <li>No labs documented.</li>
          ) : null}
        </ul>
      </section>

      {/* SECTIONS YOU WANT BUT DON'T HAVE STRUCTURED YET */}
      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Surgeries / Hospitalizations
        </h2>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {patientPermanent.surgeries && patientPermanent.surgeries.length > 0
            ? patientPermanent.surgeries.join("\n")
            : "Not documented."}
        </div>
      </section>

      <section style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            margin: "0 0 8px 0",
            color: "#111",
          }}
        >
          Treating Physicians
        </h2>
        <div style={{ whiteSpace: "pre-wrap" }}>
          {patientPermanent.physicians && patientPermanent.physicians.length > 0
            ? patientPermanent.physicians
                .map((doc) => {
                  const name = doc.name || "Name not provided";
                  const role = doc.role ? ` (${doc.role})` : "";
                  const addr = doc.address ? `\n${doc.address}` : "";
                  const tel = doc.phone ? `\nTel: ${doc.phone}` : "";
                  return `${name}${role}${addr}${tel}`;
                })
                .join("\n\n")
            : "Not documented."}
        </div>
      </section>
    </div>
  </>
);
