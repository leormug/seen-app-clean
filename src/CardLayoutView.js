// src/CardLayoutView.js
/**
 * CardLayoutView.js
 * Screen editor + print-only narrative summary.
 */

import React, { useEffect, useRef, useState } from "react";
import AppButton from "./components/AppButton";

// Fallback demo defaults for a brand-new user
const PATIENT_DEFAULTS_FALLBACK = {
  name: "Jane Doe",
  dob: "04/21/1984",

  diagnoses: [
    {
      name: "ME/CFS",
      by: "Dr. L. Patel, Neurology",
      date: "June 2008",
      status: "confirmed",
    },
  ],

  hospitalizations: [
    {
      why: "Severe dehydration and acute glucose crisis (diabetes)",
      when: "March 2012",
    },
  ],

  allergies: [
    {
      name: "Penicillin",
      reaction: "Severe rash and swelling",
      notes: "",
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
      name: "Graded activity pacing",
      start: "2015",
      notes: "Helps avoid post-exertional crashes",
    },
  ],

  tests: [
    {
      name: "Brain MRI",
      date: "2016",
      result: "No structural abnormalities",
    },
  ],

  doctors: [
    {
      name: "Dr. L. Patel",
      specialty: "Neurology",
      location: "City General Hospital",
    },
  ],
};


/* ---------------------------
   SMALL HOOKS
----------------------------*/
const MOBILE_MAX = 640;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth <= MOBILE_MAX : false
  );
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_MAX);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

/* ---------------------------
   UTILITIES
----------------------------*/
function isNonEmptyString(str) {
  return !!(str && String(str).trim() !== "");
}

function scrollToAbsoluteBottom() {
  const el = document.scrollingElement || document.documentElement;
  const go = () =>
    window.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  go();
  requestAnimationFrame(() => setTimeout(go, 0));
}

/* ---------------------------
   BASE STYLES
----------------------------*/
const baseInputShape = {
  width: "100%",
  maxWidth: "100%",
  fontSize: "14px",
  lineHeight: 1.4,
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #bbb",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
  boxSizing: "border-box",
  backgroundColor: "#fff",
};

const baseTextareaShape = {
  width: "100%",
  maxWidth: "100%",
  minHeight: "60px",
  height: "auto",
  fontSize: "13px",
  lineHeight: 1.4,
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #aaa",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  resize: "none",
  overflow: "hidden",
};

/* ---------------------------
   SMALL PRESENTATION PARTS
----------------------------*/
function SectionMini({ children }) {
  return (
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#111",
        lineHeight: 1.2,
        marginBottom: "8px",
        marginTop: "20px",
      }}
    >
      {children}
    </div>
  );
}

function RowWrap({ children }) {
  return (
    <div
      className="row-wrap"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "12px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

function RowHeader({ children }) {
  return (
    <div
      className="row-header"
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
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
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
      className="no-print"
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

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      className="no-print"
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
      Delete
    </button>
  );
}

/* ---------------------------
   INPUTS WITH DEMO PLACEHOLDERS
----------------------------*/
function InputDemo({ label, liveVal, demoVal, onChange, styleWrap }) {
  const isMobile = useIsMobile();
  const value = typeof liveVal === "string" ? liveVal : "";
  const isEmpty = value.length === 0;

  return (
    <label
      style={{
        flex: "1 1 200px",
        minWidth: "180px",
        fontSize: "13px",
        color: "#111",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        maxWidth: "100%",
        marginBottom: "12px",
        ...(styleWrap || {}),
      }}
    >
      <div
        style={{
          fontWeight: 500,
          marginBottom: "6px",
          fontSize: "13px",
          color: "#111",
        }}
      >
        {label}
      </div>
      <input
        value={value}
        placeholder={demoVal || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...baseInputShape,
          ...(isMobile ? { fontSize: "16px", padding: "12px 14px" } : {}),
          ...(isEmpty
            ? { color: "#6b7280", fontStyle: "italic" }
            : { color: "#000", fontStyle: "normal" }),
        }}
      />
    </label>
  );
}

function TextAreaDemo({
  label,
  liveVal,
  demoVal,
  onChange,
  onBlur,
  textRef,
  autoResize,
}) {
  const isMobile = useIsMobile();
  const value = typeof liveVal === "string" ? liveVal : "";
  const isEmpty = value.length === 0;

  const _ta = useRef(null);
  const internalRef = (el) => {
    if (typeof textRef === "function") textRef(el);
    else if (textRef && typeof textRef === "object") textRef.current = el;
    _ta.current = el;
  };

  useEffect(() => {
    if (_ta.current && autoResize) autoResize({ target: _ta.current });
  }, [value, autoResize]);

  return (
    <label
      style={{
        display: "block",
        fontSize: "13px",
        color: "#111",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        marginBottom: "16px",
      }}
    >
      {label && (
        <div
          style={{
            fontWeight: 500,
            marginBottom: "6px",
            fontSize: "13px",
            color: "#111",
          }}
        >
          {label}
        </div>
      )}
      <textarea
        ref={internalRef}
        value={value}
        placeholder={demoVal || ""}
        style={{
          ...baseTextareaShape,
          ...(isMobile
            ? { fontSize: "16px", padding: "12px 14px", minHeight: "80px" }
            : {}),
          ...(isEmpty
            ? { color: "#6b7280", fontStyle: "italic" }
            : { color: "#000", fontStyle: "normal" }),
        }}
        onFocus={(e) => {
          if (autoResize) autoResize({ target: e.target });
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value);
          if (autoResize) autoResize({ target: e.target });
        }}
        onChange={(e) => {
          onChange(e.target.value);
          if (autoResize) autoResize({ target: e.target });
        }}
        onInput={(e) => {
          if (autoResize) autoResize({ target: e.target });
        }}
      />
    </label>
  );
}

