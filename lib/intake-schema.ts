// Single source of truth for the health history intake form.
// Both the multi-step form (app/portal/intake/page.tsx) and the Word
// document generator (lib/intake-docx.ts) read this schema, so the
// (very long) checkbox lists only need to be written once.

export type FieldType =
  | "text"
  | "textarea"
  | "yesno"
  | "yesnounsure"
  | "scale"
  | "checkboxes"
  | "select";

export interface IntakeField {
  key: string; // dot-path into the answers object, e.g. "personal.firstName"
  label: string;
  helper?: string;
  type: FieldType;
  options?: string[]; // for select / checkboxes
  scaleLabels?: [string, string]; // for scale, e.g. ["Terrible", "I sleep like a champion"]
  showIf?: { key: string; equals: string }; // simple conditional display
}

export interface IntakeStep {
  id: string;
  title: string;
  intro?: string;
  fields: IntakeField[];
}

const elaborate = (key: string, checklistKey: string): IntakeField[] => [
  {
    key: checklistKey,
    label: "Check anything that currently applies or has applied in the past",
    type: "checkboxes",
    options: [],
  },
  {
    key,
    label:
      "Please elaborate on anything checked above — when it started, frequency, duration, triggers/patterns and anything else useful.",
    type: "textarea",
  },
];

