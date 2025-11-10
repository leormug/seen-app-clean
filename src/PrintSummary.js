// src/PrintSummary.js
import React from "react";

function isNonEmptyString(str) {
  return !!(str && String(str).trim() !== "");
}

function nonEmptyRows(arr, keys) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((row) =>
    keys.some((k) => isNonEmptyString(row?.[k]))
  );
}

export default function PrintSummary({ patientPermanent, visitData }) {
  const P = patientPermanent || {};
  const V = visitData || {};
 

  const diagnoses = nonEmptyRows(P.diagnoses, ["name", "by", "date", "status"]);
  const hospitalizations = nonEmptyRows(P.hospitalizations, ["why", "when"]);
  const procedures = nonEmptyRows(P.procedures, ["name", "date", "notes"]);
  const treatments = nonEmptyRows(P.treatments, [
    "name",
    "timeframe",
    "effectiveness",
    "sideEffects",
  ]);
  const testsImaging = nonEmptyRows(P.testsImaging, [
    "test",
    "finding",
    "date",
  ]);
  const doctors = nonEmptyRows(P.doctors, ["name", "specialty", "contact"]);
  const allergies = nonEmptyRows(P.allergies, ["item", "reaction"]);
  const meds = nonEmptyRows(V.meds, ["name", "dose", "freq"]);

  const hasPatient =
    isNonEmptyString(P.name) || isNonEmptyString(P.dob);
  const hasStory = isNonEmptyString(V.symptoms);
  const hasReasons = isNonEmptyString(V.problemsTodayText);
  const hasFunctional = isNonEmptyString(P.functionalImpact);

  return (
    <div
      style={{
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
        fontSize: "11pt",
        lineHeight: 1.4,
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "16pt",
          margin: "0 0 8pt 0",
        }}
      >
        My Medical Summary
      </h1>

      {/* PATIENT */}
      {hasPatient && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Patient
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {isNonEmptyString(P.name) && <li>Name: {P.name}</li>}
            {isNonEmptyString(P.dob) && <li>DOB: {P.dob}</li>}
          </ul>
        </section>
      )}

      {/* STORY */}
      {hasStory && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Story
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {V.symptoms}
          </p>
        </section>
      )}

      {/* REASONS TODAY */}
      {hasReasons && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Reasons for Today&apos;s Visit
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {V.problemsTodayText}
          </p>
        </section>
      )}

                     {/* DIAGNOSES */}
      {diagnoses.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Diagnoses
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {diagnoses.map((d, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(d.name) && <strong>{d.name}</strong>}
                {isNonEmptyString(d.by) && (
                  <span>{isNonEmptyString(d.name) ? " by " : "By "}{d.by}</span>
                )}
                {isNonEmptyString(d.date) && (
                  <span>
                    {isNonEmptyString(d.name) || isNonEmptyString(d.by) ? " (" : ""}
                    {d.date}
                    {isNonEmptyString(d.name) || isNonEmptyString(d.by) ? ")" : ""}
                  </span>
                )}
                {isNonEmptyString(d.status) && (
                  <span> – {d.status}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}


      {/* HOSPITALIZATIONS */}
      {hospitalizations.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Hospitalizations
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {hospitalizations.map((h, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(h.why) && <strong>{h.why}</strong>}
                {isNonEmptyString(h.when) && (
                  <span>{h.why ? " – " : ""}{h.when}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MEDICATIONS */}
      {meds.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Current Medications
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {meds.map((m, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(m.name) && <strong>{m.name}</strong>}
                {isNonEmptyString(m.dose) && (
                  <span>{m.name ? ", " : ""}{m.dose}</span>
                )}
                {isNonEmptyString(m.freq) && (
                  <span>
                    {m.name || m.dose ? ", " : ""}
                    {m.freq}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ALLERGIES */}
      {allergies.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Allergies
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {allergies.map((a, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(a.item) && <strong>{a.item}</strong>}
                {isNonEmptyString(a.reaction) && (
                  <span>
                    {" "}
                    – reaction: {a.reaction}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* PROCEDURES */}
      {procedures.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Procedures & Surgeries
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {procedures.map((p, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(p.name) && <strong>{p.name}</strong>}
                {isNonEmptyString(p.date) && (
                  <span>{p.name ? " – " : ""}{p.date}</span>
                )}
                {isNonEmptyString(p.notes) && (
                  <span>
                    {" "}
                    – {p.notes}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TREATMENTS */}
      {treatments.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Treatments
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {treatments.map((t, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(t.name) && <strong>{t.name}</strong>}
                {isNonEmptyString(t.timeframe) && (
                  <span>{t.name ? " – " : ""}{t.timeframe}</span>
                )}
                {isNonEmptyString(t.effectiveness) && (
                  <span>
                    {" "}
                    – effectiveness: {t.effectiveness}
                  </span>
                )}
                {isNonEmptyString(t.sideEffects) && (
                  <span>
                    {" "}
                    – side effects: {t.sideEffects}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* TESTS & IMAGING */}
      {testsImaging.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Tests & Imaging
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {testsImaging.map((ti, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(ti.test) && <strong>{ti.test}</strong>}
                {isNonEmptyString(ti.date) && (
                  <span>{ti.test ? " – " : ""}{ti.date}</span>
                )}
                {isNonEmptyString(ti.finding) && (
                  <span>
                    {" "}
                    – {ti.finding}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FUNCTIONAL IMPACT */}
      {hasFunctional && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Functional Impact
          </h2>
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {P.functionalImpact}
          </p>
        </section>
      )}

      {/* DOCTORS */}
      {doctors.length > 0 && (
        <section className="print-section" style={{ marginBottom: "10pt" }}>
          <h2 style={{ fontSize: "13pt", margin: "0 0 4pt 0" }}>
            Doctors / Specialists
          </h2>
          <ul style={{ margin: 0, paddingLeft: "1.1em" }}>
            {doctors.map((d, idx) => (
              <li key={idx} style={{ marginBottom: "2pt" }}>
                {isNonEmptyString(d.name) && <strong>{d.name}</strong>}
                {isNonEmptyString(d.specialty) && (
                  <span>
                    {" "}
                    – {d.specialty}
                  </span>
                )}
                {isNonEmptyString(d.contact) && (
                  <span>
                    {" "}
                    – {d.contact}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