/* ---------------------------
   DEMO DEFAULTS (YOUR STORY)
----------------------------*/
const DEFAULT_PATIENT_DEFAULTS = {
  name: "Jane Doe",
  dob: "04/21/1984",
  diagnoses: [
    {
      name: "ME/CFS",
      by: "Dr. L. Patel, Neurology",
      date: "June 2008",
      status: "confirmed",
    },
  ],
  hospitalizations: [
    {
      why: "Severe dehydration and acute glucose crisis (diabetes)",
      when: "March 2012",
    },
  ],
  procedures: [
    {
      name: "Tilt table test",
      date: "January 2014",
      notes:
        "Used to diagnose dysautonomia, showed abnormal heart rate response.",
    },
  ],
  treatments: [
    {
      name: "Graded exercise therapy",
      timeframe: "2015–2017",
      effectiveness: "Ineffective, triggered flare-ups.",
      sideEffects: "Worsened fatigue and muscle pain.",
    },
  ],
  testsImaging: [
    {
      test: "Echocardiogram",
      finding:
        "Normal structure and function. Helped rule out cardiac cause of dizziness.",
      date: "January 2014",
    },
  ],
  doctors: [
    {
      name: "Dr. L. Patel",
      specialty: "Neurology",
      contact: "(555) 555-1200",
    },
  ],
  allergies: [
    {
      item: "Sulfa drugs",
      reaction: "Hives, shortness of breath",
    },
  ],
};

const DEFAULT_VISIT_DEFAULTS = {
  symptoms: `In 2006, I experienced a severe case of Epstein-Barr virus that marked the beginning of a long decline in my health. Over the following years, I developed persistent fatigue, muscle weakness, and cognitive fog. I was later diagnosed with Myalgic Encephalomyelitis/Chronic Fatigue Syndrome (ME/CFS), along with dysautonomia and Type 2 diabetes. These conditions have progressively limited my mobility — I am now mostly bedridden and can walk only a few steps before becoming weak, dizzy, and short of breath. My daily functioning is severely restricted, and even small physical or mental efforts can trigger symptom flare-ups lasting days or weeks.`,
  problemsTodayText:
    "Extreme fatigue, muscle weakness, dizziness, cognitive fog, shortness of breath, blood sugar instability.",
  meds: [
    {
      name: "Metformin",
      dose: "500 mg",
      freq: "Twice daily",
    },
  ],
};

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function CardLayoutView({
  patientPermanent,
  setPatientPermanent,
  visitData,
  mergeVisitData,
  patientDefaults,
  visitDefaults,
  onLogout,
  onPatientNameChange,
}) {

  // local fallbacks
  const [localPatient, setLocalPatient] = useState(() => {
  if (patientPermanent) return patientPermanent;
  try {
    const raw = localStorage.getItem("patientPermanent");
    if (raw) return JSON.parse(raw);
  } catch {}
  // when nothing is saved, start truly empty
  return {};
});


  useEffect(() => {
    if (typeof onPatientNameChange === "function") {
      const name = (localPatient?.name || "").trim();
      onPatientNameChange(name);
    }
  }, [localPatient?.name, onPatientNameChange]);


  const [localVisit, setLocalVisit] = useState(() => {
    if (visitData) return visitData;
    try {
      const raw = localStorage.getItem("patientVisit");
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  });

  const hasParent = typeof mergeVisitData === "function";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (patientPermanent) setLocalPatient(patientPermanent);
  }, [patientPermanent]);

  useEffect(() => {
    if (hasParent) setLocalVisit(visitData || {});
  }, [visitData, hasParent]);

  const mergeVisit = (patch) => {
    const base = hasParent ? visitData || {} : localVisit || {};
    const next = { ...base, ...(patch || {}) };
    setLocalVisit(next);
    try {
      const existing = JSON.parse(localStorage.getItem("patientVisit") || "{}");
      localStorage.setItem(
        "patientVisit",
        JSON.stringify({ ...existing, ...patch })
      );
    } catch {}
    if (typeof mergeVisitData === "function") {
      try {
        mergeVisitData(patch);
      } catch {}
    }
  };

  // ensure visit arrays
  useEffect(() => {
    const base = hasParent ? visitData || {} : localVisit || {};
    const patch = {};
    if (!Array.isArray(base.meds) || base.meds.length === 0) {
      patch.meds = [{ name: "", dose: "", freq: "" }];
    }
    if (!Array.isArray(base.problemsTodayList)) {
      patch.problemsTodayList = [];
    }
    if (Object.keys(patch).length > 0) {
      mergeVisit(patch);
    }
  }, []); // run once

    const P_live = { ...(patientPermanent || localPatient || {}) };
