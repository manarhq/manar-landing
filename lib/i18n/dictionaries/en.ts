const en = {
  meta: {
    homeTitle: "Manar — AI governance and runtime oversight",
    homeDescription:
      "Manar brings AI systems, owners, risks, policies, approvals, and evidence into one workspace, with configured controls for connected AI actions.",
    demoTitle: "Book a demo — Manar",
    demoDescription:
      "Request a Manar demo. Tell us about the AI systems you need to govern and we will arrange a session around your workflow and deployment needs.",
    siteName: "Manar",
  },

  common: {
    skipToContent: "Skip to content",
    brandName: "Manar",
    homeLink: "Manar home",
    endorsement: "A VAX product",
    endorsementLink: "VAX website (opens in a new tab)",
    bookDemo: "Book a demo",
    primaryNav: "Primary",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    languageSwitch: "العربية",
    languageSwitchLabel: "عرض هذه الصفحة باللغة العربية",
    themeToDark: "Switch to dark theme",
    themeToLight: "Switch to light theme",
    illustrative: "Illustrative workspace",
    illustrativeExample: "Illustrative example",
  },

  nav: {
    platform: "Platform",
    howItWorks: "How it works",
    deployment: "Deployment",
    faq: "FAQ",
  },

  hero: {
    eyebrow: "AI governance and runtime oversight",
    title: "Clarity for every AI decision.",
    body: "Bring AI systems, risks, policies, approvals, and evidence into one workspace. Give your teams a clear view of what needs attention and control over connected AI actions.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the workspace",
    card: {
      label: "Connected action",
      requestId: "ACT-2291",
      system: "Procurement agent",
      requests: "requests",
      action: "Change supplier bank details",
      target: "Supplier record",
      targetId: "SUP-0417",
      policyLabel: "Policy applied",
      policy: "Supplier payment changes require finance approval",
      policyId: "POL-PAY-03",
      decisionLabel: "Decision",
      decision: "Approval required",
      approverLabel: "Approver",
      approver: "Finance controller",
      recordLabel: "Record",
      record: "Request, policy, and decision recorded",
      options: {
        allow: "Allow",
        approval: "Approval",
        block: "Block",
      },
    },
  },

  problem: {
    eyebrow: "The operational problem",
    title: "AI adoption moves faster than the structures around it.",
    body: "Teams add assistants, agents, and model-backed services every quarter. Accountability has to keep pace. Three needs come up in every serious AI programme.",
    items: [
      {
        title: "Know what is registered",
        body: "Know which registered AI systems exist, who owns them, and where each one stands in review.",
      },
      {
        title: "Put rules on consequential actions",
        body: "Give sensitive connected actions explicit policies and an accountable approver before they proceed.",
      },
      {
        title: "Keep the record within reach",
        body: "Keep decisions and supporting evidence accessible when reviewers, auditors, or leadership ask.",
      },
    ],
  },

  workspace: {
    eyebrow: "The workspace",
    title: "One place to see what needs attention.",
    body: "Follow one example through the workspace: a procurement agent asks to change a supplier's bank details.",
    label: "Illustrative workspace",
    note: "Sample names, counts, and events. Not connected to a live environment.",
    tabsLabel: "Workspace views",
    tabs: {
      overview: "Overview",
      inventory: "AI inventory",
      approvals: "Approvals",
      evidence: "Evidence",
    },
    breadcrumb: "Sample organization",
    risk: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    lifecycle: {
      active: "Active",
      review: "Under review",
      draft: "Draft",
    },
    control: {
      routed: "Actions routed through Manar",
      registered: "Registered, not connected",
    },
    overview: {
      stats: [
        { label: "Registered AI systems", value: "4" },
        { label: "Awaiting approval", value: "1" },
        { label: "Reviews due this month", value: "2" },
        { label: "Flagged events", value: "1" },
      ],
      attentionTitle: "Needs attention",
      attention: [
        {
          kind: "approval",
          tag: "Approval required",
          title: "Supplier bank-detail change",
          meta: "Procurement agent · Finance controller",
        },
        {
          kind: "review",
          tag: "Review due",
          title: "Risk review for internal knowledge search",
          meta: "IT Operations · due in 6 days",
        },
        {
          kind: "flag",
          tag: "Flagged",
          title: "Blocked request to export customer records",
          meta: "Support assistant · policy POL-DATA-01",
        },
      ],
      decisionsTitle: "Recent decisions",
      decisions: [
        { outcome: "allow", label: "Allowed", action: "Read purchase order", system: "Procurement agent" },
        { outcome: "approval", label: "Approval required", action: "Change supplier bank details", system: "Procurement agent" },
        { outcome: "block", label: "Blocked", action: "Export customer records", system: "Support assistant" },
      ],
    },
    inventory: {
      columns: {
        system: "AI system",
        owner: "Owner",
        risk: "Risk",
        status: "Status",
      },
      selectHint: "Select a system to see its details.",
      detailTitle: "System details",
      purposeLabel: "Purpose",
      ownerLabel: "Accountable owner",
      reviewLabel: "Next review",
      controlLabel: "Connection",
      policiesLabel: "Policies",
      systems: [
        {
          id: "procurement",
          name: "Procurement agent",
          owner: "Procurement Operations",
          risk: "high",
          lifecycle: "active",
          control: "routed",
          purpose: "Prepares purchase orders and updates supplier records.",
          review: "In 3 weeks",
          policies: "3 policies",
        },
        {
          id: "support",
          name: "Support assistant",
          owner: "Customer Service",
          risk: "medium",
          lifecycle: "active",
          control: "routed",
          purpose: "Drafts replies to customer enquiries from the case history.",
          review: "In 2 months",
          policies: "2 policies",
        },
        {
          id: "knowledge",
          name: "Internal knowledge search",
          owner: "IT Operations",
          risk: "low",
          lifecycle: "review",
          control: "registered",
          purpose: "Answers staff questions from approved policy documents.",
          review: "In 6 days",
          policies: "1 policy",
        },
        {
          id: "contracts",
          name: "Contract summariser",
          owner: "Legal",
          risk: "medium",
          lifecycle: "draft",
          control: "registered",
          purpose: "Summarises supplier contracts for legal review.",
          review: "Before activation",
          policies: "Not yet assigned",
        },
      ],
    },
    approvals: {
      queueTitle: "Approval queue",
      status: "Awaiting decision",
      requestTitle: "Change supplier bank details",
      fields: {
        system: "Requested by",
        task: "Task",
        target: "Target",
        policy: "Policy",
        approver: "Approver",
        risk: "System risk",
      },
      values: {
        system: "Procurement agent",
        task: "Invoice reconciliation",
        target: "Supplier record SUP-0417",
        policy: "Supplier payment changes require finance approval",
        approver: "Finance controller",
      },
      changeTitle: "Requested change",
      changeField: "Bank account (IBAN)",
      changeFrom: "Current",
      changeTo: "Requested",
      traceShow: "Show policy evaluation",
      traceHide: "Hide policy evaluation",
      traceTitle: "How the decision was reached",
      trace: [
        { check: "Action type is a supplier payment change", result: "Matched" },
        { check: "Requester is an AI system", result: "Matched" },
        { check: "Rule outcome", result: "Approval by Finance" },
      ],
      traceNote: "In the product, the approver sees this request and its evaluation before deciding.",
    },
    evidence: {
      recordTitle: "Decision record",
      recordId: "DEC-8830",
      timelineLabel: "Record timeline",
      events: [
        { time: "10:02", title: "Request received", body: "Procurement agent requested a supplier bank-detail change." },
        { time: "10:02", title: "Policy evaluated", body: "POL-PAY-03 applied. Outcome: approval required." },
        { time: "10:03", title: "Approval requested", body: "Assigned to the finance controller." },
        { time: "10:41", title: "Approved", body: "Finance controller approved with the note: supplier change confirmed by phone." },
        { time: "10:41", title: "Outcome recorded", body: "The change completed through the configured connection." },
      ],
      showDetails: "View record details",
      hideDetails: "Hide record details",
      detailsTitle: "Record details",
      details: [
        { label: "Record", value: "DEC-8830", mono: true },
        { label: "Policy version", value: "POL-PAY-03 · v7", mono: true },
        { label: "Requested by", value: "Procurement agent", mono: false },
        { label: "Approved by", value: "Finance controller", mono: false },
        { label: "Outcome", value: "Completed", mono: false },
      ],
    },
  },

  how: {
    eyebrow: "How connected controls work",
    title: "Every connected action meets a policy before it proceeds.",
    body: "When an AI system is connected through Manar, its consequential actions follow the same path every time.",
    steps: [
      {
        title: "Connected action request",
        body: "An AI system asks to perform an action through a connection that Manar controls.",
      },
      {
        title: "Configured policy evaluation",
        body: "Manar checks the request against the policies your team configured for that system and action.",
      },
      {
        title: "Allow, request approval, or block",
        body: "The action proceeds, waits for an accountable approver, or is stopped.",
      },
      {
        title: "Decision record",
        body: "The request, the policy applied, any approval, and the outcome are kept for review.",
      },
    ],
    outcomes: {
      allow: "Allow",
      approval: "Request approval",
      block: "Block",
    },
    boundaryTitle: "Where enforcement applies",
    boundary:
      "Runtime enforcement applies to connected actions routed through Manar's configured controls. Actions that bypass those controls are outside that enforcement path.",
    boundaryDetail:
      "The inventory shows how each registered system is connected, so it is clear which systems act through Manar and which are only registered.",
  },

  capabilities: {
    eyebrow: "Platform",
    title: "Governance work and runtime controls in one workspace.",
    body: "Six capabilities, organised around what each team needs to answer.",
    groups: [
      {
        name: "Visibility",
        question: "What is in use, and what is it doing?",
        items: [
          {
            icon: "inventory",
            title: "AI inventory",
            body: "See registered systems, owners, purpose, and lifecycle status.",
          },
          {
            icon: "oversight",
            title: "Runtime oversight",
            body: "Review connected activity and flagged events in context.",
          },
        ],
      },
      {
        name: "Control",
        question: "What is allowed, and who decides?",
        items: [
          {
            icon: "policy",
            title: "Policies and controls",
            body: "Define requirements and apply configured controls to connected actions.",
          },
          {
            icon: "approval",
            title: "Approvals",
            body: "Bring accountable human review into consequential decisions.",
          },
        ],
      },
      {
        name: "Accountability",
        question: "Can we show how decisions were made?",
        items: [
          {
            icon: "risk",
            title: "Risk management",
            body: "Organise assessments, review dates, and mitigation responsibilities.",
          },
          {
            icon: "evidence",
            title: "Evidence and audit",
            body: "Keep policy decisions, reviews, and approvals traceable.",
          },
        ],
      },
    ],
    audienceTitle: "For the people accountable for AI",
    audiences: [
      {
        role: "CISOs",
        title: "Security oversight",
        body: "See which AI systems can take consequential actions and which of those actions pass through policy, approval, or a block.",
      },
      {
        role: "CIOs",
        title: "Operational visibility",
        body: "Know what is registered, who owns it, and where it stands, without slowing the teams that build and run it.",
      },
      {
        role: "Governance and risk managers",
        title: "Structured reviews and evidence",
        body: "Run assessments on a schedule with named owners, and find the decision record when a review asks for it.",
      },
    ],
  },

  deployment: {
    eyebrow: "Deployment",
    title: "Deployment shaped around your requirements.",
    body: "Discuss the deployment and operating model that fits your requirements. Where Manar runs, how it is isolated, and who operates it are separate decisions, worked through with your security and infrastructure teams.",
    dimensions: [
      {
        title: "Location",
        question: "Where does it run?",
        body: "Customer cloud, on-premises, and hosted arrangements are all part of the conversation.",
        options: ["Your cloud environment", "On-premises", "Hosted"],
      },
      {
        title: "Isolation",
        question: "What is it shared with?",
        body: "Dedicated isolation describes separation from other tenants. It is not a location, and it can apply wherever Manar runs.",
        options: ["Dedicated environment where appropriate"],
      },
      {
        title: "Operation",
        question: "Who runs it day to day?",
        body: "Operational responsibility is agreed explicitly, with clear boundaries between your team and VAX.",
        options: ["Your team", "VAX", "Shared, with defined boundaries"],
      },
    ],
    footnote:
      "Data residency, network constraints, and support arrangements are confirmed during scoping for your environment.",
    cta: "Discuss your deployment",
  },

  name: {
    eyebrow: "The name",
    word: "منار",
    transliteration: "Manar",
    meaning: "Arabic for lighthouse, a beacon",
    title: "Direction when the environment is complex.",
    body: "A lighthouse does not sail the ship. It marks the hazards and shows a clear way through. Manar applies that idea to AI: visibility into what is in use, accountable decisions on what matters, and practical controls where they are configured.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions we are asked most.",
    items: [
      {
        question: "What does Manar govern?",
        answer:
          "Manar governs the AI systems your organization registers in it, such as agents, assistants, and model-backed services. For each system it holds the owner, purpose, lifecycle status, risk assessments, and applicable policies. For systems connected through Manar's controls, it also evaluates the actions they request at runtime and records the outcome.",
      },
      {
        question: "How does Manar connect to our existing systems?",
        answer:
          "A connected AI system sends consequential actions through Manar instead of calling the target system directly. Manar applies policy, requests approval where required, and then carries out allowed actions through a connection your team configures. Which systems and actions to connect is agreed during scoping. We cover connection options for your environment in the demo rather than listing integrations here.",
      },
      {
        question: "Does Manar control every AI action in our organization?",
        answer:
          "No. Runtime enforcement applies to connected actions routed through Manar's configured controls. An action that bypasses those controls, for example a tool called directly with its own credentials, is outside that enforcement path. The inventory makes the difference visible, so you can decide which systems must be connected.",
      },
      {
        question: "Where can Manar be deployed?",
        answer:
          "We discuss customer cloud, on-premises, and hosted arrangements, with dedicated isolation where appropriate. Location, isolation, and operational responsibility are separate decisions, and we confirm what fits your requirements, including residency and network constraints, during scoping.",
      },
      {
        question: "What happens in a demo, and how is pricing handled?",
        answer:
          "We start with your context: the AI systems in use or planned, the actions that concern you, and how reviews work today. We then walk through the workspace with an illustrative scenario and discuss deployment and next steps. Pricing is scoped with you rather than published, because it depends on deployment and scope.",
      },
    ],
  },

  closing: {
    title: "See how Manar would fit your AI programme.",
    body: "Tell us which AI systems you need to govern. We will arrange a session around your workflow and deployment needs.",
    cta: "Book a demo",
  },

  footer: {
    tagline: "AI governance and runtime oversight for organizations putting AI to work.",
    sectionsTitle: "Explore",
    contactTitle: "Contact",
    demoLink: "Request a demo",
    rights: "All rights reserved.",
  },

  demo: {
    eyebrow: "Book a demo",
    title: "Let's talk about the AI you need to govern.",
    body: "Share a few details and our team will contact you to arrange a session.",
    expectTitle: "What to expect",
    expect: [
      {
        title: "Your context first",
        body: "Your AI systems, the actions that concern you, and how reviews work today.",
      },
      {
        title: "A focused walkthrough",
        body: "The workspace, shown with an illustrative scenario close to your use case.",
      },
      {
        title: "Deployment and next steps",
        body: "Location, isolation, operating model, and how a scoped engagement would work.",
      },
    ],
    altContact: "Prefer email? Write to",
    back: "Back to home",
    form: {
      title: "Request a demo",
      requiredHint: "Fields marked with an asterisk are required.",
      requiredMark: "required",
      optional: "Optional",
      fields: {
        name: { label: "Full name", placeholder: "Your full name" },
        email: { label: "Work email", placeholder: "name@organization.com" },
        organization: { label: "Organization", placeholder: "Your organization" },
        role: { label: "Role or function", placeholder: "For example, CISO" },
        deployment: {
          label: "Deployment interest",
          placeholder: "Select an option",
          options: {
            cloud: "Our cloud environment",
            "on-premises": "On-premises",
            hosted: "Hosted",
            unsure: "Not sure yet",
          },
        },
        message: {
          label: "What would you like to govern?",
          placeholder: "For example, an AI agent that updates supplier records",
        },
      },
      honeypot: "Leave this field empty",
      notice: "We use these details only to respond to your demo request.",
      submit: "Request a demo",
      submitting: "Sending request…",
      errors: {
        required: "This field is required.",
        email: "Enter a valid email address, such as name@organization.com.",
        tooLong: "Shorten this to {max} characters or fewer.",
        lineBreak: "Remove line breaks from this field.",
        option: "Choose one of the listed options.",
        summary: "Some fields need attention. Check the messages below each field.",
      },
      success: {
        title: "Request received",
        body: "Thank you, {name}. Our team will contact you at {email} to arrange a session.",
        back: "Back to home",
      },
      failure: {
        title: "We couldn't send your request",
        body: "Your details are still in the form. Try again in a moment, or email us directly at",
        retry: "Try again",
      },
      rateLimited: {
        title: "Too many attempts",
        body: "Please wait a few minutes before trying again, or email us directly at",
      },
    },
  },
}

export type Dictionary = typeof en

export default en
