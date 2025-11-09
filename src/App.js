// src/App.js
import React, { useState, useEffect } from "react";
import CardLayoutView from "./CardLayoutView";
import LoginGate from "./LoginGate";
import ErrorBoundary from "./ErrorBoundary";
import PrintSummary from "./PrintSummary";

// load saved data
function loadSavedData() {
  try {
    const raw = localStorage.getItem("patientSummary_v1");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// demo defaults (same as before)
const patientDefaults = {
  name: "Jane Doe",
  dob: "04/21/1984",
  allergies: [{ item: "Sulfa drugs", reaction: "Hives, shortness of breath" }],
  hospitalizations: [
    {
      why: "Severe dehydration and acute glucose crisis (diabetes)",
      when: "March 2012",
    },
  ],
  diagnoses: [
    {
      name: "ME/CFS",
      by: "Dr. L. Patel, Neurology",
      date: "June 2008",
      status: "Confirmed",
    },
  ],
  procedures: [
    {
      name: "Tilt table test",
      date: "January 2014",
      notes:
        "Used to diagnose dysautonomia, showed abnormal heart rate response",
    },
  ],
  treatments: [
    {
      name: "Graded exercise therapy",
      timeframe: "2015–2017",
      effectiveness: "Ineffective, triggered flare-ups",
      sideEffects: "Worsened fatigue, muscle pain",
    },
  ],
  testsImaging: [
    {
      test: "Echocardiogram",
      finding: "Normal structure and function",
      date: "January 2014",
      impact: "Helped rule out cardiac cause of dizziness",
    },
  ],
  functionalImpact:
    "I am mostly bedridden and depend on others for basic tasks like meals, bathing, and transportation...",
  doctors: [
    {
      name: "Dr. L. Patel",
      specialty: "Neurology",
      contact: "(555) 555-1200",
    },
  ],
};

const visitDefaults = {
  provider: "Dr. Taylor",
  lastUpdated: "",
  symptoms:
    "In 2006, I experienced a severe case of Epstein-Barr virus that marked the beginning...",
  problemsTodayText:
    "Extreme fatigue, muscle weakness, dizziness, cognitive fog, shortness of breath, blood sugar instability",
  problemsTodayList: [
    "Extreme fatigue",
    "Muscle weakness",
    "Dizziness",
    "Cognitive fog",
    "Shortness of breath",
    "Blood sugar instability",
  ],
  meds: [
    { name: "Metformin", dose: "500 mg", freq: "Twice daily" },
    { name: "Midodrine", dose: "10 mg", freq: "Morning only" },
    { name: "Gabapentin", dose: "300 mg", freq: "At bedtime" },
  ],
  notes: "",
};

export default function App() {
  const saved = loadSavedData();

  // declare all state before using it
  const [patientPermanent, setPatientPermanent] = useState(
    saved?.patientPermanent || {
      name: "",
      dob: "",
      mrn: "",
      allergies: [{ item: "", reaction: "" }],
      doctors: [{ name: "", specialty: "", contact: "" }],
      hospitalizations: [{ why: "", when: "" }],
      diagnoses: [{ name: "", by: "", date: "", status: "suspected" }],
      procedures: [{ name: "", date: "", notes: "" }],
      treatments: [
        { name: "", timeframe: "", effectiveness: "", sideEffects: "" },
      ],
      testsImaging: [{ test: "", finding: "", date: "" }],
      functionalImpact: "",
    }
  );

  const [visitData, setVisitData] = useState(
    saved?.visitData || {
      provider: "",
      lastUpdated: new Date().toISOString().slice(0, 10),
      symptoms: "",
      problemsTodayText: "",
      problemsTodayList: [],
      meds: [{ name: "", dose: "", freq: "" }],
      notes: "",
    }
  );

  // dynamic title
  useEffect(() => {
    const name = patientPermanent?.name?.trim();
    document.title = name ? `SEEN: ${name}` : "SEEN";
  }, [patientPermanent?.name]);

  const mergeVisitData = (patch) => {
    setVisitData((prev) => ({ ...prev, ...(patch || {}) }));
  };

  // auto-save
  useEffect(() => {
    try {
      const payload = { patientPermanent, visitData };
      localStorage.setItem("patientSummary_v1", JSON.stringify(payload));
    } catch {}
  }, [patientPermanent, visitData]);

  return (
    <div>
      <LoginGate>
        <ErrorBoundary>
          <div className="app-screen-root">
            <CardLayoutView
              patientPermanent={patientPermanent}
              setPatientPermanent={setPatientPermanent}
              visitData={visitData}
              mergeVisitData={mergeVisitData}
              patientDefaults={patientDefaults}
              visitDefaults={visitDefaults}
            />
          </div>

          <div className="app-print-root">
            <PrintSummary
              patientPermanent={patientPermanent}
              visitData={visitData}
            />
          </div>
        </ErrorBoundary>
      </LoginGate>
    </div>
  );
}