const V_live = hasParent ? { ...(visitData || {}) } : { ...(localVisit || {}) };
const P_default = patientDefaults || DEFAULT_PATIENT_DEFAULTS;
const V_default = visitDefaults || DEFAULT_VISIT_DEFAULTS;


  // "first time" detection: no stored patient AND no stored visit
  const hasAnyPatientData =
    (patientPermanent && Object.keys(patientPermanent).length > 0) ||
    (localPatient && Object.keys(localPatient).length > 0);
  const hasAnyVisitData =
    (visitData && Object.keys(visitData).length > 0) ||
    (localVisit && Object.keys(localVisit).length > 0);
  const isInitialBlank = !hasAnyPatientData && !hasAnyVisitData;

  // ==== PRINT-SPECIFIC DERIVED FIELDS ====

  // simple fields
  const nameForPrint =
    isNonEmptyString(P_live.name) || !isInitialBlank
      ? (P_live.name || "").trim()
      : (P_default.name || "").trim();

  const dobForPrint =
    isNonEmptyString(P_live.dob) || !isInitialBlank
      ? (P_live.dob || "").trim()
      : (P_default.dob || "").trim();

  const storyForPrint =
    isNonEmptyString(V_live.symptoms) || !isInitialBlank
      ? (V_live.symptoms || "").trim()
      : (V_default.symptoms || "").trim();

  const problemsForPrint =
    isNonEmptyString(V_live.problemsTodayText) || !isInitialBlank
      ? (V_live.problemsTodayText || "").trim()
      : (V_default.problemsTodayText || "").trim();

  // array helpers with filtering
  function filterRows(arr, keys) {
    if (!Array.isArray(arr)) return [];
    return arr.filter((row) =>
      keys.some((k) => isNonEmptyString(row && row[k]))
    );
  }

  // diagnoses
  const diagnosesFiltered = filterRows(P_live.diagnoses, [
    "name",
    "by",
    "date",
    "status",
  ]);
  const diagnosesForPrint =
    diagnosesFiltered.length > 0
      ? diagnosesFiltered
      : isInitialBlank && Array.isArray(P_default.diagnoses)
      ? P_default.diagnoses
      : [];

  // hospitalizations
  const hospFiltered = filterRows(P_live.hospitalizations, ["why", "when"]);
  const hospForPrint =
    hospFiltered.length > 0
      ? hospFiltered
      : isInitialBlank && Array.isArray(P_default.hospitalizations)
      ? P_default.hospitalizations
      : [];

  // procedures
  const proceduresFiltered = filterRows(P_live.procedures, [
    "name",
    "date",
    "notes",
  ]);
  const proceduresForPrint =
    proceduresFiltered.length > 0
      ? proceduresFiltered
      : isInitialBlank && Array.isArray(P_default.procedures)
      ? P_default.procedures
      : [];

  // treatments
  const treatmentsFiltered = filterRows(P_live.treatments, [
    "name",
    "timeframe",
    "effectiveness",
    "sideEffects",
  ]);
  const treatmentsForPrint =
    treatmentsFiltered.length > 0
      ? treatmentsFiltered
      : isInitialBlank && Array.isArray(P_default.treatments)
      ? P_default.treatments
      : [];

  // tests & imaging
  const testsFiltered = filterRows(P_live.testsImaging, [
    "test",
    "finding",
    "date",
  ]);
  const testsForPrint =
    testsFiltered.length > 0
      ? testsFiltered
      : isInitialBlank && Array.isArray(P_default.testsImaging)
      ? P_default.testsImaging
      : [];

  // meds
  const medsFiltered = filterRows(V_live.meds, ["name", "dose", "freq"]);
  const medsForPrint =
    medsFiltered.length > 0
      ? medsFiltered
      : isInitialBlank && Array.isArray(V_default.meds)
      ? V_default.meds
      : [];

  // allergies
  const allergiesFiltered = filterRows(P_live.allergies, ["item", "reaction"]);
  const allergiesForPrint =
    allergiesFiltered.length > 0
      ? allergiesFiltered
      : isInitialBlank && Array.isArray(P_default.allergies)
      ? P_default.allergies
      : [];

  // doctors
  const doctorsFiltered = filterRows(P_live.doctors, [
    "name",
    "specialty",
    "contact",
  ]);
  const doctorsForPrint =
    doctorsFiltered.length > 0
      ? doctorsFiltered
      : isInitialBlank && Array.isArray(P_default.doctors)
      ? P_default.doctors
      : [];

  const textareasRef = useRef([]);
  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
  useEffect(() => {
    textareasRef.current.forEach((ta) => {
      if (ta) {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      }
    });
  }, []);

  // patient helpers
  function setP(next) {
    const final = next || {};
    if (typeof setPatientPermanent === "function") {
      setPatientPermanent(final);
    } else {
      setLocalPatient(final);
    }
    try {
      localStorage.setItem("patientPermanent", JSON.stringify(final));
    } catch {}
  }

  function updateP(field, value) {
    const base = patientPermanent || localPatient || {};
    setP({ ...base, [field]: value });
  }

  function ensureArrayField(field) {
  const base = patientPermanent || localPatient || {};
  const arr = base[field];

  if (Array.isArray(arr) && arr.length > 0) return arr;

  switch (field) {
    case "diagnoses":
      return [{ name: "", by: "", date: "", status: "" }];
    case "hospitalizations":
      return [{ why: "", when: "" }];
    case "allergies":
      return [{ item: "", reaction: "" }];
    case "procedures":
      return [{ name: "", date: "", notes: "" }];
    case "treatments":
      return [
        {
          name: "",
          timeframe: "",
          effectiveness: "",
          sideEffects: "",
        },
      ];
    case "testsImaging":
      return [{ test: "", finding: "", date: "" }];
    case "doctors":
      return [{ name: "", specialty: "", contact: "" }];
    default:
      return [{}];
  }
}


function updatePArray(field, idx, key, value) {
  const arr = ensureArrayField(field).slice();
  if (!arr[idx]) arr[idx] = {};
  arr[idx] = { ...arr[idx], [key]: value };
  const base = localPatient || {};
  setLocalPatient({ ...base, [field]: arr });
}

