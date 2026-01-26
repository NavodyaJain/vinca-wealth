// Role Model Templates for Retirement Journeys
// Each template is a realistic story for users to follow

const roleModelTemplates = [
  {
    id: "rolemodel_fire_1",
    name: "Amit",
    ageWhenStarted: 29,
    city: "Bengaluru",
    profession: "Software Engineer",
    family: "Married, 1 child",
    goal: {
      retireByAge: 45,
      lifestyle: "Comfortable",
      riskStyle: "Balanced"
    },
    heroLine: "I wanted to retire by 45 without risking family stability.",
    thumbnailImage: "/images/templates/rolemodel-1.jpg",
    matches: {
      retireByAgeRange: [40, 50],
      lifestyleTags: ["basic", "comfortable", "premium"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Foundation",
        duration: "Weeks 1–2",
        actions: [
          "Fixed monthly expense baseline",
          "Built emergency fund target",
          "Adjusted SIP to sustainable number"
        ],
        challengesFaced: [
          "Felt overwhelmed seeing big corpus numbers",
          "Had low surplus after EMI"
        ],
        howSolved: [
          "Used surplus-based SIP allocation",
          "Kept buffer for shocks"
        ]
      },
      {
        phaseTitle: "Phase 2 — SIP Acceleration",
        duration: "Months 1–6",
        actions: [
          "Step-up SIP yearly",
          "Optimized asset allocation conservatively",
          "Avoided chasing returns"
        ],
        challengesFaced: ["Market volatility fear"],
        howSolved: ["Stayed consistent through down months"]
      },
      {
        phaseTitle: "Phase 3 — Retirement Readiness Lock-in",
        duration: "Year 1 onward",
        actions: [
          "Ran worst-case survival simulation",
          "Added health stress buffer",
          "Reviewed plan quarterly"
        ],
        challengesFaced: ["Healthcare anxiety"],
        howSolved: ["Insurance + out-of-pocket planning"]
      }
    ],
    recommendedChallengePackId: "fire-reality-check-14"
  },
  {
    id: "rolemodel_family_2",
    name: "Priya",
    ageWhenStarted: 35,
    city: "Pune",
    profession: "HR Manager",
    family: "Married, 2 kids",
    goal: {
      retireByAge: 55,
      lifestyle: "Comfortable",
      riskStyle: "Conservative"
    },
    heroLine: "Family security was my top priority, not early retirement.",
    thumbnailImage: "/images/templates/rolemodel-2.jpg",
    matches: {
      retireByAgeRange: [50, 60],
      lifestyleTags: ["comfortable", "premium"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Family Budgeting",
        duration: "Month 1",
        actions: [
          "Mapped all family expenses",
          "Set up kids' education fund",
          "Reduced discretionary spending"
        ],
        challengesFaced: ["Kids' school fees pressure"],
        howSolved: ["Automated monthly savings for education"]
      },
      {
        phaseTitle: "Phase 2 — Steady Growth",
        duration: "Year 1",
        actions: [
          "Invested in balanced funds",
          "Reviewed insurance coverage",
          "Quarterly financial check-ins"
        ],
        challengesFaced: ["Unexpected medical bills"],
        howSolved: ["Used emergency fund, adjusted plan"]
      },
      {
        phaseTitle: "Phase 3 — Retirement Prep",
        duration: "Year 2 onward",
        actions: [
          "Started retirement corpus SIP",
          "Planned for post-retirement income",
          "Downsized home for savings"
        ],
        challengesFaced: ["Reluctance to downsize"],
        howSolved: ["Family discussions, gradual transition"]
      }
    ],
    recommendedChallengePackId: "family-retirement-21"
  },
  {
    id: "rolemodel_health_3",
    name: "Ravi",
    ageWhenStarted: 40,
    city: "Chennai",
    profession: "Doctor",
    family: "Single",
    goal: {
      retireByAge: 60,
      lifestyle: "Health-focused",
      riskStyle: "Balanced"
    },
    heroLine: "Health was my biggest asset, so I planned for medical security.",
    thumbnailImage: "/images/templates/rolemodel-3.jpg",
    matches: {
      retireByAgeRange: [55, 65],
      lifestyleTags: ["health", "comfortable"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Health First",
        duration: "Month 1",
        actions: [
          "Reviewed health insurance",
          "Set up medical emergency fund",
          "Planned for regular health checkups"
        ],
        challengesFaced: ["High insurance premiums"],
        howSolved: ["Compared plans, chose optimal"]
      },
      {
        phaseTitle: "Phase 2 — Asset Safety",
        duration: "Year 1",
        actions: [
          "Invested in low-risk assets",
          "Avoided speculative investments",
          "Maintained healthy savings rate"
        ],
        challengesFaced: ["Temptation to chase returns"],
        howSolved: ["Stuck to plan, prioritized safety"]
      },
      {
        phaseTitle: "Phase 3 — Retirement Health Lock",
        duration: "Year 2 onward",
        actions: [
          "Annual health review",
          "Adjusted plan for medical inflation",
          "Kept emergency buffer"
        ],
        challengesFaced: ["Medical inflation"],
        howSolved: ["Increased buffer yearly"]
      }
    ],
    recommendedChallengePackId: "health-retirement-30"
  },
  {
    id: "rolemodel_premium_4",
    name: "Sana",
    ageWhenStarted: 32,
    city: "Mumbai",
    profession: "Entrepreneur",
    family: "Single",
    goal: {
      retireByAge: 50,
      lifestyle: "Premium",
      riskStyle: "Aggressive"
    },
    heroLine: "I wanted a premium lifestyle, not just a safe retirement.",
    thumbnailImage: "/images/templates/rolemodel-4.jpg",
    matches: {
      retireByAgeRange: [45, 55],
      lifestyleTags: ["premium", "comfortable"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Premium Planning",
        duration: "Month 1",
        actions: [
          "Defined premium lifestyle goals",
          "Set high SIP targets",
          "Allocated to growth assets"
        ],
        challengesFaced: ["High risk tolerance needed"],
        howSolved: ["Accepted volatility, focused on long term"]
      },
      {
        phaseTitle: "Phase 2 — Asset Growth",
        duration: "Year 1",
        actions: [
          "Monitored portfolio monthly",
          "Rebalanced for growth",
          "Avoided lifestyle inflation"
        ],
        challengesFaced: ["Temptation to overspend"],
        howSolved: ["Budgeted for fun, kept discipline"]
      },
      {
        phaseTitle: "Phase 3 — Lock-in",
        duration: "Year 2 onward",
        actions: [
          "Secured premium health cover",
          "Planned for travel and luxury",
          "Reviewed plan with advisor"
        ],
        challengesFaced: ["Luxury costs rising"],
        howSolved: ["Adjusted plan, prioritized experiences"]
      }
    ],
    recommendedChallengePackId: "premium-lifestyle-18"
  },
  {
    id: "rolemodel_conservative_5",
    name: "Manoj",
    ageWhenStarted: 38,
    city: "Hyderabad",
    profession: "Banker",
    family: "Married, no kids",
    goal: {
      retireByAge: 60,
      lifestyle: "Basic",
      riskStyle: "Conservative"
    },
    heroLine: "I wanted a safe, simple retirement with no surprises.",
    thumbnailImage: "/images/templates/rolemodel-5.jpg",
    matches: {
      retireByAgeRange: [55, 65],
      lifestyleTags: ["basic", "comfortable"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Safety Net",
        duration: "Month 1",
        actions: [
          "Built large emergency fund",
          "Invested in fixed deposits",
          "Avoided risky assets"
        ],
        challengesFaced: ["Low returns"],
        howSolved: ["Accepted trade-off for safety"]
      },
      {
        phaseTitle: "Phase 2 — Steady SIP",
        duration: "Year 1",
        actions: [
          "Maintained SIP in conservative funds",
          "Reviewed plan annually",
          "Kept expenses low"
        ],
        challengesFaced: ["Inflation risk"],
        howSolved: ["Adjusted SIP yearly"]
      },
      {
        phaseTitle: "Phase 3 — Retirement Lock",
        duration: "Year 2 onward",
        actions: [
          "Planned for pension income",
          "Kept health insurance updated",
          "Quarterly expense review"
        ],
        challengesFaced: ["Unexpected expenses"],
        howSolved: ["Emergency fund top-ups"]
      }
    ],
    recommendedChallengePackId: "conservative-retirement-25"
  },
  {
    id: "rolemodel_late_6",
    name: "Neha",
    ageWhenStarted: 45,
    city: "Delhi",
    profession: "Teacher",
    family: "Married, 1 child",
    goal: {
      retireByAge: 65,
      lifestyle: "Comfortable",
      riskStyle: "Balanced"
    },
    heroLine: "I started late, but caught up with discipline and planning.",
    thumbnailImage: "/images/templates/rolemodel-6.jpg",
    matches: {
      retireByAgeRange: [60, 70],
      lifestyleTags: ["comfortable", "basic"]
    },
    journeyTimeline: [
      {
        phaseTitle: "Phase 1 — Catch-up",
        duration: "Month 1",
        actions: [
          "Reviewed current assets",
          "Set aggressive SIP targets",
          "Cut unnecessary expenses"
        ],
        challengesFaced: ["Feeling behind peers"],
        howSolved: ["Focused on progress, not comparison"]
      },
      {
        phaseTitle: "Phase 2 — Discipline",
        duration: "Year 1",
        actions: [
          "Automated savings",
          "Monthly plan reviews",
          "Kept family involved"
        ],
        challengesFaced: ["Family resistance to changes"],
        howSolved: ["Open discussions, gradual changes"]
      },
      {
        phaseTitle: "Phase 3 — Lock-in",
        duration: "Year 2 onward",
        actions: [
          "Secured retirement home",
          "Planned for post-retirement activities",
          "Quarterly health checks"
        ],
        challengesFaced: ["Health concerns"],
        howSolved: ["Regular checkups, insurance"]
      }
    ],
    recommendedChallengePackId: "late-starter-catchup-22"
  }
];

export default roleModelTemplates;