export const INTAKE_STEPS: IntakeStep[] = [
  {
    id: "personal",
    title: "Let's get to know you",
    fields: [
      { key: "personal.title", label: "Title", type: "text" },
      { key: "personal.name", label: "First & last name", type: "text" },
      { key: "personal.preferredName", label: "Preferred name", type: "text" },
      { key: "personal.age", label: "Age", type: "text" },
      { key: "personal.dob", label: "Date of birth", type: "text" },
      { key: "personal.address", label: "Address / region", type: "text" },
      { key: "personal.occupation", label: "Occupation", type: "text" },
      { key: "personal.email", label: "Email", type: "text" },
      { key: "personal.relationshipStatus", label: "Marital / relationship status", type: "text" },
      { key: "personal.children", label: "Number of children (if applicable)", type: "text" },
      { key: "personal.howHeard", label: "How did you hear about Biology of You?", type: "text" },
    ],
  },
  {
    id: "reason",
    title: "Reason for consultation",
    intro:
      "You don't need to have a health problem to want to understand your biology. What brought you here?",
    fields: [
      {
        key: "reason.main",
        label: "What is the main reason you're seeking a Biology of You consultation?",
        type: "textarea",
      },
    ],
  },
  {
    id: "healthChallenges",
    title: "Your health challenges",
    intro:
      "Tell us about any symptoms, health concerns, or areas where you don't feel quite right. For each: what the issue is, how much it affects your daily life (0–10) and how, how long you've experienced it, any triggers/patterns, and what you've tried so far.",
    fields: [
      { key: "healthChallenges.concern1", label: "Health concern #1", type: "textarea" },
      { key: "healthChallenges.concern2", label: "Health concern #2", type: "textarea" },
      { key: "healthChallenges.concern3", label: "Health concern #3", type: "textarea" },
      { key: "healthChallenges.concern4", label: "Health concern #4", type: "textarea" },
      {
        key: "healthChallenges.lifeEvents",
        label: "What major life events do you feel may have led to or contributed to any of the above?",
        type: "textarea",
      },
      {
        key: "healthChallenges.goodHealthMeaning",
        label: 'What does "good health" mean to you?',
        type: "textarea",
      },
    ],
  },
  {
    id: "medicalHistory",
    title: "Medical & injury history",
    fields: [
      {
        key: "medicalHistory.injuries",
        label:
          "Have you had motor vehicle accidents, falls, concussions or significant injuries? Include approximate year and what happened.",
        type: "textarea",
      },
      {
        key: "medicalHistory.medications",
        label:
          "What prescription medications are you currently taking and why? Include medication, dose if known, reason and duration.",
        type: "textarea",
      },
    ],
  },
  {
    id: "spineNervous",
    title: "Spine, nervous system & muscular health",
    fields: elaborate("spineNervous.elaborate", "spineNervous.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Neck pain", "Headaches", "Migraines", "Muscle pain or tenderness", "Joint pain",
              "Raynaud's phenomenon", "Rheumatoid arthritis", "Osteoarthritis", "Osteoporosis",
              "Numbness or tingling", "High muscle tone", "Low muscle tone", "Weakness",
              "Difficulty walking", "Balance issues", "Lightheadedness", "Dizziness", "Vertigo",
              "Tremors", "Ear aches", "Tinnitus", "Hearing loss", "Jaw pain", "Sleep disturbance",
              "Burning sensations", "Peripheral neuropathy", "Loss of smell", "Static shocks",
              "Metallic taste", "Internal vibrations", "Multiple sclerosis",
              "Concussion / brain or spine injury",
            ],
          }
        : f
    ),
  },
  {
    id: "moodBrain",
    title: "Mood, brain & cognitive health",
    fields: elaborate("moodBrain.elaborate", "moodBrain.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Short temper", "Irritability / mood swings", "Brain fog", "Difficulty concentrating",
              "Memory changes", "Memory loss", "PTSD", "Cognitive decline", "Dementia", "Alzheimer's",
              "Parkinson's", "Stroke / aneurysm", "Brain tumour", "Anxiety / panic",
              "Overwhelmed easily", "Panic attacks", "Low self-esteem / poor self-image",
              "Depression", "Apathy", "Hyperactivity", "Addictive behaviour", "ADHD", "Autism",
              "Perfectionism", "OCD", "Psychiatric disease", "Hallucinations", "Motion sickness",
              "Early greying", "Sensitive to smells / fragrances", "Sensitivity to light",
              "Vision problems", "Epilepsy / seizures",
            ],
          }
        : f
    ),
  },
  {
    id: "digestiveUrinary",
    title: "Digestive & urinary health",
    fields: elaborate("digestiveUrinary.elaborate", "digestiveUrinary.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Reflux / stomach pain", "Bloating / belching / gas", "Food allergies",
              "Histamine-related food reactions", "Low morning appetite", "Low appetite generally",
              "Sugar cravings", "Stomach ulcers", "Persistent diarrhoea", "Constipation",
              "Blood in stool", "Crohn's disease", "Ulcerative colitis", "Coeliac disease", "IBS",
              "Excessive thirst", "Bladder / continence issues", "Frequent urination",
              "Wake to urinate", "Blood in urine", "Dark urine", "Urinary retention", "UTIs",
              "Kidney issues", "Pale stools", "Hard stools", "Loose stools", "Floating stools",
              "Upper-right abdominal pain after eating", "Gallstones", "Gallbladder disease",
              "Fatty liver", "Liver disease", "Hepatitis",
            ],
          }
        : f
    ),
  },
  {
    id: "hormoneEndocrine",
    title: "Hormone & endocrine health",
    fields: elaborate("hormoneEndocrine.elaborate", "hormoneEndocrine.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Known high oestrogen", "Known low oestrogen", "Known low progesterone",
              "Known low testosterone", "Hormonal imbalance", "PMS",
              "Breathlessness before period", "Anaemia", "Hair loss", "Thinning eyebrows",
              "Excess facial/body hair", "Excessive sweating", "Night sweats", "Hypothyroidism",
              "Hyperthyroidism", "Thyroid cancer", "PCOS", "Endometriosis", "Fertility struggles",
              "Infertility", "Low libido", "Increased sex drive", "Prostate problems", "STIs",
            ],
          }
        : f
    ),
  },
  {
    id: "immuneAllergy",
    title: "Immune, allergy & mould-related health",
    fields: elaborate("immuneAllergy.elaborate", "immuneAllergy.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Sore throat", "Frequent colds / flu", "Sinus infections", "Recurring cough",
              "Strep throat", "Poor immunity", "Tonsillitis", "Postnasal drip", "Hay fever",
              "Histamine intolerance / hives", "Mast-cell-type symptoms", "Yeast / fungal infections",
              "Lyme disease", "Mould toxicity diagnosis", "Autoimmune disease",
              "Symptoms flare in damp / mouldy environments",
            ],
          }
        : f
    ),
  },
  {
    id: "cardioRespiratory",
    title: "Cardiovascular & respiratory health",
    fields: elaborate("cardioRespiratory.elaborate", "cardioRespiratory.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Shortness of breath", "Heart palpitations", "POTS / dysautonomia",
              "High blood pressure", "Low blood pressure", "Cholesterol / triglyceride issues",
              "Easy bruising", "Arterial plaque", "History of blood clots", "Poor wound healing",
              "Chronic cough", "Chest tightness", "Wheezing", "Asthma",
              "Nasal congestion / sinus issues", "Nasal polyps", "Possible sleep apnoea",
              "Chemical / fragrance / smoke sensitivity",
            ],
          }
        : f
    ),
  },
  {
    id: "skin",
    title: "Skin health",
    fields: elaborate("skin.elaborate", "skin.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Mouth / lip ulcers", "Cold sores", "Acne", "Cystic acne", "Skin infections / staph",
              "Psoriasis", "Eczema", "Lupus / SLE", "Cracked heels", "Other skin issues",
            ],
          }
        : f
    ),
  },
  {
    id: "metabolic",
    title: "Metabolic health",
    fields: elaborate("metabolic.elaborate", "metabolic.checked").map((f) =>
      f.type === "checkboxes"
        ? {
            ...f,
            options: [
              "Tiredness / fatigue", "Chronic fatigue", "Feel hot all the time",
              "Feel cold all the time", "Cold hands / feet", "Exhausted after exercise",
              "Very sore after exercise", "Overweight", "Underweight", "Recent weight change",
              "Trouble losing weight", "Water retention", "Eating disorder history",
              "Sweet cravings", "Salty cravings", "Nausea with certain foods", "Loss of appetite",
              "Insulin resistance", "Diabetes", "Addison's disease",
            ],
          }
        : f
    ),
  },
  {
    id: "otherConditions",
    title: "Other health conditions",
    fields: [
      ...elaborate("otherConditions.elaborate", "otherConditions.checked").map((f) =>
        f.type === "checkboxes"
          ? {
              ...f,
              options: [
                "Glaucoma", "Cancer (specify type)", "Haemophilia", "Sickle cell disease",
                "Genetic disorder (specify)", "Other",
              ],
            }
          : f
      ),
      {
        key: "otherConditions.other",
        label: "Any other health issues not covered that you want our team to know about?",
        type: "textarea",
      },
    ],
  },
  {
    id: "familyHistory",
    title: "Family health history",
    intro:
      "Check any known blood-relative history and tell us who it applies to (e.g. mother, father, grandparent, sibling).",
    fields: [
      {
        key: "familyHistory.checked",
        label: "Check any known blood-relative history",
        type: "checkboxes",
        options: [
          "Allergies", "Anxiety", "Depression", "Psychiatric disease", "Diabetes",
          "High blood pressure", "Heart disease / heart attack", "Aneurysm", "Stroke", "Cancer",
          "Dementia / cognitive issues", "Alzheimer's", "Glaucoma", "Kidney disease",
          "Multiple sclerosis", "Brain tumour", "Epilepsy / seizures", "Lung disease", "Migraines",
          "Thyroid disease", "Autoimmune disease", "Heavy chemical / pesticide exposure",
          "Recurrent miscarriage", "Fertility challenges", "Other significant familial pattern",
        ],
      },
      {
        key: "familyHistory.elaborate",
        label:
          "Please elaborate on anything checked above, including which relative(s) were affected and approximate age at diagnosis if known.",
        type: "textarea",
      },
    ],
  },
  {
    id: "medicalExposures",
    title: "Medications & medical exposures",
    fields: [
      { key: "medicalExposures.antibiotics12mo", label: "Courses of antibiotics in the last 12 months", type: "text" },
      { key: "medicalExposures.antibiotics10yr", label: "Approximate courses of antibiotics in the last 10 years", type: "text" },
      { key: "medicalExposures.otcYesNo", label: "Do you regularly take over-the-counter medications?", type: "yesno" },
      { key: "medicalExposures.otcDetails", label: "If yes, which ones and how often?", type: "textarea" },
      { key: "medicalExposures.vaccines", label: "Which vaccines have you had in the past 10 years? (approximate dates if known)", type: "textarea" },
    ],
  },
  {
    id: "surgeries",
    title: "Surgeries, procedures & foreign materials",
    fields: [
      {
        key: "surgeries.list",
        label:
          "Please list any surgeries or procedures you've had, including cosmetic procedures and foreign materials/devices (mesh, IUDs, stents, plates, screws, etc.)",
        type: "textarea",
      },
    ],
  },
  {
    id: "environment",
    title: "Chemical, environmental & EMF exposures",
    fields: [
      {
        key: "environment.parentalExposure",
        label:
          "Have you OR your parents ever lived or worked somewhere with regular exposure to pesticides, agricultural chemicals, solvents or industrial chemicals?",
        type: "textarea",
      },
      {
        key: "environment.currentExposure",
        label: "Are you currently exposed to chemicals, fumes, dusts, pesticides or other harmful substances?",
        type: "textarea",
      },
      { key: "environment.mouldYesNo", label: "Have you ever lived or worked in a building with known or suspected water damage or mould?", type: "yesnounsure" },
      { key: "environment.mouldDetails", label: "If yes, when and for approximately how long?", type: "textarea" },
      {
        key: "environment.sweatFrequency",
        label: "How often do you sweat properly?",
        type: "select",
        options: ["Daily", "A few times a week", "Occasionally", "Rarely"],
      },
      { key: "environment.sweatCause", label: "What usually makes you sweat?", type: "textarea" },
      { key: "environment.saunaYesNo", label: "Do you use a sauna?", type: "yesno" },
      { key: "environment.saunaType", label: "If yes, how often and what type? (Infrared / Traditional / Steam / Other)", type: "text" },
      { key: "environment.emfExposure", label: "Tell us about your typical exposure to wireless technology (phone use, Bluetooth, WiFi, smart meters, etc.)", type: "textarea" },
      { key: "environment.emfReduction", label: "Do you intentionally do anything to reduce your exposure?", type: "textarea" },
    ],
  },
  {
    id: "diet",
    title: "Your current diet",
    fields: [
      { key: "diet.currentDietYesNo", label: "Are you currently following a particular diet or way of eating?", type: "yesno" },
      { key: "diet.currentDietDetails", label: "If yes, what do you eat or avoid — and why?", type: "textarea" },
      { key: "diet.restrictYesNo", label: "Do you intentionally avoid or restrict any foods or food groups?", type: "yesno" },
      { key: "diet.restrictDetails", label: "If yes, what do you avoid and why?", type: "textarea" },
      { key: "diet.allergies", label: "Do you have any known food allergies or sensitivities?", type: "textarea" },
      { key: "diet.suspectedFoods", label: "Are there foods you suspect don't agree with you?", type: "textarea" },
      { key: "diet.homeCookedMeals", label: "Approximately how many home-cooked meals do you eat each week?", type: "text" },
      { key: "diet.organicPercent", label: "Approximately what percentage of your food would you consider organic?", type: "text" },
      { key: "diet.takeawayFrequency", label: "How often do you eat takeaway/restaurant/pre-prepared meals each week?", type: "text" },
    ],
  },
  {
    id: "dietHistory",
    title: "Your diet history",
    fields: [
      { key: "dietHistory.pastDietYesNo", label: "Have you previously followed a specific diet or way of eating?", type: "yesno" },
      { key: "dietHistory.pastDietDetails", label: "Which diet(s), for how long, why did you start — and why did you stop?", type: "textarea" },
      { key: "dietHistory.restrictionYesNo", label: "Have you ever had prolonged periods of significant dieting or calorie restriction?", type: "yesno" },
      { key: "dietHistory.restrictionDetails", label: "If yes, when, for how long, and what did that look like?", type: "textarea" },
    ],
  },
  {
    id: "mealTiming",
    title: "Meal timing, fasting & appetite",
    fields: [
      { key: "mealTiming.firstFood", label: "How long after waking do you usually have your first food?", type: "text" },
      { key: "mealTiming.mealsPerDay", label: "How many times per day do you usually eat, including snacks?", type: "text" },
      { key: "mealTiming.breakfast", label: "What do you typically have for breakfast?", type: "textarea" },
      { key: "mealTiming.fastYesNo", label: "Do you intentionally fast?", type: "yesno" },
      { key: "mealTiming.fastDetails", label: "If yes, how often and what's your usual fasting window?", type: "textarea" },
      { key: "mealTiming.fastYears", label: "For approximately how many years have you been fasting this way?", type: "text" },
      { key: "mealTiming.fastWhy", label: "Why do you fast?", type: "textarea" },
      {
        key: "mealTiming.appetite",
        label: "How would you describe your appetite?",
        type: "select",
        options: ["Strong", "Normal", "Low", "Variable"],
      },
      { key: "mealTiming.tooLong", label: "What happens if you go too long without eating?", type: "textarea" },
      { key: "mealTiming.cravingsYesNo", label: "Do you regularly crave particular foods?", type: "yesno" },
      { key: "mealTiming.cravingsDetails", label: "If yes, what do you crave, when, and how strong?", type: "textarea" },
    ],
  },
  {
    id: "relationshipWithFood",
    title: "Your relationship with food & your body",
    fields: [
      { key: "relationshipWithFood.description", label: "How would you describe your relationship with food?", type: "textarea" },
      { key: "relationshipWithFood.bingeYesNo", label: "Have you ever experienced binge eating, disordered eating or an eating disorder?", type: "select", options: ["Yes", "No", "Prefer not to say"] },
      { key: "relationshipWithFood.bingeDetails", label: "If you're comfortable telling us more, please do.", type: "textarea" },
      { key: "relationshipWithFood.weightChange", label: "Has your weight or body composition changed significantly over the past 5–10 years?", type: "textarea" },
      { key: "relationshipWithFood.happyYesNo", label: "Are you happy with your current weight and body composition?", type: "yesno" },
      { key: "relationshipWithFood.happyDetails", label: "If not, what would you like to change?", type: "textarea" },
    ],
  },
  {
    id: "hydration",
    title: "Water & hydration",
    fields: [
      { key: "hydration.waterAmount", label: "Approximately how much water do you drink each day? (litres or cups)", type: "text" },
      { key: "hydration.otherDrinks", label: "Do you regularly drink anything else for hydration?", type: "textarea" },
      { key: "hydration.filterYesNo", label: "Do you use a water filter at home?", type: "yesno" },
      { key: "hydration.filterType", label: "If yes, what type, if known?", type: "text" },
    ],
  },
  {
    id: "digestion",
    title: "Digestion",
    fields: [
      { key: "digestion.overall", label: "How would you describe your digestion overall?", type: "textarea" },
      {
        key: "digestion.symptoms",
        label: "Do you regularly experience any of the following?",
        type: "checkboxes",
        options: [
          "Bloating", "Excessive gas", "Burping", "Reflux / heartburn", "Nausea",
          "Abdominal pain / cramping", "Constipation", "Diarrhoea / loose stools", "Urgency",
          "Feeling uncomfortably full after eating", "Difficulty digesting fatty foods", "Other",
        ],
      },
      { key: "digestion.symptomsDetails", label: "If you've checked anything above, tell us what happens, how often, and any triggers.", type: "textarea" },
    ],
  },
  {
    id: "bowels",
    title: "Let's talk about your bowels",
    fields: [
      {
        key: "bowels.frequency",
        label: "How often do you usually have a bowel motion?",
        type: "select",
        options: ["<3/week", "Not every day", "Once/day", "1–2/day", "3+/day", "Varies"],
      },
      {
        key: "bowels.consistency",
        label: "What are they usually like?",
        type: "select",
        options: ["Well-formed", "Hard/pellet-like", "Loose", "Watery", "Alternating", "Urgent", "Difficult to pass", "Other"],
      },
      { key: "bowels.emptying", label: "Do you generally feel like you've completely emptied your bowels?", type: "select", options: ["Yes", "No", "Sometimes"] },
      {
        key: "bowels.noticed",
        label: "Have you noticed any of the following?",
        type: "checkboxes",
        options: ["Mucus", "Undigested food", "Floating stools", "Greasy/oily stools", "Very pale stools", "Particularly foul-smelling stools", "Blood", "Other unusual changes"],
      },
      { key: "bowels.noticedDetails", label: "If yes, please elaborate.", type: "textarea" },
      { key: "bowels.other", label: "Anything else about your digestion or bowels that we should know?", type: "textarea" },
    ],
  },
  {
    id: "supplements",
    title: "Nutritional supplements",
    fields: [
      {
        key: "supplements.list",
        label:
          "Please list all nutritional supplements you're currently taking (brand, product, dose, timing, how long).",
        type: "textarea",
      },
      { key: "supplements.reactionYesNo", label: "Do you react badly or unusually to any vitamins or supplements?", type: "yesno" },
      { key: "supplements.reactionDetails", label: "If yes, which ones and what happens?", type: "textarea" },
      { key: "supplements.positive", label: "Any supplements you've previously taken that made you feel noticeably better? What improved?", type: "textarea" },
    ],
  },
  {
    id: "caffeine",
    title: "Caffeine & drinks",
    fields: [
      { key: "caffeine.yesNo", label: "Do you consume caffeine?", type: "yesno" },
      { key: "caffeine.details", label: "If yes, what type and how much per day?", type: "textarea" },
      { key: "caffeine.softDrinkYesNo", label: "Do you consume soft drinks?", type: "yesno" },
      { key: "caffeine.softDrinkDetails", label: "If yes, which ones and how many per day/week?", type: "textarea" },
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol",
    fields: [
      { key: "alcohol.yesNo", label: "Do you drink alcohol?", type: "yesno" },
      { key: "alcohol.details", label: "Tell us what you drink in a typical week and approximately how much.", type: "textarea" },
      { key: "alcohol.years", label: "For approximately how many years have you consumed alcohol at this level?", type: "text" },
    ],
  },
  {
    id: "substances",
    title: "Smoking, vaping & recreational drugs",
    fields: [
      {
        key: "substances.checked",
        label: "Do you currently use — or have you previously used — any of the following?",
        type: "checkboxes",
        options: ["Cigarettes", "Vapes", "Marijuana / cannabis", "Cocaine", "Heroin", "Other recreational drugs"],
      },
      { key: "substances.details", label: "For anything checked above, tell us frequency, how many years, and current/past use.", type: "textarea" },
      { key: "substances.secondHandYesNo", label: "Are you regularly exposed to second-hand cigarette, vape or marijuana smoke?", type: "yesno" },
      { key: "substances.secondHandDetails", label: "If yes, please elaborate.", type: "textarea" },
    ],
  },
  {
    id: "lifeMood",
    title: "Life & mood",
    fields: [
      { key: "lifeMood.feelAboutLife", label: "How do you feel about life in general?", type: "textarea" },
      { key: "lifeMood.happinessScale", label: "Happiness & wellbeing", type: "scale", scaleLabels: ["Really struggling", "Life is pretty bloody good"] },
      { key: "lifeMood.happinessDetails", label: "Tell us a little more.", type: "textarea" },
      { key: "lifeMood.happinessDuration", label: "How long have you felt this way?", type: "text" },
      { key: "lifeMood.typicalMood", label: "What is your mood like on a typical day?", type: "textarea" },
    ],
  },
  {
    id: "energy",
    title: "Energy",
    fields: [
      { key: "energy.morningScale", label: "Morning energy", type: "scale", scaleLabels: ["Please don't speak to me", "Up and ready for the day"] },
      { key: "energy.duration", label: "How long have you felt this way?", type: "text" },
      { key: "energy.throughoutDay", label: "What happens to your energy throughout the day?", type: "textarea" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep",
    fields: [
      { key: "sleep.qualityScale", label: "Sleep quality", type: "scale", scaleLabels: ["Terrible", "I sleep like a champion"] },
      { key: "sleep.description", label: "Tell us what your sleep actually looks like.", type: "textarea" },
      { key: "sleep.duration", label: "If your sleep isn't great, how long has this been happening?", type: "text" },
      { key: "sleep.avgHours", label: "Average hours of sleep per night", type: "text" },
      { key: "sleep.darkBedroom", label: "Is your bedroom genuinely dark at night?", type: "select", options: ["Yes", "No", "Mostly"] },
      { key: "sleep.firstHour", label: "What does the first hour after waking usually look like?", type: "textarea" },
      { key: "sleep.lastHours", label: "What do the last 3 hours before bed usually look like?", type: "textarea" },
    ],
  },
  {
    id: "stress",
    title: "Stress",
    fields: [
      { key: "stress.scale", label: "Current stress level", type: "scale", scaleLabels: ["What stress?", "If one more person asks me for something..."] },
      { key: "stress.driving", label: "What's driving it?", type: "textarea" },
      { key: "stress.duration", label: "How long has life felt this stressful?", type: "text" },
      { key: "stress.management", label: "What do you typically do to manage stress?", type: "textarea" },
    ],
  },
  {
    id: "movement",
    title: "Movement & activity",
    fields: [
      { key: "movement.scale", label: "Activity level", type: "scale", scaleLabels: ["Mostly sedentary", "Rarely stop moving"] },
      { key: "movement.workType", label: "Is your work physically demanding or mostly seated?", type: "textarea" },
      { key: "movement.sittingTime", label: "How much time do you typically spend sitting each day, including commuting?", type: "text" },
      { key: "movement.exercise", label: "Do you exercise each week? Tell us exactly what you do.", type: "textarea" },
      { key: "movement.enjoy", label: "And importantly — do you actually enjoy it?", type: "textarea" },
    ],
  },
  {
    id: "sunlight",
    title: "Sunlight, nature & screens",
    fields: [
      { key: "sunlight.outside30", label: "Do you spend at least 30 minutes outside most days?", type: "yesno" },
      { key: "sunlight.naturalLight", label: "Do you get regular natural light / sunlight exposure during the day?", type: "yesno" },
      { key: "sunlight.morningLight", label: "Do you usually get outside in natural light within the first hour after waking?", type: "yesno" },
      { key: "sunlight.natureFrequency", label: "How often do you spend time in nature — and what does that look like?", type: "textarea" },
      { key: "sunlight.screenHours", label: "Approximately how many hours of your day involve looking at a screen?", type: "text" },
    ],
  },
  {
    id: "sexLife",
    title: "Sex drive & sex life",
    fields: [
      { key: "sexLife.scale", label: "Sex drive", type: "scale", scaleLabels: ["What sex drive?", "Alive and very well, thank you"] },
      { key: "sexLife.changed", label: "Has your sex drive changed over time?", type: "textarea" },
      { key: "sexLife.other", label: "Anything else about your sex life that you think may be relevant to your health?", type: "textarea" },
    ],
  },
  {
    id: "overallHealth",
    title: "Overall health & other practitioners",
    fields: [
      { key: "overallHealth.scale", label: "Overall health", type: "scale", scaleLabels: ["Feeling terrible", "Feeling fantastic"] },
      { key: "overallHealth.reason", label: "What made you choose that number?", type: "textarea" },
      { key: "overallHealth.chiroYesNo", label: "Are you regularly adjusted by a wellness-oriented chiropractor?", type: "yesno" },
      { key: "overallHealth.chiroDetails", label: "If yes, who and for how long?", type: "text" },
      { key: "overallHealth.otherPractitioners", label: "Do you currently see any other health or holistic practitioners? Who, why, how often?", type: "textarea" },
    ],
  },
  {
    id: "maleHormonal",
    title: "Male hormonal & reproductive health",
    intro: "Complete this section if relevant to your biology, otherwise mark it not relevant in the final notes.",
    fields: [
      { key: "maleHormonal.lowTSymptoms", label: "Do you experience symptoms that make you wonder about low testosterone?", type: "yesnounsure" },
      { key: "maleHormonal.testTested", label: "Have you ever tested testosterone levels?", type: "yesno" },
      { key: "maleHormonal.testDetails", label: "If yes, when and what were you told about the result?", type: "textarea" },
      { key: "maleHormonal.dhtTested", label: "Have you had DHT tested?", type: "yesno" },
      { key: "maleHormonal.e2Tested", label: "Have you ever tested oestradiol (E2) / oestrogen?", type: "yesno" },
      { key: "maleHormonal.symptoms", label: "Do you experience hair loss, oily skin or prostate issues?", type: "yesno" },
      { key: "maleHormonal.medsAffecting", label: "Do you take or have you taken anything that may affect testosterone, DHT or aromatase activity?", type: "textarea" },
      { key: "maleHormonal.fertilityYesNo", label: "Are you currently experiencing, or have you ever experienced, fertility challenges?", type: "yesno" },
      {
        key: "maleHormonal.fertilityChecked",
        label: "If yes, what challenges have been identified?",
        type: "checkboxes",
        options: ["Low sperm count", "Poor sperm motility", "Abnormal sperm morphology", "DNA fragmentation", "Erectile dysfunction", "Low libido", "Unexplained infertility", "Other"],
      },
      { key: "maleHormonal.fertilityTests", label: "What fertility tests have you undergone and what did they show?", type: "textarea" },
      { key: "maleHormonal.fertilityTreatment", label: "Have you received fertility treatment? What and did it help?", type: "textarea" },
    ],
  },
  {
    id: "femaleContraception",
    title: "Female: contraception & hormone use",
    intro: "Complete this section if relevant to your biology, otherwise mark it not relevant in the final notes.",
    fields: [
      { key: "femaleContraception.currentYesNo", label: "Are you currently using birth control / contraception?", type: "yesno" },
      { key: "femaleContraception.pastYesNo", label: "Have you used hormonal or non-hormonal contraception in the past?", type: "yesno" },
      { key: "femaleContraception.details", label: "If yes, what type(s), at what ages/dates, and for how long?", type: "textarea" },
      { key: "femaleContraception.problems", label: "Did you experience any problems or noticeable changes associated with contraception?", type: "textarea" },
      { key: "femaleContraception.hormoneTherapy", label: "Have you ever used or are you currently using hormone therapy? (progesterone, oestrogen, testosterone, DHEA, HRT, etc.)", type: "textarea" },
    ],
  },
  {
    id: "gynaecological",
    title: "Gynaecological history",
    fields: [
      { key: "gynaecological.abnormalPapYesNo", label: "Have you ever had an abnormal cervical screening / Pap smear?", type: "yesno" },
      { key: "gynaecological.abnormalPapDetails", label: "If yes, what were you told?", type: "textarea" },
      { key: "gynaecological.infectionsYesNo", label: "Have you had recurrent vaginal infections, thrush, unusual discharge, itching or odour?", type: "yesno" },
      { key: "gynaecological.infectionsDetails", label: "If yes, please elaborate.", type: "textarea" },
      {
        key: "gynaecological.conditions",
        label: "Do you have a history of any of the following?",
        type: "checkboxes",
        options: ["Ovarian cysts", "Uterine fibroids", "Endometriosis", "PCOS", "Lichen sclerosus", "Vulvodynia", "Fibrocystic breasts", "Other"],
      },
      { key: "gynaecological.conditionsElaborate", label: "Please elaborate on anything checked above.", type: "textarea" },
      { key: "gynaecological.hysterectomyYesNo", label: "Have you had a hysterectomy?", type: "yesno" },
      { key: "gynaecological.hysterectomyDetails", label: "If yes, partial or complete? Date, reason, ovaries retained?", type: "textarea" },
      { key: "gynaecological.otherProcedures", label: "Please list any other gynaecological procedures or surgeries, with approximate dates.", type: "textarea" },
    ],
  },
  {
    id: "fertilityPregnancy",
    title: "Fertility & pregnancy history",
    fields: [
      { key: "fertilityPregnancy.tryingYesNo", label: "Are you currently trying to conceive?", type: "yesno" },
      { key: "fertilityPregnancy.tryingDuration", label: "If yes, how long have you been trying?", type: "text" },
      { key: "fertilityPregnancy.treatmentYesNo", label: "Have you ever used fertility treatment?", type: "yesno" },
      { key: "fertilityPregnancy.treatmentDetails", label: "If yes, what treatment, when, and what was the outcome?", type: "textarea" },
      { key: "fertilityPregnancy.investigations", label: "What have any gynaecological or reproductive investigations shown?", type: "textarea" },
      { key: "fertilityPregnancy.everPregnantYesNo", label: "Have you ever been pregnant?", type: "yesno" },
      {
        key: "fertilityPregnancy.pregnancySummary",
        label:
          "If yes, please summarise your pregnancy history (total pregnancies, live births, miscarriages/gestation, stillbirths, ectopic pregnancies, terminations, C-sections, complications).",
        type: "textarea",
      },
    ],
  },
  {
    id: "menstrual",
    title: "Menstrual cycle history",
    intro: "Complete this section if you currently menstruate. If you've reached menopause, skip to the next section.",
    fields: [
      { key: "menstrual.ageFirst", label: "Age at first period", type: "text" },
      { key: "menstrual.cycleLength", label: "Typical cycle length (first day of one period to first day of next)", type: "text" },
      { key: "menstrual.bleedingDays", label: "Typical number of bleeding days", type: "text" },
      { key: "menstrual.regular", label: "Do you consider your cycle regular?", type: "select", options: ["Yes", "No", "Not currently (pregnancy/breastfeeding/other)"] },
      { key: "menstrual.irregularPattern", label: "If not regular, please describe the pattern.", type: "textarea" },
      { key: "menstrual.periodDescription", label: "How would you describe your period?", type: "select", options: ["Easy", "Uncomfortable", "Difficult", "Debilitating"] },
      { key: "menstrual.flow", label: "How would you describe your flow?", type: "select", options: ["Light", "Medium", "Heavy", "Very heavy"] },
      { key: "menstrual.padsChanges", label: "On your heaviest day, approximately how many pads/tampons/cup changes do you need?", type: "text" },
      { key: "menstrual.clotsYesNo", label: "Do you experience clots?", type: "yesno" },
      { key: "menstrual.clotsDetails", label: "If yes, how often and approximately what size?", type: "text" },
      { key: "menstrual.spottingYesNo", label: "Do you experience spotting between periods?", type: "yesno" },
      { key: "menstrual.spottingDetails", label: "If yes, when does it usually occur?", type: "text" },
      { key: "menstrual.tendernessYesNo", label: "Do you experience breast tenderness or noticeable breast changes across your cycle?", type: "yesno" },
      { key: "menstrual.tendernessDetails", label: "If yes, when and how severe?", type: "textarea" },
      { key: "menstrual.pmsSymptoms", label: "What symptoms do you notice in the week before or during your period?", type: "textarea" },
      { key: "menstrual.treatment", label: "Have you received treatment for menstrual or cycle issues? What was tried and what changed?", type: "textarea" },
    ],
  },
  {
    id: "perimenopause",
    title: "Perimenopause & menopause",
    fields: [
      { key: "perimenopause.currentYesNo", label: "Are you currently experiencing changes you believe may be perimenopause?", type: "yesnounsure" },
      { key: "perimenopause.changes", label: "If yes or unsure, when did the changes begin and what has changed?", type: "textarea" },
      { key: "perimenopause.effect", label: "How has this transition affected you?", type: "textarea" },
      { key: "menopause.reachedYesNo", label: "Have you reached menopause (12 months without a period, not explained by pregnancy/breastfeeding/other)?", type: "yesnounsure" },
      { key: "menopause.ageYear", label: "If yes, what age/year was your final period?", type: "text" },
      { key: "menopause.experience", label: "Please describe your experience transitioning through menopause.", type: "textarea" },
      { key: "menopause.approaches", label: "Have you used any complementary or lifestyle approaches for perimenopause/menopause? What did you try and did it help?", type: "textarea" },
    ],
  },
  {
    id: "finalNotes",
    title: "What to send us",
    intro:
      "Thank you for completing your health history. Please also gather: a 7-day food and drink diary, clear photos of your supplement labels, requested blood/urine test results, your full DNA/gene report, and any other relevant test results.",
    fields: [
      {
        key: "finalNotes.attachments",
        label: "What will you be sending separately?",
        type: "checkboxes",
        options: [
          "7-day food and drink diary",
          "Photos of supplement labels",
          "Blood and urine test results",
          "Full DNA / gene report",
          "Other relevant test results",
        ],
      },
      {
        key: "finalNotes.anythingElse",
        label: "Anything else you would like us to know before we review your information?",
        type: "textarea",
      },
    ],
  },
];