function addPRow(field, template) {
  const arr = ensureArrayField(field).slice();
  arr.push(template);
  const base = localPatient || {};
  setLocalPatient({ ...base, [field]: arr });
}

function removePRow(field, idx, fallbackTemplate) {
  const arr = ensureArrayField(field).slice();
  arr.splice(idx, 1);
  if (arr.length === 0) arr.push(fallbackTemplate);
  const base = localPatient || {};
  setLocalPatient({ ...base, [field]: arr });
}


function updatePArray(field, idx, key, value) {
    const arr = ensureArrayField(field).slice();
    if (!arr[idx]) arr[idx] = {};
    arr[idx] = { ...arr[idx], [key]: value };
    const base = patientPermanent || localPatient || {};
    setP({ ...base, [field]: arr });
  }
  // visit helpers
  function updateVisitArray(field, idx, key, value) {
    const base = hasParent ? visitData || {} : localVisit || {};
    const currentArr = Array.isArray(base[field]) ? [...base[field]] : [];
    if (!currentArr[idx]) currentArr[idx] = {};
    currentArr[idx] = { ...currentArr[idx], [key]: value };
    mergeVisit({ [field]: currentArr });
  }

  function addVisitRow(field, template) {
    const base = hasParent ? visitData || {} : localVisit || {};
    const arr = Array.isArray(base[field]) ? [...base[field]] : [];
    arr.push(template);
    mergeVisit({ [field]: arr });
  }

  function removeVisitRow(field, idx, fallbackTemplate) {
    const base = hasParent ? visitData || {} : localVisit || {};
    const arr = Array.isArray(base[field]) ? [...base[field]] : [];
    arr.splice(idx, 1);
    if (arr.length === 0) arr.push(fallbackTemplate);
    mergeVisit({ [field]: arr });
  }

  const cardOuterStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    padding: "16px 20px",
    marginBottom: "16px",
    pageBreakInside: "avoid",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
  };

  const headerRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "12px",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100%",
  };

  const cardHeaderTitleStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#111",
    lineHeight: 1.2,
    boxSizing: "border-box",
    maxWidth: "100%",
  };

  const itemBoxStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    marginBottom: "12px",
    padding: "12px",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  const SECTIONS = [
    { id: "patient", label: "Patient" },
    { id: "story", label: "Story" },
    { id: "reasons", label: "Reasons for Visit" },
    { id: "diagnoses", label: "Diagnoses" },
    { id: "hosp", label: "Hospitalizations" },
    { id: "meds", label: "Meds & Allergies" },
    { id: "procedures", label: "Procedures" },
    { id: "treatments", label: "Treatments" },
    { id: "tests", label: "Tests & Imaging" },
    { id: "docs", label: "Doctors" },
  ];

    const sectionRefs = useRef(
    Object.fromEntries(SECTIONS.map((s) => [s.id, React.createRef()]))
  );
  const [currentSection, setCurrentSection] = useState(SECTIONS[0].id);
  const [tocOpen, setTocOpen] = useState(false);

  // always show the scroll arrow; no bottom sentinel / observers
  const showArrow = true;


  const scrollToSection = (id) => {
    const el = sectionRefs.current[id]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // observe sections for currentSection
  useEffect(() => {
    const opts = {
      root: null,
      rootMargin: "-30% 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };
    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.getAttribute("data-section-id");
      if (id && id !== currentSection) setCurrentSection(id);
    }, opts);
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id]?.current;
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [currentSection, SECTIONS]);



  function handleClearForm() {
    const ok = window.confirm(
      "This will permanently clear all information in this visit. Continue?"
    );
    if (!ok) return;

    const clearedPatient = {
      name: "",
      dob: "",
      diagnoses: [{ name: "", by: "", date: "", status: "" }],
      hospitalizations: [{ why: "", when: "" }],
      procedures: [{ name: "", date: "", notes: "" }],
      treatments: [
        {
          name: "",
          timeframe: "",
          effectiveness: "",
          sideEffects: "",
        },
      ],
      testsImaging: [{ test: "", finding: "", date: "" }],
      doctors: [{ name: "", specialty: "", contact: "" }],
      allergies: [{ item: "", reaction: "" }],
    };

    setP(clearedPatient);

    const clearedVisit = {
      symptoms: "",
      problemsTodayText: "",
      problemsTodayList: [],
      meds: [{ name: "", dose: "", freq: "" }],
    };

    setLocalVisit(clearedVisit);

    try {
      localStorage.setItem("patientPermanent", JSON.stringify(clearedPatient));
      localStorage.setItem("patientVisit", JSON.stringify(clearedVisit));
    } catch {}

    if (typeof mergeVisitData === "function") {
      try {
        mergeVisitData(clearedVisit);
      } catch {}
    }
  }

   return (
    <div
      className="page-wrap"
      style={{
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
        backgroundColor: "#f5f6f8",
        minHeight: "100vh",
        minHeight: "100dvh",
        padding: "16px",
        paddingBottom: "80px",
        color: "#1a1a1a",
        maxWidth: "700px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden",
      }}
    >

      {/* ============== SCREEN EDITOR VIEW ============== */}
      <div className="screen-only">
        {/* Title */}
        <header
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            padding: "16px 20px",
            fontSize: "22px",
            fontWeight: 600,
            lineHeight: 1.3,
            color: "#111",
            marginBottom: "16px",
          }}
        >
          My Medical Summary
        </header>

        {/* Patient */}
        <div ref={sectionRefs.current.patient} data-section-id="patient">
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Patient</h2>
            </header>
            <RowWrap>
              <InputDemo
                label="Name"
                liveVal={P_live.name}
                demoVal={P_default.name}
                onChange={(val) => updateP("name", val)}
              />
              <InputDemo
                label="DOB"
                liveVal={P_live.dob}
                demoVal={P_default.dob}
                onChange={(val) => updateP("dob", val)}
              />
            </RowWrap>
          </section>
        </div>

        {/* Story */}
        <div ref={sectionRefs.current.story} data-section-id="story">
          <section style={cardOuterStyle}>
            <TextAreaDemo
              label="Story"
              liveVal={V_live.symptoms}
              demoVal={V_default.symptoms}
              onChange={(val) => mergeVisit({ symptoms: val })}
              textRef={(el) => (textareasRef.current[0] = el)}
              autoResize={autoResize}
            />
          </section>
        </div>

        {/* Reasons */}
        <div ref={sectionRefs.current.reasons} data-section-id="reasons">
          <section style={cardOuterStyle}>
            <TextAreaDemo
              label="Reasons for today's visit"
              liveVal={V_live.problemsTodayText}
              demoVal={V_default.problemsTodayText}
              onChange={(val) =>
                mergeVisit({ problemsTodayText: val, problemsTodayList: [] })
              }
              textRef={(el) => (textareasRef.current[1] = el)}
              autoResize={autoResize}
            />
          </section>
        </div>

       {/* Diagnoses */}
