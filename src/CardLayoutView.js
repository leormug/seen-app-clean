// src/CardLayoutView.js
/**
 * CardLayoutView.js
 * Screen view: full editor with floating Sections menu and bottom arrow.
 */

import React, { useEffect, useRef, useState } from "react";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

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
}) {
  const [localVisit, setLocalVisit] = useState(visitData || {});
  const hasParent = typeof mergeVisitData === "function";

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

  useEffect(() => {
    const base = hasParent ? visitData || {} : localVisit || {};
    const next = {};
    if (!Array.isArray(base.meds) || base.meds.length === 0) {
      next.meds = [{ name: "", dose: "", freq: "" }];
    }
    if (!Array.isArray(base.problemsTodayList)) {
      next.problemsTodayList = [];
    }
    if (Object.keys(next).length > 0) {
      mergeVisit(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const P_live = { ...(patientPermanent || {}) };
  const V_live = hasParent ? { ...(visitData || {}) } : { ...(localVisit || {}) };
  const P_default = patientDefaults || {};
  const V_default = visitDefaults || {};

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

  function setP(next) {
    setPatientPermanent(next);
  }
  function updateP(field, value) {
    setP({ ...patientPermanent, [field]: value });
  }
  function ensureArrayField(field) {
    if (!Array.isArray(patientPermanent?.[field])) {
      setP({ ...patientPermanent, [field]: [] });
      return [];
    }
    return patientPermanent[field];
  }
  function updatePArray(field, idx, key, value) {
    const arr = ensureArrayField(field).slice();
    if (!arr[idx]) arr[idx] = {};
    arr[idx] = { ...arr[idx], [key]: value };
    setP({ ...patientPermanent, [field]: arr });
  }
  function addPRow(field, template) {
    const arr = ensureArrayField(field).slice();
    arr.push(template);
    setP({ ...patientPermanent, [field]: arr });
  }
  function removePRow(field, idx, fallbackTemplate) {
    const arr = ensureArrayField(field).slice();
    arr.splice(idx, 1);
    if (arr.length === 0) arr.push(fallbackTemplate);
    setP({ ...patientPermanent, [field]: arr });
  }

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
    { id: "chronic", label: "Chronic Problems" },
    { id: "diagnoses", label: "Diagnoses" },
    { id: "hosp", label: "Hospitalizations" },
    { id: "meds", label: "Meds & Allergies" },
    { id: "procedures", label: "Procedures" },
    { id: "treatments", label: "Treatments" },
    { id: "tests", label: "Tests & Imaging" },
    { id: "impact", label: "Functional Impact" },
    { id: "docs", label: "Doctors" },
  ];
  const sectionRefs = useRef(
    Object.fromEntries(SECTIONS.map((s) => [s.id, React.createRef()]))
  );
  const [currentSection, setCurrentSection] = useState(SECTIONS[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const bottomRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setBottomVisible(entry.isIntersecting),
      { threshold: 1.0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScrollResize = () => {
      const doc = document.documentElement;
      const full = doc.scrollHeight || document.body.scrollHeight || 0;
      const viewport = window.innerHeight || doc.clientHeight || 0;
      const pageScrollable = full > viewport + 40;
      setShowArrow(pageScrollable && !bottomVisible);
    };
    onScrollResize();
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize);
    return () => {
      window.removeEventListener("scroll", onScrollResize);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [bottomVisible]);
      function handleClearForm() {
    const ok = window.confirm(
      "This will permanently clear all information in this visit. Continue?"
    );
    if (!ok) return;

    // 1) PATIENT-LEVEL: reset to empty values but keep one blank row
    const clearedPatient = {
      // simple fields
      name: "",
      dob: "",
      chronicProblemsText: "",
      functionalImpact: "",

      // arrays: 1 empty row each, so placeholders show but no real data
      diagnoses: [
        { name: "", by: "", date: "", status: "suspected" },
      ],
      hospitalizations: [
        { why: "", when: "" },
      ],
      procedures: [
        { name: "", date: "", notes: "" },
      ],
      treatments: [
        {
          name: "",
          timeframe: "",
          effectiveness: "",
          sideEffects: "",
        },
      ],
      testsImaging: [
        { test: "", finding: "", date: "" },
      ],
      doctors: [
        { name: "", specialty: "", contact: "" },
      ],
      allergies: [
        { item: "", reaction: "" },
      ],
    };

    if (typeof setPatientPermanent === "function") {
      setPatientPermanent(clearedPatient);
    }

    // 2) VISIT-LEVEL: clear text + 1 empty meds row
    const clearedVisit = {
      // Story
      symptoms: "",
      // Reasons
      problemsTodayText: "",
      problemsTodayList: [],
      // Meds: exactly 1 blank row
      meds: [{ name: "", dose: "", freq: "" }],
    };

    setLocalVisit(clearedVisit);

    // 3) Sync to localStorage so reload stays clean
    try {
      localStorage.setItem("patientPermanent", JSON.stringify(clearedPatient));
      localStorage.setItem("patientVisit", JSON.stringify(clearedVisit));
    } catch {}

    // 4) Tell parent about cleared visit if it manages visitData
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
        minHeight: "100%",
        padding: "16px",
        color: "#1a1a1a",
        maxWidth: "700px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
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
          {(Array.isArray(P_live.diagnoses) ? P_live.diagnoses : []).map(
            (d, idx) => {
              const dDefaults = (P_default.diagnoses || [])[idx] || {};
              const statusVal = isNonEmptyString(d?.status)
                ? d.status
                : dDefaults.status || "suspected";
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
                          status: "suspected",
                        })
                      }
                    />
                  </RowHeader>
                  <InputDemo
                    label="Name"
                    liveVal={d?.name || ""}
                    demoVal={dDefaults.name}
                    onChange={(val) =>
                      updatePArray("diagnoses", idx, "name", val)
                    }
                  />
                  <InputDemo
                    label="By (Clinician)"
                    liveVal={d?.by || ""}
                    demoVal={dDefaults.by}
                    onChange={(val) =>
                      updatePArray("diagnoses", idx, "by", val)
                    }
                  />
                  <InputDemo
                    label="Date"
                    liveVal={d?.date || ""}
                    demoVal={dDefaults.date}
                    onChange={(val) =>
                      updatePArray("diagnoses", idx, "date", val)
                    }
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
                        color: "#000",
                        fontStyle: "normal",
                      }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="suspected">Suspected</option>
                    </select>
                  </label>
                </div>
              );
            }
          )}
          <AddRowButton
            label="+ Add Diagnosis"
            onClick={() =>
              addPRow("diagnoses", {
                name: "",
                by: "",
                date: "",
                status: "confirmed",
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
          {(Array.isArray(P_live.hospitalizations)
            ? P_live.hospitalizations
            : []
          ).map((h, idx) => {
            const hDefaults = (P_default.hospitalizations || [])[idx] || {};
            return (
              <div key={idx} style={itemBoxStyle}>
                <RowHeader>
                  <span>Hospitalization {idx + 1}</span>
                  <DeleteButton
                    onClick={() =>
                      removePRow("hospitalizations", idx, { why: "", when: "" })
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
          {(Array.isArray(P_live.allergies) ? P_live.allergies : []).map(
            (a, idx) => {
              const aDefaults = (P_default.allergies || [])[idx] || {};
              return (
                <div key={idx} style={itemBoxStyle}>
                  <RowHeader>
                    <span>Allergy {idx + 1}</span>
                    <DeleteButton
                      onClick={() =>
                        removePRow("allergies", idx, { item: "", reaction: "" })
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
      <div ref={sectionRefs.current.procedures} data-section-id="procedures">
        <section style={cardOuterStyle}>
          <header style={headerRowStyle}>
            <h2 style={cardHeaderTitleStyle}>Procedures & Surgeries</h2>
          </header>
          {(Array.isArray(P_live.procedures) ? P_live.procedures : []).map(
            (p, idx) => {
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
      <div ref={sectionRefs.current.treatments} data-section-id="treatments">
        <section style={cardOuterStyle}>
          <header style={headerRowStyle}>
            <h2 style={cardHeaderTitleStyle}>Treatments</h2>
          </header>
          {(Array.isArray(P_live.treatments) ? P_live.treatments : []).map(
            (t, idx) => {
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
          {(Array.isArray(P_live.testsImaging) ? P_live.testsImaging : []).map(
            (ti, idx) => {
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
            }
          )}
          <AddRowButton
            label="+ Add Test"
            onClick={() =>
              addPRow("testsImaging", { test: "", finding: "", date: "" })
            }
          />
        </section>
      </div>

      {/* Functional Impact */}
      <div ref={sectionRefs.current.impact} data-section-id="impact">
        <section style={cardOuterStyle}>
          <header style={headerRowStyle}>
            <h2 style={cardHeaderTitleStyle}>Functional Impact</h2>
          </header>
          <TextAreaDemo
            label="Describe how illness affects daily life, mobility, independence"
            liveVal={P_live.functionalImpact}
            demoVal={P_default.functionalImpact}
            onChange={(val) => updateP("functionalImpact", val)}
            textRef={(el) => (textareasRef.current[3] = el)}
            autoResize={autoResize}
          />
        </section>
      </div>

      {/* Doctors */}
      <div ref={sectionRefs.current.docs} data-section-id="docs">
        <section style={cardOuterStyle}>
          <header style={headerRowStyle}>
            <h2 style={cardHeaderTitleStyle}>Doctors / Specialists</h2>
          </header>
          {(Array.isArray(P_live.doctors) ? P_live.doctors : []).map(
            (d, idx) => {
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
              addPRow("doctors", { name: "", specialty: "", contact: "" })
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
          <button
            type="button"
            onClick={() => {
              window.print();
            }}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              background: "#009024ff",
              color: "#ffffffff",
              border: "1px solid #bbb",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Print / Save PDF
          </button>
                   <button
            type="button"
            onClick={handleClearForm}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid #b91c1c",
              background: "#b91c1c",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear form
          </button>



          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                localStorage.removeItem("auth_session_user");
                sessionStorage.clear();
              } catch {}
              window.location.reload();
            }}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid #bbb",
              background: "#f6f6f6",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </section>

      {/* bottom sentinel */}
      <div ref={bottomRef} aria-hidden style={{ height: 1 }} />

      {/* Floating Section Nav */}
      <div
        className="no-print"
        aria-label="Section navigator"
        style={{ position: "fixed", top: 100, right: 16, zIndex: 2000 }}
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
            background: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
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
              overflow: "auto",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(0,0,0,0.16)",
              padding: 10,
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
                    background: active ? "#111827" : "transparent",
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
  );
}
