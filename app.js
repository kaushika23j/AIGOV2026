(function () {
  "use strict";

  const STORAGE_KEY = "ai-governance-maturity-web-v1";
  const VERSION_LABEL = "v5 web application";

  const ORG_LABELS = {
    public_practice: "Public Practice Accounting Firm",
    corporate_finance: "Corporate - Designated Finance Function",
    afs_licensee: "AFS / Credit Licensee",
    apra_regulated: "APRA-Regulated Entity"
  };

  const DOMAIN_LABELS = {
    governance: "Governance Structure & Accountability",
    policy: "Policy, Documentation & Frameworks",
    risk: "Risk Management & Third-Party AI",
    privacy: "Privacy & Data Governance",
    transparency: "Transparency & Human Oversight",
    capability: "Staff Capability & Ethics"
  };

  const FRAMEWORK_LABELS = {
    vaiss: "Voluntary AI Safety Standard (VAISS)",
    iso42001: "ISO/IEC 42001:2023",
    iso23894: "ISO/IEC 23894:2023",
    nist_rmf: "NIST AI RMF 1.0",
    oecd_ai: "OECD AI Principles",
    aicd_guide: "AICD Director's Guide to AI Governance",
    apes110: "APES 110 Technology Amendments",
    ai_ethics: "Australia's AI Ethics Principles",
    privacy_ai: "OAIC AI Guidance",
    none: "None of the above"
  };

  const REFERENCED_FRAMEWORKS = [
    {
      name: "ASIC REP 798",
      lens: "AI governance, board oversight, vendor management, explainability, monitoring, and consumer disclosure.",
      questions: ["q-accountable-official", "q-board-reporting", "q-ai-committee", "q-ai-policy", "q-risk-assessment", "q-vendor-management", "q-ai-monitoring", "q-explainability", "q-human-oversight", "q-client-disclosure"],
      appliesTo: ["afs_licensee", "apra_regulated"],
      persona: "Board Risk Committee / Chief Risk Officer",
      action: "Create an ASIC-ready evidence pack covering accountability, AI inventory, risk assessment, explainability, monitoring, disclosure, and third-party controls."
    },
    {
      name: "APRA CPS 230",
      lens: "Operational risk, critical operations, material service providers, business continuity, and board accountability.",
      questions: ["q-board-reporting", "q-risk-assessment", "q-vendor-management", "q-ai-monitoring", "q-cps230ops"],
      appliesTo: ["apra_regulated"],
      persona: "Chief Risk Officer / Chief Operations Officer",
      action: "Map AI tools to critical operations, risk-rate dependencies, and bring AI incidents and continuity tests into CPS 230 governance."
    },
    {
      name: "APRA CPS 234",
      lens: "Information security capability, control testing, incident response, and third-party technology risk.",
      questions: ["q-data-in-ai", "q-vendor-management", "q-ai-monitoring", "q-pia"],
      appliesTo: ["apra_regulated"],
      persona: "Chief Information Security Officer",
      action: "Connect AI data handling, vendor assurance, and monitoring to information security control testing and incident response."
    },
    {
      name: "Voluntary AI Safety Standard (VAISS)",
      lens: "Practical 10-guardrail baseline for accountability, risk management, data governance, testing, transparency, and human oversight.",
      questions: ["q-accountable-official", "q-ai-policy", "q-ai-register", "q-risk-assessment", "q-ai-monitoring", "q-data-in-ai", "q-explainability", "q-human-oversight", "q-speak-up"],
      adoptedKey: "vaiss",
      persona: "Executive AI Sponsor / CFO",
      action: "Use the 10 guardrails as the implementation checklist for policy, register, risk assessment, monitoring, disclosure, and escalation."
    },
    {
      name: "APES 110 Technology Amendments",
      lens: "Professional competence, due care, objectivity, confidentiality, and ethical use of technology by accounting professionals.",
      questions: ["q-data-in-ai", "q-human-oversight", "q-training", "q-speak-up", "q-apes320"],
      appliesTo: ["public_practice"],
      adoptedKey: "apes110",
      persona: "Managing Partner / Ethics Partner",
      action: "Translate AI use into professional standards procedures for confidentiality, supervision, review, competence, and ethical challenge."
    },
    {
      name: "APES 320",
      lens: "Quality management for non-assurance services, including supervision, engagement quality controls, and file evidence.",
      questions: ["q-apes320", "q-human-oversight", "q-data-in-ai", "q-training"],
      appliesTo: ["public_practice"],
      persona: "Quality Management Partner",
      action: "Update the quality management system so AI tools in client engagements are risk-assessed, supervised, reviewed, and evidenced."
    },
    {
      name: "Privacy Act 1988 and APPs",
      lens: "Personal information governance, collection and use limitation, transparency, consent, and reasonable safeguards.",
      questions: ["q-data-in-ai", "q-privacy-policy", "q-pia", "q-client-disclosure"],
      persona: "Privacy Officer / General Counsel",
      action: "Control personal information at the point of AI entry, run PIAs, and evidence privacy-by-design controls."
    },
    {
      name: "Privacy and Other Legislation Amendment Act 2024",
      lens: "Automated decision-making transparency and privacy policy disclosure readiness.",
      questions: ["q-privacy-policy", "q-explainability", "q-client-disclosure"],
      persona: "General Counsel / Privacy Officer",
      action: "Update privacy notices and customer-facing explanations for AI-assisted or automated decisions before transparency obligations bite."
    },
    {
      name: "OAIC AI Guidance",
      lens: "Commercial AI product use, developer guidance, PIAs, data minimisation, transparency, and privacy-by-design controls.",
      questions: ["q-data-in-ai", "q-privacy-policy", "q-pia", "q-ai-register"],
      adoptedKey: "privacy_ai",
      persona: "Privacy Officer / Data Governance Lead",
      action: "Document which data can enter AI tools, restrict sensitive inputs, complete PIAs, and align notices to actual AI use."
    },
    {
      name: "AUSTRAC AI Transparency Statement",
      lens: "Transparency and governance for AI use in AML/CTF processes.",
      questions: ["q-austrac", "q-risk-assessment", "q-ai-monitoring", "q-explainability"],
      appliesTo: ["afs_licensee", "apra_regulated"],
      persona: "MLRO / Financial Crime Lead",
      action: "Document AI touchpoints in AML/CTF workflows and confirm governance, transparency, and escalation expectations."
    },
    {
      name: "Australia's AI Ethics Principles",
      lens: "Human, societal, and environmental wellbeing, fairness, privacy, reliability, transparency, contestability, and accountability.",
      questions: ["q-bias-testing", "q-explainability", "q-human-oversight", "q-speak-up", "q-client-disclosure"],
      adoptedKey: "ai_ethics",
      persona: "Chief People Officer / Risk Lead",
      action: "Build fairness, contestability, and accountability controls into high-impact finance and customer workflows."
    },
    {
      name: "National Framework for AI Assurance in Government",
      lens: "AI assurance, registers, impact assessment, risk classification, and accountable ownership.",
      questions: ["q-ai-register", "q-risk-assessment", "q-accountable-official", "q-ai-monitoring"],
      persona: "Risk Assurance Lead / Internal Audit",
      action: "Use an AI register and assurance checkpoints even outside government to make ownership, risk, and monitoring visible."
    },
    {
      name: "AICD Director's Guide to AI Governance",
      lens: "Board roles, governance structures, people and culture, policy, controls, infrastructure, stakeholder impact, and reporting.",
      questions: ["q-accountable-official", "q-board-reporting", "q-ai-committee", "q-training", "q-ai-register"],
      adoptedKey: "aicd_guide",
      persona: "Board Chair / Company Secretary",
      action: "Convert AI governance into board-level accountabilities, committee charters, reporting metrics, and skills uplift."
    },
    {
      name: "AHRC Human Rights and Technology guidance",
      lens: "Human rights, non-discrimination, explainability, contestability, and challenge rights for consequential AI decisions.",
      questions: ["q-explainability", "q-client-disclosure", "q-bias-testing", "q-speak-up", "q-human-oversight"],
      persona: "Legal Counsel / Ethics Lead",
      action: "Treat bias testing, explainability, and contestability as control requirements for consequential finance and customer outcomes."
    },
    {
      name: "ISO/IEC 42001:2023",
      lens: "AI management system for policies, roles, risk controls, performance evaluation, and continuous improvement.",
      questions: ["q-ai-policy", "q-accountable-official", "q-ai-register", "q-risk-assessment", "q-ai-monitoring", "q-training"],
      adoptedKey: "iso42001",
      persona: "Chief Information Officer / Transformation Lead",
      action: "Use ISO/IEC 42001 to turn AI governance from a policy document into a repeatable management system."
    },
    {
      name: "ISO/IEC 23894:2023",
      lens: "AI-specific risk management including bias, fairness, explainability, security, data privacy, and lifecycle risk treatment.",
      questions: ["q-risk-assessment", "q-vendor-management", "q-ai-monitoring", "q-bias-testing", "q-explainability"],
      adoptedKey: "iso23894",
      persona: "Enterprise Risk Lead",
      action: "Use ISO/IEC 23894 as the detailed risk taxonomy for use-case assessments and vendor assurance."
    },
    {
      name: "NIST AI RMF 1.0",
      lens: "GOVERN, MAP, MEASURE, and MANAGE functions for accountable AI risk management.",
      questions: ["q-accountable-official", "q-ai-policy", "q-risk-assessment", "q-vendor-management", "q-ai-monitoring", "q-speak-up"],
      adoptedKey: "nist_rmf",
      persona: "AI Governance Lead / CIO",
      action: "Map each AI use case through GOVERN, MAP, MEASURE, and MANAGE, with owners and evidence for each stage."
    },
    {
      name: "OECD AI Principles",
      lens: "Inclusive growth, human-centred values, transparency, robustness, safety, security, and accountability.",
      questions: ["q-explainability", "q-client-disclosure", "q-bias-testing", "q-ai-monitoring", "q-accountable-official"],
      adoptedKey: "oecd_ai",
      persona: "Executive Leadership Team",
      action: "Use the principles to test whether AI-enabled finance work is explainable, fair, robust, and accountable."
    }
  ];

  const SECTIONS = [
    {
      id: "profile",
      title: "Organisation Profile",
      nav: "Profile",
      description: "Set the operating context so the assessment can branch to the right regulatory obligations.",
      questions: [
        {
          id: "q-org-type",
          type: "radio",
          required: true,
          label: "What best describes your organisation?",
          reference: "Determines applicability of APES 110 / APESB standards, Corporations Act / AFS licence obligations, and APRA-specific controls.",
          options: [
            ["public_practice", "Public Practice Accounting Firm", "Audit, tax, advisory, assurance, and professional services firms."],
            ["corporate_finance", "Corporate - Designated Finance Function", "CFO, finance, FP&A, treasury, management accounting, or reporting in a non-financial services company."],
            ["afs_licensee", "AFS / Credit Licensee (Financial Services)", "Banks, insurers, super funds, financial advisers, credit providers, and other ASIC-regulated licensees."],
            ["apra_regulated", "APRA-Regulated Entity", "ADIs, insurers, superannuation trustees, and entities subject to APRA prudential standards."]
          ]
        },
        {
          id: "q-size",
          type: "select",
          required: true,
          label: "Organisation size (headcount)",
          reference: "Scales governance expectations, reporting cadence, and operational resilience obligations.",
          options: [
            ["", "Select size"],
            ["micro", "Under 20 staff"],
            ["small", "20-100 staff"],
            ["mid", "101-500 staff"],
            ["large", "501-2,000 staff"],
            ["enterprise", "2,000+ staff"]
          ]
        },
        {
          id: "q-self-maturity",
          type: "radio",
          required: true,
          label: "How would you rate your organisation's current AI maturity?",
          reference: "Compared against computed score to detect calibration gaps.",
          options: [
            ["1", "No AI in use", "AI is not used in any business process."],
            ["2", "Ad hoc / experimental", "Staff use AI tools informally with no approved policy."],
            ["3", "Emerging governance", "Some policies or controls are in draft; oversight is limited."],
            ["4", "Established governance", "Formal policy, assigned accountability, and risk processes are in place."],
            ["5", "Advanced / optimising", "Continuous monitoring, board reporting, AI register, and assurance are operating."]
          ]
        }
      ]
    },
    {
      id: "governance",
      title: "Governance Structure & Accountability",
      nav: "Governance",
      description: "Board and executive accountability for AI, aligned to ASIC REP 798, APRA CPS 230, VAISS Guardrail 1, and the AICD Director's Guide.",
      questions: [
        {
          id: "q-accountable-official",
          type: "radio",
          required: true,
          label: "Is there a named individual or role ultimately accountable for AI governance?",
          reference: "ASIC REP 798, VAISS Guardrail 1, APRA CPS 230, AICD Element 1.",
          options: [
            ["0", "No", "No one is specifically responsible for AI governance."],
            ["1", "Informally", "Someone oversees AI, but it is not a defined or documented role."],
            ["2", "Defined role, not executive level", "A manager or team lead has documented AI accountability."],
            ["3", "Executive-level accountability", "CIO, CFO, COO, CRO, or equivalent has formal AI ownership."]
          ]
        },
        {
          id: "q-board-reporting",
          type: "radio",
          required: true,
          label: "Does your board or governing body receive regular reporting on AI risk?",
          reference: "ASIC REP 798, APRA CPS 230, Corporations Act directors' duties, AICD Element 8.",
          options: [
            ["0", "No", "AI is not discussed at board or governing body level."],
            ["1", "Ad hoc", "AI is mentioned occasionally but not on a structured basis."],
            ["2", "At least annually", "AI risk reporting occurs at minimum once a year."],
            ["3", "Quarterly or more frequent", "A structured reporting cadence includes defined AI risk metrics."]
          ]
        },
        {
          id: "q-ai-committee",
          type: "radio",
          required: true,
          cols: 2,
          label: "Is there a dedicated AI governance committee, working group, or equivalent?",
          reference: "ASIC REP 798, VAISS Guardrail 1, AICD Element 2.",
          options: [
            ["0", "No", ""],
            ["1", "Planned but not formed", ""],
            ["2", "Informally constituted", ""],
            ["3", "Formal, documented, executive-level", ""]
          ]
        }
      ]
    },
    {
      id: "policy",
      title: "Policy, Documentation & AI Inventory",
      nav: "Policy",
      description: "Documented policy, AI inventory, and formal framework adoption are core evidence for governance maturity.",
      questions: [
        {
          id: "q-ai-policy",
          type: "radio",
          required: true,
          label: "Does your organisation have a formal, written AI policy?",
          reference: "ASIC REP 798, VAISS Guardrail 1, APES 110 professional competence and due care.",
          options: [
            ["0", "No written AI policy exists", ""],
            ["1", "Draft in progress", "Being developed but not yet approved."],
            ["2", "Approved, not actively communicated", "Approved document exists but is not embedded."],
            ["3", "Approved, communicated, and regularly reviewed", "Defined review cycle, at least annually."]
          ]
        },
        {
          id: "q-ai-register",
          type: "radio",
          required: true,
          cols: 2,
          label: "Does your organisation maintain a register or inventory of AI tools and use cases?",
          reference: "National Framework for AI Assurance in Government, APRA CPS 230, VAISS Guardrail 1.",
          options: [
            ["0", "No", "No register exists."],
            ["1", "Partial", "Some tools documented informally."],
            ["2", "Basic inventory", "Documented but not comprehensive."],
            ["3", "Full register", "Purpose, risk rating, data inputs, and owner documented."]
          ]
        },
        {
          id: "q-frameworks-adopted",
          type: "checkbox",
          required: true,
          label: "Which AI-related policies or frameworks has your organisation formally adopted?",
          reference: "Each adoption contributes to the Policy domain score. Select all that apply, or select None.",
          options: [
            ["vaiss", "Voluntary AI Safety Standard (VAISS)", "10 practical guardrails for responsible AI in Australia."],
            ["iso42001", "ISO/IEC 42001:2023", "AI management system standard."],
            ["iso23894", "ISO/IEC 23894:2023", "AI risk management guidance."],
            ["nist_rmf", "NIST AI Risk Management Framework", "GOVERN, MAP, MEASURE, MANAGE risk functions."],
            ["oecd_ai", "OECD AI Principles", "Human-centred values, explainability, robustness, and accountability."],
            ["aicd_guide", "AICD Director's Guide to AI Governance", "Board-level governance framework."],
            ["apes110", "APES 110 Technology Amendments", "Ethical obligations for accounting professionals."],
            ["ai_ethics", "Australia's AI Ethics Principles", "Fairness, privacy, accountability, and transparency."],
            ["privacy_ai", "OAIC AI Guidance", "Privacy guidance for commercially available AI products and developers."],
            ["none", "None of the above", ""]
          ]
        },
        {
          id: "q-apes320",
          type: "radio",
          required: true,
          conditional: ["public_practice"],
          tag: "Public practice only",
          label: "Does your firm's Quality Management System (APES 320) formally address AI tools used in client engagements?",
          reference: "APES 320, APES 110 Technology Amendments, APESB Technical Alert on ethical AI use.",
          options: [
            ["0", "No - QMS does not reference AI tools", ""],
            ["1", "Under review", "APES 320 documentation is being updated."],
            ["2", "AI referenced generally", "AI appears in QMS documentation but is not fully embedded."],
            ["3", "Fully integrated into QMS", "Pre-engagement AI risk assessment, supervision requirements, and file review procedures are documented."]
          ]
        }
      ]
    },
    {
      id: "risk",
      title: "Risk Management & Third-Party AI",
      nav: "Risk",
      description: "Risk assessment, vendor controls, monitoring, and regulated-entity obligations under ASIC REP 798, APRA CPS 230, and VAISS.",
      questions: [
        {
          id: "q-risk-assessment",
          type: "radio",
          required: true,
          label: "Has your organisation conducted a formal AI risk assessment?",
          reference: "VAISS Guardrail 2, ASIC REP 798, APRA CPS 230, OAIC PIAs, NIST AI RMF, ISO/IEC 23894.",
          options: [
            ["0", "No formal risk assessment", ""],
            ["1", "Informal review only", "Risk is considered ad hoc when adopting new tools."],
            ["2", "Formal assessment for some use cases", ""],
            ["3", "Comprehensive assessment", "All AI use cases are assessed and reviewed regularly, including bias, explainability, security, and consumer harm."]
          ]
        },
        {
          id: "q-vendor-management",
          type: "radio",
          required: true,
          label: "How does your organisation manage third-party AI vendors and tools?",
          reference: "ASIC REP 798, APRA CPS 230, VAISS Guardrail 2, NIST AI RMF GOVERN, AICD Element 5.",
          options: [
            ["0", "No AI-specific vendor process", "Standard procurement applies."],
            ["1", "Basic due diligence", "Security and data handling are checked, but AI-specific requirements are limited."],
            ["2", "AI-specific vendor requirements", "Vendors are assessed for explainability, bias, data use, and performance."],
            ["3", "Full lifecycle vendor governance", "Selection criteria, contractual AI obligations, ongoing monitoring, and right-to-audit clauses are in place."]
          ]
        },
        {
          id: "q-ai-monitoring",
          type: "radio",
          required: true,
          cols: 2,
          label: "Are there controls to detect and respond to AI failures, errors, or unexpected outputs?",
          reference: "VAISS Guardrail 4, ASIC REP 798, APRA CPS 230, NIST AI RMF MANAGE, ISO/IEC 23894.",
          options: [
            ["0", "No monitoring controls", ""],
            ["1", "Ad hoc review only", ""],
            ["2", "Periodic review processes", ""],
            ["3", "Continuous monitoring and incident escalation", ""]
          ]
        },
        {
          id: "q-austrac",
          type: "radio",
          required: true,
          conditional: ["afs_licensee", "apra_regulated"],
          tag: "AFS and APRA only",
          label: "Has your organisation reviewed AUSTRAC's AI transparency expectations and assessed AI use within AML/CTF processes?",
          reference: "AUSTRAC AI Transparency Statement, AML/CTF Act technology governance, ASIC REP 798.",
          options: [
            ["0", "No - AUSTRAC AI guidance has not been reviewed", ""],
            ["1", "Aware but no formal assessment", ""],
            ["2", "Guidance reviewed; assessment underway", ""],
            ["3", "Full assessment complete", "AI in AML/CTF processes is documented and governed."]
          ]
        },
        {
          id: "q-cps230ops",
          type: "radio",
          required: true,
          conditional: ["apra_regulated"],
          tag: "APRA-regulated only",
          label: "Have AI tools that support critical operations been mapped and assessed under APRA CPS 230?",
          reference: "APRA CPS 230, CPG 230, APRA CPS 234.",
          options: [
            ["0", "No - critical operations mapping does not include AI tools", ""],
            ["1", "Critical operations identified but AI tools not yet mapped", ""],
            ["2", "AI tools mapped to some critical operations", "Risk assessment is in progress."],
            ["3", "All relevant AI mapped and tested", "AI supporting critical operations is risk-rated and subject to continuity testing."]
          ]
        }
      ]
    },
    {
      id: "privacy",
      title: "Privacy, Data Governance & Confidentiality",
      nav: "Privacy",
      description: "Data-in-AI controls, privacy transparency, and PIAs mapped to the Privacy Act, OAIC guidance, and APES 110 confidentiality.",
      questions: [
        {
          id: "q-data-in-ai",
          type: "radio",
          required: true,
          label: "Has your organisation assessed whether client or personal data is being entered into AI tools?",
          reference: "OAIC commercially available AI guidance, Privacy Act APPs 1, 3 and 6, APES 110 confidentiality.",
          options: [
            ["0", "No - not assessed", ""],
            ["1", "Partially assessed", "Some tools reviewed but no comprehensive picture."],
            ["2", "Assessed and controls are in place", "Staff guidance covers what data can and cannot enter AI systems."],
            ["3", "Assessed, documented, and technically enforced", "Controls are actively monitored or technically enforced."]
          ]
        },
        {
          id: "q-privacy-policy",
          type: "radio",
          required: true,
          label: "Has your privacy policy been updated to disclose your use of AI and automated decision-making?",
          reference: "Privacy and Other Legislation Amendment Act 2024, APP 1.7-1.9 transparency obligations, OAIC AI guidance.",
          options: [
            ["0", "No - privacy policy makes no mention of AI", ""],
            ["1", "Under review", "Privacy policy is being updated to address AI."],
            ["2", "References AI generally", ""],
            ["3", "Fully updated", "Discloses AI use, automated decision types, data used, and individual rights."]
          ]
        },
        {
          id: "q-pia",
          type: "radio",
          required: true,
          cols: 2,
          label: "Have Privacy Impact Assessments been conducted before deploying AI tools that handle personal information?",
          reference: "OAIC privacy by design, Privacy Act APP 1.2, VAISS Guardrail 3.",
          options: [
            ["0", "No PIAs conducted", ""],
            ["1", "PIAs done for some tools", ""],
            ["2", "PIAs required for all high-risk AI tools", ""],
            ["3", "PIAs required for all AI deployments", ""]
          ]
        }
      ]
    },
    {
      id: "transparency",
      title: "Transparency, Explainability & Human Oversight",
      nav: "Oversight",
      description: "Explainability, mandatory human review, and client disclosure for professional and high-stakes decisions.",
      questions: [
        {
          id: "q-explainability",
          type: "radio",
          required: true,
          label: "Can your organisation explain how AI used in client-facing or financial decisions reaches its outputs?",
          reference: "ASIC REP 798, VAISS Guardrail 6, APES 110, OECD AI Principle 3, AHRC human rights guidance.",
          options: [
            ["0", "No - outputs are treated as-is", ""],
            ["1", "Partially", "Some tools can be explained, but not all."],
            ["2", "High-risk uses can be explained", ""],
            ["3", "All relevant decisions can be explained and documented", "Audit trail exists; black-box tools are rejected in high-stakes contexts."]
          ]
        },
        {
          id: "q-human-oversight",
          type: "radio",
          required: true,
          label: "Is human review mandatory before AI-generated outputs are acted upon in professional work or client decisions?",
          reference: "APES 110, ASIC REP 798, VAISS Guardrail 8, APESB ethical AI guidance.",
          options: [
            ["0", "No mandatory human review", ""],
            ["1", "Encouraged but not mandatory", ""],
            ["2", "Mandatory for high-risk use cases only", ""],
            ["3", "Mandatory for all professional or client-facing AI outputs", "Documented human review supports professional judgment."]
          ]
        },
        {
          id: "q-client-disclosure",
          type: "radio",
          required: true,
          cols: 2,
          label: "Are clients or customers informed when AI has contributed to a service, recommendation, or communication?",
          reference: "ASIC REP 798, OAIC AI guidance, VAISS Guardrail 6, Australian Consumer Law, OECD AI Principles, AHRC guidance.",
          options: [
            ["0", "No disclosure", ""],
            ["1", "General policy only", "Disclosure is not case-by-case."],
            ["2", "Disclosed in engagement terms", ""],
            ["3", "Disclosed at point of delivery for significant AI use", ""]
          ]
        }
      ]
    },
    {
      id: "capability",
      title: "Staff Capability, Ethics & Culture",
      nav: "Capability",
      description: "Workforce readiness, ethical AI culture, bias testing, and speak-up mechanisms.",
      questions: [
        {
          id: "q-training",
          type: "radio",
          required: true,
          label: "What is the state of AI training and capability uplift for staff?",
          reference: "APES 110 Technology Amendments, National AI Plan, VAISS Guardrail 1, AICD Element 3.",
          options: [
            ["0", "No AI training provided", ""],
            ["1", "General awareness only", "Informal sharing or optional resources."],
            ["2", "Role-specific training for AI users", ""],
            ["3", "Mandatory structured training for all staff", "Includes ethical use, privacy obligations, and critical evaluation of AI outputs."]
          ]
        },
        {
          id: "q-bias-testing",
          type: "radio",
          required: true,
          cols: 2,
          label: "Does your organisation test AI tools for bias, fairness, and discriminatory outputs before deployment or on an ongoing basis?",
          reference: "ASIC REP 798, VAISS Guardrail 4, Australia's AI Ethics Principles, OECD AI Principle 2, AHRC guidance, ISO/IEC 23894.",
          options: [
            ["0", "No testing for bias", ""],
            ["1", "Considered but not formally tested", ""],
            ["2", "Pre-deployment testing for critical tools", ""],
            ["3", "Ongoing monitoring and documented bias testing", ""]
          ]
        },
        {
          id: "q-speak-up",
          type: "radio",
          required: true,
          cols: 2,
          label: "Is there a clear process for staff to raise concerns about AI outputs or ethical issues?",
          reference: "VAISS Guardrail 8, APES 110, Australia's AI Ethics Principles, OECD AI Principle 5, NIST AI RMF MANAGE.",
          options: [
            ["0", "No formal process", ""],
            ["1", "Can raise via general channels", ""],
            ["2", "Documented AI escalation path", ""],
            ["3", "Dedicated AI ethics channel and formal resolution process", ""]
          ]
        }
      ]
    }
  ];

  const state = {
    currentSection: 0,
    answers: {},
    latestReport: null
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    mapElements();
    restoreDraft();
    buildStepNav();
    wireEvents();
    render();
  }

  function mapElements() {
    [
      "noticeScreen", "acknowledgeBtn", "app", "workspace", "stepNav", "headerContext", "sectionLabel",
      "sectionTitle", "sectionDescription", "validationMessage", "questionsHost", "backBtn",
      "nextBtn", "saveDraftBtn", "resetBtn", "assessmentView", "resultsView", "progressBar",
      "reportSubline", "maturityBadge", "maturityLevel", "maturityScore", "calibrationCard",
      "calibrationText", "metricStrip", "boardSummaryList", "holisticSummary", "scoreBars", "frameworkTitle",
      "frameworkRationale", "frameworkCards", "frameworkAnalysisList", "gapsList",
      "principlesList", "roadmapList", "watchText",
      "editAnswersBtn", "copySummaryBtn", "exportJsonBtn", "printBtn", "toast"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function wireEvents() {
    els.acknowledgeBtn.addEventListener("click", () => {
      els.noticeScreen.hidden = true;
      els.app.hidden = false;
      showAssessmentSection(0, { replaceRoute: true, save: false, focus: true });
    });

    els.backBtn.addEventListener("click", () => {
      if (state.currentSection > 0) {
        showAssessmentSection(state.currentSection - 1, { save: false, focus: true });
      }
    });

    els.nextBtn.addEventListener("click", () => {
      if (!validateCurrentSection()) return;
      if (state.currentSection === SECTIONS.length - 1) {
        generateReport();
        return;
      }
      showAssessmentSection(state.currentSection + 1, { save: true, focus: true });
    });

    els.saveDraftBtn.addEventListener("click", () => saveDraft(true));
    els.resetBtn.addEventListener("click", resetAssessment);
    els.editAnswersBtn.addEventListener("click", editAnswers);
    els.copySummaryBtn.addEventListener("click", copyBoardSummary);
    els.exportJsonBtn.addEventListener("click", exportJson);
    els.printBtn.addEventListener("click", () => window.print());
  }

  function buildStepNav() {
    els.stepNav.innerHTML = "";
    SECTIONS.forEach((section, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-button";
      button.dataset.index = String(index);
      button.innerHTML = `
        <span class="step-index">${index + 1}</span>
        <span class="step-copy">
          <strong>${escapeHtml(section.nav)}</strong>
          <span>${index === 0 ? "Context" : "Domain " + index}</span>
        </span>
      `;
      button.addEventListener("click", () => {
        if (index <= highestReachableSection()) {
          showAssessmentSection(index, { save: false, focus: true });
        }
      });
      els.stepNav.appendChild(button);
    });
  }

  function showAssessmentSection(index, options = {}) {
    const { replaceRoute = false, save = false, focus = false } = options;
    state.currentSection = Math.max(0, Math.min(index, SECTIONS.length - 1));
    els.noticeScreen.hidden = true;
    els.app.hidden = false;
    els.resultsView.hidden = true;
    els.assessmentView.hidden = false;
    render();
    if (save) saveDraft(false);
    setRoute(`assessment-section-${state.currentSection + 1}`, replaceRoute);
    jumpToCurrentView({ focus });
  }

  function render() {
    const section = SECTIONS[state.currentSection];
    els.headerContext.textContent = `${VERSION_LABEL} / ${ORG_LABELS[state.answers["q-org-type"]] || "Australia / Finance leaders"}`;
    els.sectionLabel.textContent = `Section ${state.currentSection + 1} of ${SECTIONS.length}`;
    els.sectionTitle.textContent = section.title;
    els.sectionDescription.textContent = section.description;
    els.validationMessage.hidden = true;
    renderQuestions(section);
    renderStepState();
    updateProgress();
    els.backBtn.disabled = state.currentSection === 0;
    els.nextBtn.innerHTML = state.currentSection === SECTIONS.length - 1
      ? 'Generate report <span aria-hidden="true">&rarr;</span>'
      : 'Continue <span aria-hidden="true">&rarr;</span>';
  }

  function renderQuestions(section) {
    els.questionsHost.innerHTML = "";
    visibleQuestions(section.questions).forEach((question) => {
      const block = document.createElement("article");
      block.className = "question-block";
      block.dataset.questionId = question.id;

      const tag = question.tag ? `<span class="conditional-tag">${escapeHtml(question.tag)}</span>` : "";
      block.innerHTML = `
        ${tag}
        <h3 class="question-label">${escapeHtml(question.label)}</h3>
        <p class="question-ref">${escapeHtml(question.reference)}</p>
      `;

      if (question.type === "select") {
        block.appendChild(renderSelect(question));
      } else if (question.type === "radio" || question.type === "checkbox") {
        block.appendChild(renderChoiceGrid(question));
      }

      els.questionsHost.appendChild(block);
    });
  }

  function renderSelect(question) {
    const select = document.createElement("select");
    select.id = question.id;
    select.value = state.answers[question.id] || "";
    question.options.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      state.answers[question.id] = select.value;
      saveDraft(false);
    });
    return select;
  }

  function renderChoiceGrid(question) {
    const grid = document.createElement("div");
    grid.className = `option-grid ${question.cols === 2 ? "cols-2" : ""}`;
    grid.setAttribute("role", question.type === "checkbox" ? "group" : "radiogroup");
    grid.setAttribute("aria-label", question.label);

    question.options.forEach(([value, label, detail]) => {
      const selected = isSelected(question.id, value, question.type);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `option-card ${selected ? "selected" : ""}`;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.innerHTML = `
        <span class="choice-glyph ${question.type === "checkbox" ? "checkbox" : "radio"}" aria-hidden="true"></span>
        <span>
          <strong>${escapeHtml(label)}</strong>
          ${detail ? `<span>${escapeHtml(detail)}</span>` : ""}
        </span>
      `;
      button.addEventListener("click", () => {
        if (question.type === "radio") {
          state.answers[question.id] = value;
          if (question.id === "q-org-type") clearHiddenConditionalAnswers();
        } else {
          updateCheckboxAnswer(question.id, value);
        }
        saveDraft(false);
        render();
      });
      grid.appendChild(button);
    });

    return grid;
  }

  function isSelected(questionId, value, type) {
    if (type === "checkbox") {
      return Array.isArray(state.answers[questionId]) && state.answers[questionId].includes(value);
    }
    return state.answers[questionId] === value;
  }

  function updateCheckboxAnswer(questionId, value) {
    const existing = Array.isArray(state.answers[questionId]) ? [...state.answers[questionId]] : [];
    let next;
    if (value === "none") {
      next = existing.includes("none") ? [] : ["none"];
    } else {
      next = existing.filter((item) => item !== "none");
      if (next.includes(value)) next = next.filter((item) => item !== value);
      else next.push(value);
    }
    state.answers[questionId] = next;
  }

  function visibleQuestions(questions) {
    const orgType = state.answers["q-org-type"];
    return questions.filter((question) => !question.conditional || question.conditional.includes(orgType));
  }

  function clearHiddenConditionalAnswers() {
    const visibleIds = new Set(SECTIONS.flatMap((section) => visibleQuestions(section.questions).map((q) => q.id)));
    Object.keys(state.answers).forEach((key) => {
      if (!visibleIds.has(key)) delete state.answers[key];
    });
  }

  function validateCurrentSection() {
    const section = SECTIONS[state.currentSection];
    const missing = visibleQuestions(section.questions).filter((question) => {
      if (!question.required) return false;
      const value = state.answers[question.id];
      if (question.type === "checkbox") return !Array.isArray(value) || value.length === 0;
      return value === undefined || value === null || value === "";
    });

    if (!missing.length) return true;

    els.validationMessage.textContent = `Please complete: ${missing.map((q) => q.label).join("; ")}`;
    els.validationMessage.hidden = false;
    els.validationMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return false;
  }

  function renderStepState() {
    const reachable = highestReachableSection();
    els.stepNav.querySelectorAll(".step-button").forEach((button) => {
      const index = Number(button.dataset.index);
      button.classList.toggle("active", index === state.currentSection && els.assessmentView.hidden === false);
      button.classList.toggle("done", sectionIsComplete(index));
      button.disabled = index > reachable;
    });
  }

  function sectionIsComplete(index) {
    const section = SECTIONS[index];
    return visibleQuestions(section.questions).every((question) => {
      if (!question.required) return true;
      const value = state.answers[question.id];
      if (question.type === "checkbox") return Array.isArray(value) && value.length > 0;
      return value !== undefined && value !== null && value !== "";
    });
  }

  function highestReachableSection() {
    let highest = 0;
    for (let i = 0; i < SECTIONS.length; i += 1) {
      if (sectionIsComplete(i)) highest = Math.min(i + 1, SECTIONS.length - 1);
      else break;
    }
    return highest;
  }

  function updateProgress() {
    const answered = SECTIONS.reduce((count, section) => {
      return count + visibleQuestions(section.questions).filter((question) => {
        const value = state.answers[question.id];
        return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== "";
      }).length;
    }, 0);
    const total = SECTIONS.reduce((count, section) => count + visibleQuestions(section.questions).length, 0);
    const pct = total ? Math.round((answered / total) * 100) : 0;
    els.progressBar.style.width = `${pct}%`;
  }

  function computeScores() {
    const orgType = state.answers["q-org-type"] || "";
    const isPublicPractice = orgType === "public_practice";
    const isAPRA = orgType === "apra_regulated";
    const isAFSorAPRA = orgType === "afs_licensee" || isAPRA;
    const frameworks = Array.isArray(state.answers["q-frameworks-adopted"])
      ? state.answers["q-frameworks-adopted"].filter((item) => item !== "none")
      : [];
    const frameworksScore = Math.min(frameworks.length, 3);

    const scoreMap = {
      governance: [
        numericAnswer("q-accountable-official"),
        numericAnswer("q-board-reporting"),
        numericAnswer("q-ai-committee")
      ],
      policy: [
        numericAnswer("q-ai-policy"),
        numericAnswer("q-ai-register"),
        frameworksScore,
        ...(isPublicPractice ? [numericAnswer("q-apes320")] : [])
      ],
      risk: [
        numericAnswer("q-risk-assessment"),
        numericAnswer("q-vendor-management"),
        numericAnswer("q-ai-monitoring"),
        ...(isAFSorAPRA ? [numericAnswer("q-austrac")] : []),
        ...(isAPRA ? [numericAnswer("q-cps230ops")] : [])
      ],
      privacy: [
        numericAnswer("q-data-in-ai"),
        numericAnswer("q-privacy-policy"),
        numericAnswer("q-pia")
      ],
      transparency: [
        numericAnswer("q-explainability"),
        numericAnswer("q-human-oversight"),
        numericAnswer("q-client-disclosure")
      ],
      capability: [
        numericAnswer("q-training"),
        numericAnswer("q-bias-testing"),
        numericAnswer("q-speak-up")
      ]
    };

    let totalScore = 0;
    let totalMax = 0;
    const scores = {};

    Object.entries(scoreMap).forEach(([domain, values]) => {
      const score = values.reduce((sum, value) => sum + value, 0);
      const max = values.length * 3;
      scores[domain] = { score, max, pct: Math.round((score / max) * 100) };
      totalScore += score;
      totalMax += max;
    });

    scores.total = { score: totalScore, max: totalMax, pct: Math.round((totalScore / totalMax) * 100) };
    return scores;
  }

  function numericAnswer(id) {
    return Number.parseInt(state.answers[id] || "0", 10);
  }

  function getMaturityTier(pct) {
    if (pct < 25) return { label: "Level 1 - Initial", level: 1, color: "var(--red)", tone: "red" };
    if (pct < 50) return { label: "Level 2 - Developing", level: 2, color: "var(--amber)", tone: "amber" };
    if (pct < 70) return { label: "Level 3 - Defined", level: 3, color: "var(--accent-2)", tone: "blue" };
    if (pct < 85) return { label: "Level 4 - Managed", level: 4, color: "var(--green)", tone: "green" };
    return { label: "Level 5 - Optimising", level: 5, color: "var(--accent)", tone: "accent" };
  }

  function generateReport() {
    if (!validateCurrentSection()) return;
    const scores = computeScores();
    const maturity = getMaturityTier(scores.total.pct);
    const report = buildReport(scores, maturity);
    state.latestReport = { scores, maturity, report, answers: structuredCloneFallback(state.answers) };
    saveDraft(false);
    renderResults(scores, maturity, report);
    els.assessmentView.hidden = true;
    els.resultsView.hidden = false;
    renderStepState();
    setRoute("assessment-report", false);
    jumpToCurrentView({ focus: true });
  }

  function buildReport(scores, maturity) {
    const orgType = state.answers["q-org-type"];
    const weakestDomains = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => a[1].pct - b[1].pct)
      .slice(0, 3)
      .map(([key]) => key);

    return {
      primaryFramework: primaryFrameworkFor(orgType, scores, maturity),
      complementaryFrameworks: complementaryFrameworksFor(orgType),
      boardSummary: boardSummaryFor(orgType, scores, maturity, weakestDomains),
      metricNarratives: metricNarrativesFor(orgType, scores, maturity),
      holisticSummary: holisticSummaryFor(orgType, scores, maturity, weakestDomains),
      frameworkAnalysis: frameworkAnalysisFor(orgType, scores),
      priorityGaps: priorityGapsFor(orgType, scores),
      principles: principlesFor(weakestDomains, orgType),
      roadmap: roadmapFor(orgType, weakestDomains),
      strategicWatch: strategicWatchFor(orgType, scores)
    };
  }

  function holisticSummaryFor(orgType, scores, maturity, weakestDomains) {
    const strongestDomain = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => b[1].pct - a[1].pct)[0];
    const weakestDomain = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => a[1].pct - b[1].pct)[0];
    const adoptedFrameworks = selectedFrameworks();
    const adoptedText = adoptedFrameworks.length
      ? `You have formally adopted ${adoptedFrameworks.map((key) => FRAMEWORK_LABELS[key]).join(", ")}.`
      : "No formal AI framework adoption was selected.";
    const orgLens = orgType === "apra_regulated"
      ? "The report therefore weights operational resilience, critical operations mapping, material service provider oversight, and board accountability heavily."
      : orgType === "afs_licensee"
        ? "The report therefore weights ASIC-style consumer harm, explainability, disclosure, vendor oversight, and AML/CTF transparency heavily."
        : orgType === "public_practice"
          ? "The report therefore weights professional standards, confidentiality, engagement quality, supervision, and human review heavily."
          : "The report therefore weights finance operating model controls, data governance, board visibility, and practical management-system adoption heavily.";

    return `Overall maturity is ${maturity.label} at ${scores.total.pct}%. ${adoptedText} Your strongest domain is ${DOMAIN_LABELS[strongestDomain[0]]} at ${strongestDomain[1].pct}%, while the most urgent weakness is ${DOMAIN_LABELS[weakestDomain[0]]} at ${weakestDomain[1].pct}%. ${orgLens} The priority is to close ${weakestDomains.map((domain) => DOMAIN_LABELS[domain]).join(", ")} gaps before scaling AI into higher-impact finance, client, or customer decisions.`;
  }

  function boardSummaryFor(orgType, scores, maturity, weakestDomains) {
    const orgLabel = ORG_LABELS[orgType] || "Organisation";
    const topGap = weakestDomains[0];
    const nextFramework = primaryFrameworkFor(orgType, scores, maturity);
    const adopted = selectedFrameworks();
    const adoptionPhrase = adopted.length
      ? `The organisation has selected ${adopted.length} formal framework${adopted.length === 1 ? "" : "s"}, which gives management a starting architecture to build on.`
      : "The organisation has not yet selected a formal AI governance framework, which limits board confidence in consistency and assurance.";
    return [
      {
        title: "Executive posture",
        text: `${orgLabel} is currently assessed at ${maturity.label} (${scores.total.pct}%). The score reflects how consistently governance controls appear to be documented, owned, monitored, and connected to Australian regulatory expectations.`
      },
      {
        title: "Board attention",
        text: `The first board-level focus should be ${DOMAIN_LABELS[topGap]}. This is the area most likely to affect confidence in management's ability to scale AI safely, evidence oversight, and respond to regulator or client scrutiny.`
      },
      {
        title: "Framework direction",
        text: `${nextFramework.name} is the recommended anchor for the next governance cycle. ${adoptionPhrase}`
      },
      {
        title: "Decision required",
        text: "The board should ask management to nominate an accountable executive, agree the risk appetite for AI-enabled decisions, and return with a 90-day control uplift plan that includes ownership, milestones, and evidence."
      }
    ];
  }

  function metricNarrativesFor(orgType, scores, maturity) {
    const weakest = domainRankings(scores, "asc")[0];
    const strongest = domainRankings(scores, "desc")[0];
    return {
      overall: `The overall score reflects the maturity of controls across accountability, policy, risk, privacy, transparency, and capability. At ${scores.total.pct}%, the organisation is assessed as ${maturity.label.toLowerCase()}, meaning the executive team should treat AI governance as ${scores.total.pct >= 70 ? "an operating discipline to sustain and assure, not just a policy set." : "an active uplift program before AI is scaled into higher-impact workflows."}`,
      lowest: `${DOMAIN_LABELS[weakest[0]]} is the lowest domain because the selected responses show the least evidence of repeatable, documented controls in this area. For a ${ORG_LABELS[orgType] || "finance-led organisation"}, this is the control area most likely to weaken board confidence, assurance readiness, or regulator-facing evidence.`,
      strongest: `${DOMAIN_LABELS[strongest[0]]} is the strongest domain because the selected responses show comparatively better ownership, process maturity, or operating discipline. This strength should be protected as AI adoption grows, because it can become the foundation for improving weaker domains.`
    };
  }

  function domainRankings(scores, direction) {
    return Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => direction === "asc" ? a[1].pct - b[1].pct : b[1].pct - a[1].pct);
  }

  function frameworkAnalysisFor(orgType, scores) {
    return REFERENCED_FRAMEWORKS.map((framework) => {
      const applies = !framework.appliesTo || framework.appliesTo.includes(orgType);
      const adopted = framework.adoptedKey ? selectedFrameworks().includes(framework.adoptedKey) : false;
      const pct = frameworkAlignmentPct(framework.questions);
      const status = frameworkStatus(pct, applies, adopted);
      const finding = frameworkFinding(framework, pct, applies, adopted, scores);
      const relevance = frameworkRelevance(framework, orgType, adopted);
      return {
        name: framework.name,
        status,
        pct,
        relevance,
        persona: framework.persona,
        finding,
        action: framework.action,
        lens: framework.lens
      };
    }).sort((a, b) => b.relevance - a.relevance || a.pct - b.pct || a.name.localeCompare(b.name));
  }

  function frameworkRelevance(framework, orgType, adopted) {
    let score = 40;
    if (!framework.appliesTo) score += 18;
    if (framework.appliesTo && framework.appliesTo.includes(orgType)) score += 45;
    if (adopted) score += 20;
    if (orgType === "corporate_finance" && ["Voluntary AI Safety Standard (VAISS)", "ISO/IEC 42001:2023", "NIST AI RMF 1.0", "OAIC AI Guidance", "AICD Director's Guide to AI Governance"].includes(framework.name)) score += 18;
    if (orgType === "public_practice" && ["APES 110 Technology Amendments", "APES 320", "OAIC AI Guidance", "Voluntary AI Safety Standard (VAISS)"].includes(framework.name)) score += 18;
    if (orgType === "afs_licensee" && ["ASIC REP 798", "AUSTRAC AI Transparency Statement", "Privacy Act 1988 and APPs", "NIST AI RMF 1.0"].includes(framework.name)) score += 18;
    if (orgType === "apra_regulated" && ["APRA CPS 230", "APRA CPS 234", "ASIC REP 798", "AUSTRAC AI Transparency Statement"].includes(framework.name)) score += 18;
    return score;
  }

  function frameworkAlignmentPct(questionIds) {
    const visibleIds = new Set(SECTIONS.flatMap((section) => visibleQuestions(section.questions).map((question) => question.id)));
    const applicable = questionIds.filter((id) => visibleIds.has(id));
    if (!applicable.length) return 0;
    const score = applicable.reduce((sum, id) => sum + numericAnswer(id), 0);
    return Math.round((score / (applicable.length * 3)) * 100);
  }

  function frameworkStatus(pct, applies, adopted) {
    if (!applies) {
      if (pct >= 70) return "Good-practice reference";
      return "Contextual reference";
    }
    if (pct >= 75 && adopted) return "Adopted and operating";
    if (pct >= 75) return "Operationally aligned";
    if (pct >= 45 && adopted) return "Adopted but incomplete";
    if (pct >= 45) return "Partially aligned";
    return "Material gap";
  }

  function frameworkFinding(framework, pct, applies, adopted, scores) {
    const adoptionText = framework.adoptedKey
      ? adopted
        ? "The framework was selected as formally adopted"
        : "The framework was not selected as formally adopted"
      : "This framework is assessed from the related questionnaire controls";
    const relevanceText = applies
      ? "it is directly relevant to this organisation type"
      : "it is not the primary obligation for this organisation type, but remains useful as a benchmark";
    const alignmentText = pct >= 75
      ? "controls appear strong enough to evidence operating alignment"
      : pct >= 45
        ? "controls are present but not yet complete enough for confident assurance"
        : "responses indicate a substantive evidence gap";
    return `${adoptionText}; ${relevanceText}. With ${pct}% mapped control alignment, ${alignmentText}.`;
  }

  function selectedFrameworks() {
    return Array.isArray(state.answers["q-frameworks-adopted"])
      ? state.answers["q-frameworks-adopted"].filter((item) => item !== "none")
      : [];
  }

  function primaryFrameworkFor(orgType, scores, maturity) {
    if (orgType === "apra_regulated") {
      return {
        name: "APRA CPS 230 + ISO/IEC 42001",
        fullName: "APRA CPS 230 operational resilience aligned to ISO/IEC 42001:2023 AI management system",
        rationale: `Your ${maturity.label.toLowerCase()} result indicates that AI governance should be anchored in operational resilience, critical operations mapping, vendor oversight, and board reporting. CPS 230 gives the regulated control frame, while ISO/IEC 42001 supplies the management system discipline needed to make AI controls repeatable.`
      };
    }
    if (orgType === "afs_licensee") {
      return {
        name: "ASIC REP 798 + NIST AI RMF",
        fullName: "ASIC REP 798 governance expectations aligned to NIST AI RMF 1.0",
        rationale: `Your score points to the need for stronger documented governance across accountability, explainability, monitoring, and consumer disclosure. ASIC REP 798 is the most direct supervisory lens for AFS and credit licensees, while NIST AI RMF gives a practical operating model across GOVERN, MAP, MEASURE, and MANAGE.`
      };
    }
    if (orgType === "public_practice") {
      return {
        name: "APES 110 + APES 320 + VAISS",
        fullName: "APES 110 Technology Amendments and APES 320 quality management aligned to the Voluntary AI Safety Standard",
        rationale: `For a public practice firm, AI governance must be embedded into professional competence, confidentiality, supervision, and file quality controls. APES 110 and APES 320 set the professional obligations, while VAISS provides practical guardrails for risk assessment, human oversight, and transparency.`
      };
    }
    return {
      name: "VAISS + ISO/IEC 42001",
      fullName: "Voluntary AI Safety Standard aligned to ISO/IEC 42001:2023",
      rationale: `For a corporate finance function, the best starting point is a pragmatic Australian guardrail model that can scale into a formal management system. VAISS helps finance leaders move quickly on policy, accountability, and oversight, while ISO/IEC 42001 creates the repeatable governance architecture expected by boards and audit committees.`
    };
  }

  function complementaryFrameworksFor(orgType) {
    const base = [
      { name: "ISO/IEC 23894", role: "Use as the detailed risk taxonomy for bias, explainability, security, privacy, and lifecycle monitoring." },
      { name: "AICD Director's Guide", role: "Use the eight elements to frame board accountabilities, reporting, skills, and oversight cadence." }
    ];
    if (orgType === "apra_regulated") {
      return [
        { name: "APRA CPS 234", role: "Connect AI risk to information security, control testing, and incident response." },
        { name: "NIST AI RMF", role: "Translate AI risk management into GOVERN, MAP, MEASURE, and MANAGE routines." },
        ...base.slice(1)
      ];
    }
    if (orgType === "afs_licensee") {
      return [
        { name: "OAIC AI Guidance", role: "Strengthen privacy transparency, PIAs, and controls over personal information entered into AI tools." },
        { name: "VAISS", role: "Convert regulatory expectations into a practical 10-guardrail implementation checklist." },
        ...base.slice(1)
      ];
    }
    if (orgType === "public_practice") {
      return [
        { name: "OAIC AI Guidance", role: "Support confidentiality and client data controls when generative AI is used in engagements." },
        { name: "ISO/IEC 42001", role: "Provide a management-system backbone for AI policy, roles, monitoring, and continuous improvement." },
        ...base.slice(1)
      ];
    }
    return [
      { name: "NIST AI RMF", role: "Structure practical risk routines across finance use cases and third-party tooling." },
      { name: "OAIC AI Guidance", role: "Prepare privacy disclosures and controls for AI handling personal information." },
      ...base.slice(1)
    ];
  }

  function priorityGapsFor(orgType, scores) {
    const gaps = [];
    addGap(gaps, "q-accountable-official", 2, "No executive AI accountability is established; VAISS Guardrail 1 and the AICD Director's Guide expect named ownership for AI decision-making.");
    addGap(gaps, "q-board-reporting", 2, "Board AI reporting is not yet structured; ASIC REP 798 and APRA CPS 230 both treat board visibility as a core governance control.");
    addGap(gaps, "q-ai-policy", 2, "AI policy is not approved and embedded; documented rules are foundational evidence for ASIC REP 798, VAISS, and professional standards.");
    addGap(gaps, "q-ai-register", 2, "The AI inventory is incomplete; leaders cannot govern tools, data inputs, owners, or risk ratings without a current register.");
    if ((state.answers["q-frameworks-adopted"] || []).includes("none")) {
      gaps.push("No formal AI framework has been adopted; select a primary framework and map it to local obligations within the next governance cycle.");
    }
    addGap(gaps, "q-risk-assessment", 2, "AI risk assessments are incomplete; ISO/IEC 23894 and NIST AI RMF require structured identification, measurement, and treatment of AI-specific risks.");
    addGap(gaps, "q-vendor-management", 2, "Third-party AI due diligence is underdeveloped; ASIC REP 798 and APRA CPS 230 expect AI-specific vendor obligations and ongoing monitoring.");
    addGap(gaps, "q-ai-monitoring", 2, "AI failure monitoring is not mature; incident escalation and response controls should be defined before wider deployment.");
    addGap(gaps, "q-data-in-ai", 2, "Client or personal data entering AI tools is not fully controlled; OAIC guidance expects privacy-by-design controls before using commercial AI products.");
    addGap(gaps, "q-privacy-policy", 2, "Privacy disclosures do not fully address AI or automated decision-making; prepare for APP transparency obligations and customer expectations.");
    addGap(gaps, "q-pia", 2, "Privacy Impact Assessments are not consistently performed for AI; this creates a direct data governance and privacy risk.");
    addGap(gaps, "q-explainability", 2, "Explainability controls are weak; ASIC REP 798, OECD AI Principles, and AHRC guidance all highlight black-box AI as a material risk.");
    addGap(gaps, "q-human-oversight", 2, "Human review is not consistently mandatory; professional and client-facing decisions need documented review before action is taken.");
    addGap(gaps, "q-client-disclosure", 2, "Client disclosure is incomplete; significant AI involvement should be transparent at the right point in the service or decision process.");
    addGap(gaps, "q-training", 2, "AI training is not yet role-specific; staff capability must cover ethical use, confidentiality, privacy, and critical review of AI outputs.");
    addGap(gaps, "q-bias-testing", 2, "Bias and fairness testing is insufficient; AHRC, OECD, VAISS, and ISO/IEC 23894 all treat discrimination risk as a core control area.");
    addGap(gaps, "q-speak-up", 2, "AI escalation and contestability channels are underdeveloped; staff need a documented path to raise ethical or output-quality concerns.");

    if (orgType === "public_practice") {
      addGap(gaps, "q-apes320", 2, "APES 320 quality management does not fully address AI in client engagements; update QMS procedures before scaling AI-assisted work.");
    }
    if (orgType === "afs_licensee" || orgType === "apra_regulated") {
      addGap(gaps, "q-austrac", 2, "AUSTRAC AI transparency expectations have not been fully assessed for AML/CTF processes; regulated entities should document this review.");
    }
    if (orgType === "apra_regulated") {
      addGap(gaps, "q-cps230ops", 2, "AI tools supporting critical operations are not fully mapped under CPS 230; this is an operational resilience exposure.");
    }

    const domainGap = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => a[1].pct - b[1].pct)[0];
    if (domainGap && domainGap[1].pct < 40) {
      gaps.unshift(`${DOMAIN_LABELS[domainGap[0]]} is below 40%; treat this as the first remediation workstream for the next 30 days.`);
    }
    return unique(gaps).slice(0, 7);
  }

  function addGap(gaps, answerId, minScore, text) {
    if (numericAnswer(answerId) < minScore) gaps.push(text);
  }

  function principlesFor(domains, orgType) {
    const templates = {
      governance: {
        title: "Accountability before automation",
        description: "No AI use case should scale without a named owner, board-visible risk rating, and clear decision rights. Finance leaders should treat AI accountability as part of the operating model, not as an IT-only responsibility."
      },
      policy: {
        title: "Register before you deploy",
        description: "Every AI tool should be logged with purpose, data inputs, owner, risk rating, and approved use boundaries. The register becomes the control surface for policy, assurance, and board reporting."
      },
      risk: {
        title: "Risk assess the workflow",
        description: "Assess the end-to-end business process, not just the AI tool. Include vendor obligations, data lineage, failure modes, override paths, and continuity expectations."
      },
      privacy: {
        title: "Protect data at entry",
        description: "Confidential, personal, and client data controls must be designed before prompts and integrations are released. Technical controls should reinforce staff guidance wherever sensitive information may enter AI systems."
      },
      transparency: {
        title: "Human judgment stays visible",
        description: "AI can assist analysis, drafting, and decision support, but professional judgment must remain accountable and reviewable. High-stakes and client-facing outputs need explainability and documented human review."
      },
      capability: {
        title: "Capability is a control",
        description: "Training, bias awareness, and speak-up channels are governance controls, not change-management extras. Staff need the confidence to challenge AI outputs and escalate ethical concerns."
      }
    };

    const selected = domains.map((domain) => templates[domain]);
    if (orgType === "public_practice") {
      selected[0] = {
        title: "Professional standards lead",
        description: "AI use in client engagements must be subordinated to APES 110 duties, confidentiality, supervision, and file quality requirements. Treat AI as an engagement risk that belongs in quality management."
      };
    }
    return selected.slice(0, 3);
  }

  function roadmapFor(orgType, weakestDomains) {
    const day30 = {
      horizon: "30 days",
      action: "Appoint an executive AI accountability owner, confirm board reporting expectations, and launch a rapid AI inventory covering tools, owners, data inputs, and use-case risk.",
      owner: "CEO / CFO"
    };
    const day60 = {
      horizon: "60 days",
      action: "Approve an AI policy mapped to VAISS, define human review and disclosure rules, and begin PIAs for tools handling personal or client data.",
      owner: "Legal & Compliance"
    };
    const day90 = {
      horizon: "90 days",
      action: "Run structured AI risk assessments using NIST AI RMF and ISO/IEC 23894, add vendor clauses, and deliver role-specific staff training.",
      owner: "CIO / Risk / HR"
    };

    if (orgType === "apra_regulated") {
      day60.action = "Map AI tools supporting critical operations under CPS 230, confirm material service provider dependencies, and update continuity testing scope.";
      day60.owner = "CRO / Operations";
    } else if (orgType === "afs_licensee") {
      day90.action = "Complete explainability, consumer disclosure, AML/CTF AI transparency, and vendor monitoring controls for regulated use cases.";
      day90.owner = "Compliance / Risk";
    } else if (orgType === "public_practice") {
      day60.action = "Update APES 320 quality management procedures so AI use in client engagements has supervision, review, confidentiality, and file evidence requirements.";
      day60.owner = "Managing Partner";
    }

    if (weakestDomains.includes("capability")) {
      day90.action = "Deliver mandatory AI capability training, including privacy, confidentiality, bias testing, prompt hygiene, escalation paths, and human review obligations.";
      day90.owner = "HR / Risk";
    }
    return [day30, day60, day90];
  }

  function strategicWatchFor(orgType, scores) {
    if (orgType === "apra_regulated" && numericAnswer("q-cps230ops") < 2) {
      return "Your critical blind spot is operational resilience: AI tools supporting critical operations are not fully mapped or continuity-tested under CPS 230. Treat this as a prudential control gap before expanding AI in core service delivery.";
    }
    if (scores.privacy.pct < 50 && numericAnswer("q-data-in-ai") < 2) {
      return "Your critical blind spot is uncontrolled sensitive data entering AI tools. This creates privacy, confidentiality, and trust exposure before the organisation has the inventory and technical controls needed to prove responsible use.";
    }
    if (scores.transparency.pct < 50) {
      return "Your critical blind spot is explainability and human oversight. If AI contributes to financial, client, or customer outcomes without reviewable reasoning and documented human judgment, accountability will be difficult to evidence.";
    }
    if (scores.risk.pct < 50) {
      return "Your critical blind spot is third-party and lifecycle risk. AI vendors, failures, and model drift need explicit controls before AI can safely become part of finance or customer-facing workflows.";
    }
    return "Your main watch item is sustaining governance as AI adoption grows. Move from documented controls to live assurance: board reporting, incident metrics, vendor monitoring, and periodic control testing.";
  }

  function renderResults(scores, maturity, report) {
    const orgLabel = ORG_LABELS[state.answers["q-org-type"]] || "Organisation";
    els.reportSubline.textContent = `${orgLabel} / ${VERSION_LABEL} / Generated ${new Date().toLocaleDateString("en-AU")}`;
    els.maturityLevel.textContent = maturity.label;
    els.maturityScore.textContent = `${scores.total.pct}%`;
    els.maturityBadge.style.borderTopColor = maturity.color;
    els.maturityScore.style.color = maturity.color;
    renderCalibration(scores, maturity);
    renderMetricStrip(scores, report.metricNarratives);
    renderBoardSummary(report.boardSummary);
    renderHolisticSummary(report.holisticSummary);
    renderScoreBars(scores);
    renderFrameworks(report);
    renderFrameworkAnalysis(report.frameworkAnalysis);
    renderGaps(report.priorityGaps);
    renderPrinciples(report.principles);
    renderRoadmap(report.roadmap);
    els.watchText.textContent = report.strategicWatch;
  }

  function renderCalibration(scores, maturity) {
    const selfAssessed = Number.parseInt(state.answers["q-self-maturity"] || "0", 10);
    const gap = selfAssessed - maturity.level;
    if (gap >= 2) {
      els.calibrationText.textContent = `Your self-assessed maturity of Level ${selfAssessed} is ${gap} levels above the computed score of ${scores.total.pct}% (${maturity.label}). Run a structured gap analysis before presenting AI governance maturity to the board or audit committee.`;
      els.calibrationCard.hidden = false;
    } else {
      els.calibrationCard.hidden = true;
    }
  }

  function renderMetricStrip(scores, narratives) {
    const weakest = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => a[1].pct - b[1].pct)[0];
    const strongest = Object.entries(scores)
      .filter(([key]) => key !== "total")
      .sort((a, b) => b[1].pct - a[1].pct)[0];
    const items = [
      ["Overall score", `${scores.total.pct}%`, narratives.overall],
      ["Lowest domain", `${DOMAIN_LABELS[weakest[0]]} (${weakest[1].pct}%)`, narratives.lowest],
      ["Strongest domain", `${DOMAIN_LABELS[strongest[0]]} (${strongest[1].pct}%)`, narratives.strongest]
    ];
    els.metricStrip.innerHTML = items.map(([label, value, note]) => `
      <article class="metric-card">
        <p class="micro-label">${escapeHtml(label)}</p>
        <strong>${escapeHtml(value)}</strong>
        <span>${escapeHtml(note)}</span>
      </article>
    `).join("");
  }

  function renderBoardSummary(summaryItems) {
    els.boardSummaryList.innerHTML = summaryItems.map((item, index) => `
      <article class="board-summary-card">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join("");
  }

  function renderScoreBars(scores) {
    els.scoreBars.innerHTML = Object.entries(scores)
      .filter(([domain]) => domain !== "total")
      .map(([domain, data]) => {
        const color = data.pct < 40 ? "var(--red)" : data.pct < 70 ? "var(--amber)" : "var(--green)";
        return `
          <div class="score-row">
            <div class="score-label">${escapeHtml(DOMAIN_LABELS[domain])}</div>
            <div class="score-track-wrap">
              <div class="score-track">
                <div class="score-fill" style="background:${color}; width:${data.pct}%"></div>
              </div>
              <div class="benchmark" title="70% managed threshold"></div>
            </div>
            <div class="score-value">${data.pct}%</div>
          </div>
        `;
      }).join("");
  }

  function renderHolisticSummary(summary) {
    els.holisticSummary.textContent = summary;
  }

  function renderFrameworks(report) {
    els.frameworkTitle.textContent = report.primaryFramework.fullName;
    els.frameworkRationale.textContent = report.primaryFramework.rationale;
    els.frameworkCards.innerHTML = report.complementaryFrameworks.map((item) => `
      <article class="framework-card">
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.role)}</p>
      </article>
    `).join("");
  }

  function renderFrameworkAnalysis(analysis) {
    els.frameworkAnalysisList.innerHTML = analysis.map((item) => `
      <article class="framework-analysis-card">
        <div class="framework-analysis-top">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.status)}</span>
        </div>
        <div class="mini-meter" aria-label="${escapeHtml(item.name)} alignment ${item.pct}%">
          <span style="width:${item.pct}%"></span>
        </div>
        <p class="analysis-lens">${escapeHtml(item.lens)}</p>
        <p class="persona-line"><b>Likely owner:</b> ${escapeHtml(item.persona)}</p>
        <p>${escapeHtml(item.finding)}</p>
        <p><b>Next action:</b> ${escapeHtml(item.action)}</p>
      </article>
    `).join("");
  }

  function renderGaps(gaps) {
    els.gapsList.innerHTML = gaps.map((gap, index) => `
      <article class="gap-item">
        <span class="gap-index">${index + 1}</span>
        <p>${escapeHtml(gap)}</p>
      </article>
    `).join("");
  }

  function renderPrinciples(principles) {
    els.principlesList.innerHTML = principles.map((principle) => `
      <article class="principle-card">
        <strong>${escapeHtml(principle.title)}</strong>
        <p>${escapeHtml(principle.description)}</p>
      </article>
    `).join("");
  }

  function renderRoadmap(roadmap) {
    els.roadmapList.innerHTML = roadmap.map((step) => `
      <article class="roadmap-card">
        <strong>${escapeHtml(step.horizon)}</strong>
        <p>${escapeHtml(step.action)}</p>
        <span class="owner-tag">${escapeHtml(step.owner)}</span>
      </article>
    `).join("");
  }

  function editAnswers() {
    showAssessmentSection(0, { save: false, focus: true });
  }

  async function copyBoardSummary() {
    if (!state.latestReport) return;
    const { scores, maturity, report } = state.latestReport;
    const summary = [
      "AI Governance Maturity Assessment - Board Summary",
      `Organisation type: ${ORG_LABELS[state.answers["q-org-type"]] || "Not specified"}`,
      `Overall maturity: ${maturity.label} (${scores.total.pct}%)`,
      `Primary framework: ${report.primaryFramework.fullName}`,
      "",
      "Board summary:",
      ...report.boardSummary.map((item, index) => `${index + 1}. ${item.title}: ${item.text}`),
      "",
      `Holistic assessment: ${report.holisticSummary}`,
      "",
      "Priority gaps:",
      ...report.priorityGaps.slice(0, 5).map((gap, index) => `${index + 1}. ${gap}`),
      "",
      "Framework watch list:",
      ...report.frameworkAnalysis
        .filter((item) => item.status === "Material gap" || item.status === "Adopted but incomplete")
        .slice(0, 5)
        .map((item, index) => `${index + 1}. ${item.name}: ${item.status} (${item.pct}%) - likely owner: ${item.persona}`),
      "",
      `Strategic watch: ${report.strategicWatch}`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      showToast("Board summary copied.");
    } catch (error) {
      showToast("Copy failed. Use Export JSON or Print instead.");
    }
  }

  function exportJson() {
    if (!state.latestReport) return;
    const payload = {
      generatedAt: new Date().toISOString(),
      version: VERSION_LABEL,
      organisationType: ORG_LABELS[state.answers["q-org-type"]] || state.answers["q-org-type"],
      answers: state.latestReport.answers,
      scores: state.latestReport.scores,
      maturity: state.latestReport.maturity,
      report: state.latestReport.report
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-governance-assessment-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    showToast("JSON report exported.");
  }

  function saveDraft(showMessage) {
    const payload = {
      currentSection: state.currentSection,
      answers: state.answers,
      latestReport: state.latestReport
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (showMessage) showToast("Draft saved on this device.");
    } catch (error) {
      if (showMessage) showToast("Draft could not be saved in this browser profile.");
    }
  }

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const payload = JSON.parse(raw);
      state.currentSection = Number.isInteger(payload.currentSection) ? payload.currentSection : 0;
      state.answers = payload.answers || {};
      state.latestReport = payload.latestReport || null;
    } catch (error) {
      state.currentSection = 0;
      state.answers = {};
      state.latestReport = null;
    }
  }

  function resetAssessment() {
    const confirmed = window.confirm("Start over and clear all saved answers from this device?");
    if (!confirmed) return;
    state.currentSection = 0;
    state.answers = {};
    state.latestReport = null;
    localStorage.removeItem(STORAGE_KEY);
    showAssessmentSection(0, { replaceRoute: true, save: false, focus: true });
    showToast("Assessment reset.");
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.hidden = false;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      els.toast.hidden = true;
    }, 2600);
  }

  function setRoute(hash, replaceRoute) {
    const nextHash = `#${hash}`;
    if (window.location.hash === nextHash) return;
    if (replaceRoute) window.history.replaceState(null, "", nextHash);
    else window.history.pushState(null, "", nextHash);
  }

  function jumpToCurrentView(options = {}) {
    const { focus = false } = options;
    const target = els.resultsView.hidden ? els.assessmentView : els.resultsView;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start", behavior: "auto" });
      if (focus) {
        const focusTarget = els.resultsView.hidden ? els.sectionTitle : target.querySelector("h2");
        if (focusTarget) {
          focusTarget.setAttribute("tabindex", "-1");
          focusTarget.focus({ preventScroll: true });
        }
      }
    });
  }

  function unique(items) {
    return Array.from(new Set(items));
  }

  function structuredCloneFallback(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