<div ref={sectionRefs.current.diagnoses} data-section-id="diagnoses">
  <section style={cardOuterStyle}>
    <header style={headerRowStyle}>
      <h2 style={cardHeaderTitleStyle}>Diagnoses</h2>
    </header>

    {ensureArrayField("diagnoses").map((d, idx) => {
      const dDefaults = (P_default.diagnoses || [])[idx] || {};
      const statusVal = isNonEmptyString(d?.status) ? d.status : "";

      return (
        <div key={idx} style={itemBoxStyle}>
          <RowHeader>
            <span>Diagnosis {idx + 1}</span>
            <DeleteButton
              onClick={() =>
                removePRow("diagnoses", idx, {
                  name: "",
                  by: "",
                  date: "",
                  status: "",
                })
              }
            />
          </RowHeader>

          <InputDemo
            label="Name"
            liveVal={d?.name || ""}
            demoVal={dDefaults.name || "e.g., ME/CFS"}
            onChange={(val) => updatePArray("diagnoses", idx, "name", val)}
          />
          <InputDemo
            label="By (Clinician)"
            liveVal={d?.by || ""}
            demoVal={dDefaults.by || "e.g., Dr. L. Patel, Neurology"}
            onChange={(val) => updatePArray("diagnoses", idx, "by", val)}
          />
          <InputDemo
            label="Date"
            liveVal={d?.date || ""}
            demoVal={dDefaults.date || "e.g., June 2008"}
            onChange={(val) => updatePArray("diagnoses", idx, "date", val)}
          />

          <label
            style={{
              flex: "1 1 200px",
              minWidth: "180px",
              fontSize: "13px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              maxWidth: "100%",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontWeight: 500,
                marginBottom: "6px",
                fontSize: "13px",
                color: "#111",
              }}
            >
              Status
            </div>
            <select
              value={statusVal}
              onChange={(e) =>
                updatePArray("diagnoses", idx, "status", e.target.value)
              }
              style={{
                ...baseInputShape,
                color: statusVal ? "#000" : "#6b7280",
                fontStyle: statusVal ? "normal" : "italic",
              }}
            >
              <option value="">– Select –</option>
              <option value="confirmed">Confirmed</option>
              <option value="suspected">Suspected</option>
            </select>
          </label>
        </div>
      );
    })}

    <AddRowButton
      label="+ Add Diagnosis"
      onClick={() =>
        addPRow("diagnoses", {
          name: "",
          by: "",
          date: "",
          status: "",
        })
      }
    />
  </section>
</div>


        {/* Hospitalizations */}
        <div ref={sectionRefs.current.hosp} data-section-id="hosp">
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Hospitalizations</h2>
            </header>
            {ensureArrayField("hospitalizations").map((h, idx) => {

              const hDefaults = (P_default.hospitalizations || [])[idx] || {};
              return (
                <div key={idx} style={itemBoxStyle}>
                  <RowHeader>
                    <span>Hospitalization {idx + 1}</span>
                    <DeleteButton
                      onClick={() =>
                        removePRow("hospitalizations", idx, {
                          why: "",
                          when: "",
                        })
                      }
                    />
                  </RowHeader>
                  <InputDemo
                    label="Why"
                    liveVal={h?.why || ""}
                    demoVal={hDefaults.why}
                    onChange={(val) =>
                      updatePArray("hospitalizations", idx, "why", val)
                    }
                  />
                  <InputDemo
                    label="When"
                    liveVal={h?.when || ""}
                    demoVal={hDefaults.when}
                    onChange={(val) =>
                      updatePArray("hospitalizations", idx, "when", val)
                    }
                  />
                </div>
              );
            })}
            <AddRowButton
              label="+ Add Hospitalization"
              onClick={() =>
                addPRow("hospitalizations", { why: "", when: "" })
              }
            />
          </section>
        </div>

        {/* Meds & Allergies */}
        <div ref={sectionRefs.current.meds} data-section-id="meds">
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>
                Current Medications & Allergies
              </h2>
            </header>

            {(Array.isArray(V_live.meds)
              ? V_live.meds
              : [{ name: "", dose: "", freq: "" }]
            ).map((m, idx) => {
              const mDefaults = (V_default.meds || [])[idx] || {};
              return (
                <div key={idx} style={itemBoxStyle}>
                  <RowHeader>
                    <span>Medication {idx + 1}</span>
                    <DeleteButton
                      onClick={() =>
                        removeVisitRow("meds", idx, {
                          name: "",
                          dose: "",
                          freq: "",
                        })
                      }
                    />
                  </RowHeader>
                  <InputDemo
                    label="Name"
                    liveVal={m?.name || ""}
                    demoVal={mDefaults.name}
                    onChange={(val) =>
                      updateVisitArray("meds", idx, "name", val)
                    }
                  />
                  <InputDemo
                    label="Dose"
                    liveVal={m?.dose || ""}
                    demoVal={mDefaults.dose}
                    onChange={(val) =>
                      updateVisitArray("meds", idx, "dose", val)
                    }
                  />
                  <InputDemo
                    label="Schedule"
                    liveVal={m?.freq || ""}
                    demoVal={mDefaults.freq}
                    onChange={(val) =>
                      updateVisitArray("meds", idx, "freq", val)
                    }
                  />
                </div>
              );
            })}
            <AddRowButton
              label="+ Add Medication"
              onClick={() =>
                addVisitRow("meds", { name: "", dose: "", freq: "" })
              }
            />

            <SectionMini>Allergies</SectionMini>
            {ensureArrayField("allergies").map((a, idx) => {

                const aDefaults = (P_default.allergies || [])[idx] || {};
                return (
                  <div key={idx} style={itemBoxStyle}>
                    <RowHeader>
                      <span>Allergy {idx + 1}</span>
                      <DeleteButton
                        onClick={() =>
                          removePRow("allergies", idx, {
                            item: "",
                            reaction: "",
                          })
                        }
                      />
                    </RowHeader>
                    <InputDemo
                      label="To (What)"
                      liveVal={a?.item || ""}
                      demoVal={aDefaults.item}
                      onChange={(val) =>
                        updatePArray("allergies", idx, "item", val)
                      }
                    />
                    <InputDemo
                      label="What Happens (Reaction)"
                      liveVal={a?.reaction || ""}
                      demoVal={aDefaults.reaction}
                      onChange={(val) =>
                        updatePArray("allergies", idx, "reaction", val)
                      }
                    />
                  </div>
                );
              }
            )}
            <AddRowButton
              label="+ Add Allergy"
              onClick={() =>
                addPRow("allergies", { item: "", reaction: "" })
              }
            />
          </section>
        </div>

        {/* Procedures */}
        <div
          ref={sectionRefs.current.procedures}
          data-section-id="procedures"
        >
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Procedures & Surgeries</h2>
            </header>
            {ensureArrayField("procedures").map((p, idx) => {

                const pDefaults = (P_default.procedures || [])[idx] || {};
                return (
                  <div key={idx} style={itemBoxStyle}>
                    <RowHeader>
                      <span>Procedure {idx + 1}</span>
                      <DeleteButton
                        onClick={() =>
                          removePRow("procedures", idx, {
                            name: "",
                            date: "",
                            notes: "",
                          })
                        }
                      />
                    </RowHeader>
                    <InputDemo
                      label="Name"
                      liveVal={p?.name || ""}
                      demoVal={pDefaults.name}
                      onChange={(val) =>
                        updatePArray("procedures", idx, "name", val)
                      }
                    />
                    <InputDemo
                      label="Approx Date"
                      liveVal={p?.date || ""}
                      demoVal={pDefaults.date}
                      onChange={(val) =>
                        updatePArray("procedures", idx, "date", val)
                      }
                    />
                    <TextAreaDemo
                      label="Notes"
                      liveVal={p?.notes || ""}
                      demoVal={pDefaults.notes}
                      onChange={(val) =>
                        updatePArray("procedures", idx, "notes", val)
                      }
                      textRef={(el) => {
                        textareasRef.current[10000 + idx] = el;
                      }}
                      autoResize={autoResize}
                    />
                  </div>
                );
              }
            )}
            <AddRowButton
              label="+ Add Procedure"
              onClick={() =>
                addPRow("procedures", { name: "", date: "", notes: "" })
              }
            />
          </section>
        </div>

        {/* Treatments */}
        <div
          ref={sectionRefs.current.treatments}
          data-section-id="treatments"
        >
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Treatments</h2>
            </header>
            {ensureArrayField("treatments").map((t, idx) => {

                const tDefaults = (P_default.treatments || [])[idx] || {};
                return (
                  <div key={idx} style={itemBoxStyle}>
                    <RowHeader>
                      <span>Treatment {idx + 1}</span>
                      <DeleteButton
                        onClick={() =>
                          removePRow("treatments", idx, {
                            name: "",
                            timeframe: "",
                            effectiveness: "",
                            sideEffects: "",
                          })
                        }
                      />
                    </RowHeader>
                    <InputDemo
                      label="Name"
                      liveVal={t?.name || ""}
                      demoVal={tDefaults.name}
                      onChange={(val) =>
                        updatePArray("treatments", idx, "name", val)
                      }
                    />
                    <InputDemo
                      label="Timeframe"
                      liveVal={t?.timeframe || ""}
                      demoVal={tDefaults.timeframe}
                      onChange={(val) =>
                        updatePArray("treatments", idx, "timeframe", val)
                      }
                    />
                    <TextAreaDemo
                      label="Effectiveness"
                      liveVal={t?.effectiveness || ""}
                      demoVal={tDefaults.effectiveness}
                      onChange={(val) =>
                        updatePArray("treatments", idx, "effectiveness", val)
                      }
                      textRef={(el) => {
                        textareasRef.current[20000 + idx] = el;
                      }}
                      autoResize={autoResize}
                    />
                    <TextAreaDemo
                      label="Side Effects"
                      liveVal={t?.sideEffects || ""}
                      demoVal={tDefaults.sideEffects}
                      onChange={(val) =>
                        updatePArray("treatments", idx, "sideEffects", val)
                      }
                      textRef={(el) => {
                        textareasRef.current[30000 + idx] = el;
                      }}
                      autoResize={autoResize}
                    />
                  </div>
                );
              }
            )}
            <AddRowButton
              label="+ Add Treatment"
              onClick={() =>
                addPRow("treatments", {
                  name: "",
                  timeframe: "",
                  effectiveness: "",
                  sideEffects: "",
                })
              }
            />
          </section>
        </div>

        {/* Tests & Imaging */}
        <div ref={sectionRefs.current.tests} data-section-id="tests">
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Tests & Imaging</h2>
            </header>
            {ensureArrayField("testsImaging").map((ti, idx) => {

              const tiDefaults = (P_default.testsImaging || [])[idx] || {};
              return (
                <div key={idx} style={itemBoxStyle}>
                  <RowHeader>
                    <span>Test {idx + 1}</span>
                    <DeleteButton
                      onClick={() =>
                        removePRow("testsImaging", idx, {
                          test: "",
                          finding: "",
                          date: "",
                        })
                      }
                    />
                  </RowHeader>
                  <InputDemo
                    label="Test"
                    liveVal={ti?.test || ""}
                    demoVal={tiDefaults.test}
                    onChange={(val) =>
                      updatePArray("testsImaging", idx, "test", val)
                    }
                  />
                  <TextAreaDemo
                    label="Finding"
                    liveVal={ti?.finding || ""}
                    demoVal={tiDefaults.finding}
                    onChange={(val) =>
                      updatePArray("testsImaging", idx, "finding", val)
                    }
                    textRef={(el) => {
                      textareasRef.current[40000 + idx] = el;
                    }}
                    autoResize={autoResize}
                  />
                  <InputDemo
                    label="Date"
                    liveVal={ti?.date || ""}
                    demoVal={tiDefaults.date}
                    onChange={(val) =>
                      updatePArray("testsImaging", idx, "date", val)
                    }
                  />
                </div>
              );
            })}
            <AddRowButton
              label="+ Add Test"
              onClick={() =>
                addPRow("testsImaging", { test: "", finding: "", date: "" })
              }
            />
          </section>
        </div>

        {/* Doctors */}
        <div ref={sectionRefs.current.docs} data-section-id="docs">
          <section style={cardOuterStyle}>
            <header style={headerRowStyle}>
              <h2 style={cardHeaderTitleStyle}>Doctors / Specialists</h2>
            </header>
           {ensureArrayField("doctors").map((d, idx) => {

                const dDefaults = (P_default.doctors || [])[idx] || {};
                return (
                  <div key={idx} style={itemBoxStyle}>
                    <RowHeader>
                      <span>Doctor {idx + 1}</span>
                      <DeleteButton
                        onClick={() =>
                          removePRow("doctors", idx, {
                            name: "",
                            specialty: "",
                            contact: "",
                          })
                        }
                      />
                    </RowHeader>
                    <InputDemo
                      label="Name"
                      liveVal={d?.name || ""}
                      demoVal={dDefaults.name}
                      onChange={(val) =>
                        updatePArray("doctors", idx, "name", val)
                      }
                    />
                    <InputDemo
                      label="Specialty"
                      liveVal={d?.specialty || ""}
                      demoVal={dDefaults.specialty}
                      onChange={(val) =>
                        updatePArray("doctors", idx, "specialty", val)
                      }
                    />
                    <InputDemo
                      label="Contact"
                      liveVal={d?.contact || ""}
                      demoVal={dDefaults.contact}
                      onChange={(val) =>
                        updatePArray("doctors", idx, "contact", val)
                      }
                    />
                  </div>
                );
              }
            )}
            <AddRowButton
              label="+ Add Doctor"
              onClick={() =>
                addPRow("doctors", {
                  name: "",
                  specialty: "",
                  contact: "",
                })
              }
            />
          </section>
        </div>

        {/* Action buttons */}
<section
  style={{
    ...cardOuterStyle,
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "0",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "16px",
      marginTop: "16px",
      flexWrap: "wrap",
      width: "100%",
    }}
  >
    <AppButton
      type="button"
      className="no-print"
      variant="primary"
      size="md"
      onClick={() => {
        window.print();
      }}
    >
      Print / Save PDF
    </AppButton>

    <AppButton
      type="button"
      className="no-print"
      variant="danger"
      size="md"
      onClick={handleClearForm}
    >
      Clear form
    </AppButton>

    <AppButton
  type="button"
  variant="secondary"
  onClick={() => {
    if (onLogout) onLogout();
  }}
  style={{ marginLeft: 8 }}
>
  Log out
</AppButton>

  </div>
</section>


        {/* Floating Section Nav */}
        <div
          className="no-print"
          aria-label="Section navigator"
          style={{
            position: "fixed",
            top: 96,
            right: 16,
            zIndex: 2000,
          }}
        >
          <button
            type="button"
            aria-expanded={tocOpen}
            onClick={() => setTocOpen((v) => !v)}
            title={tocOpen ? "Hide sections" : "Show sections"}
            style={{
              width: 44,
              height: 44,
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "rgba(255,255,255,0.86)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              aria-hidden
              style={{
                width: 18,
                height: 2,
                background: "#111",
                boxShadow: "0 6px 0 #111, 0 -6px 0 #111",
                transform: tocOpen ? "rotate(90deg)" : "none",
                transition: "transform 160ms ease",
              }}
            />
          </button>

          {tocOpen && (
            <div
              role="menu"
              style={{
                marginTop: 10,
                width: 220,
                maxHeight: "60vh",
                overflow: "hidden", // no scroll bar
                background: "rgba(255,255,255,0.86)",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
                padding: 10,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  color: "#374151",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                Sections
              </div>
              {SECTIONS.map((s) => {
                const active = s.id === currentSection;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setTocOpen(false);
                      scrollToSection(s.id);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      background: active
                        ? "rgba(17,24,39,0.9)"
                        : "transparent",
                      color: active ? "#fff" : "#111",
                      cursor: "pointer",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Down Arrow */}
        {showArrow && (
          <button
            type="button"
            className="no-print"
            onClick={scrollToAbsoluteBottom}
            aria-label="Scroll to bottom"
            title="Scroll to bottom"
            style={{
              position: "fixed",
              right: 16,
              bottom: 16,
              width: 48,
              height: 48,
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#fff",
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              zIndex: 2200,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>↓</span>
          </button>
        )}
      </div>

      {/* ============== PRINT-ONLY NARRATIVE SUMMARY ============== */}
      <div className="print-only">
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "0.5in 0",
            fontFamily:
              "-apple-system,BlinkMacSystemFont,'SF Pro Text',Roboto,sans-serif",
            fontSize: "9pt", // slightly smaller
            lineHeight: 1.4,
            color: "#111827",
          }}
        >
          <h1
            style={{
              fontSize: "18pt",
              margin: "0 0 8pt 0",
            }}
          >
            Patient Medical Summary
          </h1>

          {/* Patient line only if at least one of name/DOB */}
          {(isNonEmptyString(nameForPrint) || isNonEmptyString(dobForPrint)) && (
            <p style={{ margin: "0 0 6pt 0" }}>
              {isNonEmptyString(nameForPrint) && (
                <>
                  <strong>Patient:</strong> {nameForPrint}
                  {isNonEmptyString(dobForPrint) && " · "}
                </>
              )}
              {isNonEmptyString(dobForPrint) && (
                <>
                  <strong>DOB:</strong> {dobForPrint}
                </>
              )}
            </p>
          )}

          {/* Story */}
          {isNonEmptyString(storyForPrint) && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>Story</h2>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {storyForPrint}
              </p>
            </section>
          )}

          {/* Problems Today */}
          {isNonEmptyString(problemsForPrint) && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Problems Today
              </h2>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {problemsForPrint}
              </p>
            </section>
          )}

          {/* Diagnoses */}
          {diagnosesForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Diagnoses
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {diagnosesForPrint.map((d, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {d.name && <strong>{d.name}</strong>}
                    {d.status && <> ({d.status})</>}
                    {d.by && <> – {d.by}</>}
                    {d.date && <> – {d.date}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hospitalizations */}
          {hospForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Hospitalizations
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {hospForPrint.map((h, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {h.why && <strong>{h.why}</strong>}
                    {h.when && <> – {h.when}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Medications */}
          {medsForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Current Medications
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {medsForPrint.map((m, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {m.name && <strong>{m.name}</strong>}
                    {m.dose && <> – {m.dose}</>}
                    {m.freq && <> – {m.freq}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Allergies */}
          {allergiesForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Allergies
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {allergiesForPrint.map((a, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {a.item && <strong>{a.item}</strong>}
                    {a.reaction && <> – {a.reaction}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Procedures */}
          {proceduresForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Procedures & Surgeries
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {proceduresForPrint.map((p, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {p.name && <strong>{p.name}</strong>}
                    {p.date && <> – {p.date}</>}
                    {p.notes && <>. {p.notes}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Treatments */}
          {treatmentsForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Treatments
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {treatmentsForPrint.map((t, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {t.name && <strong>{t.name}</strong>}
                    {t.timeframe && <> – {t.timeframe}</>}
                    {t.effectiveness && <>. {t.effectiveness}</>}
                    {t.sideEffects && <> Side effects: {t.sideEffects}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tests & Imaging */}
          {testsForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Tests & Imaging
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {testsForPrint.map((ti, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {ti.test && <strong>{ti.test}</strong>}
                    {ti.date && <> – {ti.date}</>}
                    {ti.finding && <>. {ti.finding}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Doctors */}
          {doctorsForPrint.length > 0 && (
            <section className="print-section" style={{ marginBottom: "12pt" }}>
              <h2 style={{ fontSize: "13pt", marginBottom: "4pt" }}>
                Doctors / Specialists
              </h2>
              <ul style={{ marginTop: 0, paddingLeft: "18pt" }}>
                {doctorsForPrint.map((d, idx) => (
                  <li key={idx} style={{ marginBottom: "4pt" }}>
                    {d.name && <strong>{d.name}</strong>}
                    {d.specialty && <> – {d.specialty}</>}
                    {d.contact && <> – {d.contact}</>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
