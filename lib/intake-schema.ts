// Single source of truth for the health history intake form.
// Both the multi-step form (app/portal/intake/page.tsx) and the Word
// document generator (lib/intake-docx.ts) read this schema, so the
// (very long) checkbox lists only need to be written once.

export type FieldType =
  | "text"
  | "date"
  | "textarea"
  | "yesno"
  | "yesnounsure"
  | "scale"
  | "checkboxes"
  | "select"
  | "images"
  | "temperature"
  | "mealtime";

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
  part?: { number: number; title: string; subtitle: string };
  sectionHeading?: { title: string; subtitle?: string };
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
    id: "welcome",
    title: "The Biology of You\u2122 — Health History",
    intro:
      "Please allow at least 20 minutes to complete this form.\n\n" +
      "Your health history is an important part of your Biology of You analysis. It helps us understand the person behind the blood results and genetic blueprint — you.\n\n" +
      "We'll look at your health history, energy, sleep, digestion, hormones, lifestyle, environment and the things you've experienced along the way, and correlate these with your blood work and genetics.\n\n" +
      "Because none of these things exist in isolation.\n\n" +
      "Your genes help us understand what your body may be more or less equipped to do. Your blood work gives us a snapshot of what's happening now. Your health history gives us the context to understand what that actually means for you.\n\n" +
      "Together, these pieces help us build recommendations that are genuinely tailored to your biology.\n\n" +
      "A LITTLE WARNING: WE'RE GOING TO GET NOSY.\n\n" +
      "The more honest you are — and the more complete your answers — the more useful this process becomes.\n\n" +
      "So yes, we want to know whether you love the gym or would rather poke yourself in the eye, how many rounds of antibiotics you've had, what your bowels are doing, your libido, your menstrual cycle — and how much you really drink, whether you have a pot habit, or any other vice you were quietly hoping we wouldn't ask about.\n\n" +
      "We're not here to judge. We're here to understand your biology. Help us help you. Sometimes the tiny detail you nearly didn't bother mentioning turns out to be an important piece of the puzzle.\n\n" +
      'If you are unsure of an answer, write "unsure." If a section does not apply to you, mark it "not relevant." For example, if you\'re still menstruating, mark the menopause questions as not relevant. And gentlemen, unless we\'ve missed something fairly significant, you can safely do the same with the entire menstrual section.',
    fields: [],
  },
  {
    id: "personal",
    title: "Let's get to know you",
    fields: [
      { key: "personal.title", label: "Title", type: "text" },
      { key: "personal.name", label: "First & last name", type: "text" },
      { key: "personal.preferredName", label: "Preferred name", type: "text" },
      { key: "personal.age", label: "Age", type: "text" },
      { key: "personal.dob", label: "Date of birth", type: "date" },
      { key: "personal.addressStreet", label: "Street address", type: "text" },
      { key: "personal.addressSuburb", label: "Suburb / town", type: "text" },
      { key: "personal.addressState", label: "State", type: "text" },
      { key: "personal.addressPostcode", label: "Postcode", type: "text" },
      { key: "personal.occupation", label: "Occupation", type: "text" },
      { key: "personal.email", label: "Email", type: "text" },
      {
        key: "personal.relationshipStatus",
        label: "Marital / relationship status",
        type: "select",
        options: ["Single", "In a relationship", "Married / partnered", "Separated", "Divorced", "Widowed", "Prefer not to say"],
      },
      { key: "personal.children", label: "Number of children (if applicable)", type: "text" },
      { key: "personal.howHeard", label: "How did you hear about Biology of You?", type: "text" },
    ],
  },
  {
    id: "reason",
    title: "Reason for consultation",
    part: {
      number: 1,
      title: "Your Health Story",
      subtitle: "Why you're here, what you've experienced, and the health patterns that have shaped you.",
    },
    intro:
      "You don't need to have a health problem to want to understand your biology.\n\n" +
      "Maybe there's something you'd like to improve. Maybe your family history has raised questions. Or maybe you feel great and are simply curious about what makes you tick — and how to keep it that way.\n\n" +
      "So, what brought you here?",
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
      "If you do have symptoms, health concerns or areas where you don't feel quite right, tell us about them here.\n\n" +
      "For each concern, tell us: what the issue is; how much it affects your daily life (0–10) and how; how long you've experienced it; any triggers or patterns; and what you've tried so far — including treatments, medications, diets, supplements or practitioners, and whether they helped.\n\n" +
      'Example: "Terrible gut issues. 10/10 — affects me every day with loose bowels and bloating. Has progressively worsened over five years. I\'ve seen naturopaths (some improvement) and a gastroenterologist (ruled out anything sinister and suggested going gluten-free)."\n\n' +
      'Not sure what counts as a health challenge? Think about things you may have simply learnt to live with — poor sleep, headaches, acne or skin issues, bloating, constipation, breathlessness, low energy, anxiety, period pain, heavy or irregular periods, PMS, brain fog, reflux, aches and pains, allergies, poor recovery, difficulty losing or gaining weight, low libido or anything else that makes you think, "Oh, that\'s just me."\n\n' +
      "It might be. But tell us anyway.",
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
    intro:
      "Note: We ask about surgeries, procedures, implants, antibiotics, vaccines and over-the-counter medications in Part 2, so you won't need to enter them twice.",
  },
  {
    id: "spineNervous",
    title: "Spine, nervous system & muscular health",
    sectionHeading: {
      title: "Past & Current Health History",
      subtitle: "Please check anything that currently applies or has applied in the past. Elaborate on anything important below each group.",
    },
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
    part: {
      number: 2,
      title: "Your Biology in Real Life",
      subtitle:
        "Your environment, exposures, food, sleep, stress, movement and the everyday inputs your biology is responding to.",
    },
    sectionHeading: {
      title: "Your Exposures & Environment",
      subtitle:
        "Our biology doesn't operate in a bubble. Medications, chemicals, our work and home environments, previous procedures and other exposures can all add useful context to your health story. This section helps us understand what your body has encountered along the way — and what it may still be encountering today.",
    },
    fields: [
      { key: "medicalExposures.antibiotics12mo", label: "How many courses of antibiotics have you had in the last 12 months?", type: "text" },
      {
        key: "medicalExposures.antibiotics10yr",
        label: "Approximately how many courses of antibiotics have you had in the last 10 years?",
        helper: "Don't worry if you can't remember exactly — your best estimate is fine.",
        type: "text",
      },
      {
        key: "medicalExposures.otcYesNo",
        label: "Do you regularly take over-the-counter medications?",
        helper: "e.g. paracetamol/acetaminophen, ibuprofen, antihistamines",
        type: "yesno",
      },
      { key: "medicalExposures.otcDetails", label: "If yes, which ones and how often?", type: "textarea" },
      {
        key: "medicalExposures.vaccines",
        label: "Which vaccines have you had in the past 10 years?",
        helper: "Please include approximate dates if you remember them.",
        type: "textarea",
      },
    ],
  },
  {
    id: "surgeries",
    title: "Surgeries, procedures & foreign materials",
    fields: [
      {
        key: "surgeries.list",
        label: "Please list any surgeries or procedures you've had.",
        helper:
          "Include cosmetic procedures such as Botox, fillers or implants, as well as foreign materials/devices such as mesh, IUDs, stents, plates or screws. If there's something permanently living in your body that you weren't born with, we'd like to know about it.",
        type: "textarea",
      },
    ],
  },
  {
    id: "environment",
    title: "Chemical, environmental & mould exposures",
    sectionHeading: {
      title: "Chemical & Environmental Exposures",
      subtitle: "",
    },
    fields: [
      {
        key: "environment.parentalExposure",
        label:
          "Have you OR your parents ever lived or worked somewhere with regular exposure to pesticides, agricultural chemicals, solvents or industrial chemicals?",
        helper: "For example: farming, crop spraying, factories, workshops, mining, painting, hairdressing or other chemical-heavy environments.",
        type: "textarea",
      },
      {
        key: "environment.currentExposure",
        label: "Are you currently exposed to chemicals, fumes, dusts, pesticides or other potentially harmful substances through work, hobbies or home?",
        type: "textarea",
      },
      { key: "environment.mouldYesNo", label: "Have you ever lived or worked in a building with known or suspected water damage or mould?", type: "yesnounsure" },
      { key: "environment.mouldDetails", label: "If yes, when and for approximately how long?", type: "textarea" },
    ],
  },
  {
    id: "sweatSauna",
    title: "Sweating & sauna",
    sectionHeading: {
      title: "Sweating & Sauna",
    },
    fields: [
      {
        key: "environment.sweatFrequency",
        label: "How often do you sweat properly?",
        type: "select",
        options: ["Daily", "A few times a week", "Occasionally", "Rarely"],
      },
      {
        key: "environment.sweatCause",
        label: "What usually makes you sweat?",
        helper: "Exercise, hot weather, sauna, physical work — or perhaps nothing short of being locked in a Bikram yoga studio.",
        type: "textarea",
      },
      { key: "environment.saunaYesNo", label: "Do you use a sauna?", type: "yesno" },
      { key: "environment.saunaType", label: "If yes, how often and what type? (Infrared / Traditional / Steam / Other)", type: "text" },
    ],
  },
  {
    id: "emfExposure",
    title: "Technology & EMF exposure",
    sectionHeading: {
      title: "Technology & EMF Exposure",
    },
    fields: [
      {
        key: "environment.emfExposure",
        label: "Tell us about your typical exposure to wireless technology.",
        helper:
          "For example: prolonged mobile phone use, carrying your phone against your body, Bluetooth devices/headphones, working or sleeping close to WiFi routers, smart meters or other wireless technology.",
        type: "textarea",
      },
      {
        key: "environment.emfReduction",
        label: "Do you intentionally do anything to reduce your exposure?",
        helper: "For example: turning WiFi off at night, keeping your phone away from your body, using wired connections/headphones or switching devices to aeroplane mode.",
        type: "textarea",
      },
    ],
  },
  {
    id: "diet",
    title: "Your current diet",
    sectionHeading: {
      title: "Food, Nutrition & Digestion",
      subtitle:
        "You'll also be completing a 7-day food diary, so we won't make you document every mouthful twice. Your food diary will show us what you eat — the questions below help us understand the story behind it: dietary restrictions, previous diets, fasting, appetite, food reactions, supplements, digestion and your relationship with food.",
    },
    fields: [
      { key: "diet.currentDietYesNo", label: "Are you currently following a particular diet or way of eating?", type: "yesno" },
      { key: "diet.currentDietDetails", label: "If yes, tell us what you eat or avoid — and importantly, why.", type: "textarea" },
      {
        key: "diet.restrictYesNo",
        label: "Do you intentionally avoid or restrict any foods or food groups, even if you don't consider yourself to be on a diet?",
        type: "yesno",
      },
      { key: "diet.restrictDetails", label: "If yes, what do you avoid and why?", type: "textarea" },
      { key: "diet.allergies", label: "Do you have any known food allergies or sensitivities?", type: "textarea" },
      {
        key: "diet.suspectedFoods",
        label: "Are there foods you suspect don't agree with you, even without a formal allergy or intolerance?",
        type: "textarea",
      },
      { key: "diet.homeCookedMeals", label: "Approximately how many home-cooked meals do you eat each week?", type: "text" },
      { key: "diet.organicPercent", label: "Approximately what percentage of your food would you consider organic?", type: "text" },
      { key: "diet.takeawayFrequency", label: "How often do you eat takeaway, restaurant or pre-prepared meals each week?", type: "text" },
    ],
  },
  {
    id: "dietHistory",
    title: "Your diet history",
    fields: [
      { key: "dietHistory.pastDietYesNo", label: "Have you previously followed a specific diet or way of eating?", type: "yesno" },
      {
        key: "dietHistory.pastDietDetails",
        label: "Which diet(s), for how long, why did you start — and why did you stop?",
        helper: "For example: vegetarian, vegan, carnivore, keto, paleo, low-carb, low-fat, gluten-free, dairy-free, intermittent fasting or calorie restriction.",
        type: "textarea",
      },
      { key: "dietHistory.restrictionYesNo", label: "Have you ever had prolonged periods of significant dieting or calorie restriction?", type: "yesno" },
      { key: "dietHistory.restrictionDetails", label: "If yes, tell us approximately when, for how long and what that looked like.", type: "textarea" },
    ],
  },
  {
    id: "mealTiming",
    title: "Meal timing, fasting & appetite",
    fields: [
      { key: "mealTiming.firstFood", label: "How long after waking do you usually have your first food?", type: "text" },
      { key: "mealTiming.mealsPerDay", label: "How many times per day do you usually eat, including meals and snacks?", type: "text" },
      {
        key: "mealTiming.breakfast",
        label: "What do you typically have for breakfast?",
        helper: 'And yes, "just coffee" absolutely counts as an answer.',
        type: "textarea",
      },
      { key: "mealTiming.fastYesNo", label: "Do you intentionally fast?", type: "yesno" },
      { key: "mealTiming.fastDetails", label: "If yes, how often and what's your usual fasting window?", type: "textarea" },
      { key: "mealTiming.fastYears", label: "For approximately how many years have you been fasting this way?", type: "text" },
      {
        key: "mealTiming.fastWhy",
        label: "Why do you fast?",
        helper: "Health benefits, weight management, not hungry, convenience, religious reasons, someone told you it was good for you, or other.",
        type: "textarea",
      },
      {
        key: "mealTiming.appetite",
        label: "How would you describe your appetite?",
        type: "select",
        options: ["Strong", "Normal", "Low", "Variable"],
      },
      {
        key: "mealTiming.tooLong",
        label: "What happens if you go too long without eating?",
        helper: "For example: nothing, shaky, irritable, anxious, light-headed, headache, nauseous, weak, tired or suddenly ready to eat everything in sight.",
        type: "textarea",
      },
      { key: "mealTiming.cravingsYesNo", label: "Do you regularly crave particular foods?", type: "yesno" },
      { key: "mealTiming.cravingsDetails", label: "If yes, what do you crave, when does it happen and how strong are the cravings?", type: "textarea" },
    ],
  },
  {
    id: "relationshipWithFood",
    title: "Your relationship with food & your body",
    fields: [
      { key: "relationshipWithFood.description", label: "How would you describe your relationship with food?", type: "textarea" },
      { key: "relationshipWithFood.bingeYesNo", label: "Have you ever experienced binge eating, disordered eating or an eating disorder?", type: "select", options: ["Yes", "No", "Prefer not to say"] },
      { key: "relationshipWithFood.bingeDetails", label: "If you're comfortable telling us more, please do.", type: "textarea" },
      {
        key: "relationshipWithFood.weightChange",
        label: "Has your weight or body composition changed significantly over the past 5–10 years?",
        helper: "Tell us about significant weight gain/loss, muscle gain/loss, or changes that seemed unexplained.",
        type: "textarea",
      },
      { key: "relationshipWithFood.happyYesNo", label: "Are you happy with your current weight and body composition?", type: "yesno" },
      { key: "relationshipWithFood.happyDetails", label: "If not, what would you like to change?", type: "textarea" },
    ],
  },
  {
    id: "hydration",
    title: "Water & hydration",
    fields: [
      { key: "hydration.waterAmount", label: "Approximately how much water do you drink each day? Please give litres or cups.", type: "text" },
      {
        key: "hydration.otherDrinks",
        label: "Do you regularly drink anything else for hydration?",
        helper: "For example: sparkling/mineral water, coconut water, juice or electrolyte drinks.",
        type: "textarea",
      },
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
      { key: "digestion.symptomsDetails", label: "If you've checked anything above, tell us what happens, how often and whether you've noticed triggers.", type: "textarea" },
    ],
  },
  {
    id: "bowels",
    title: "Let's talk about your bowels",
    intro: "Yes, we're asking about your poop. It tells us more than you might think.",
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
      {
        key: "bowels.other",
        label: "Anything else about your digestion or bowels that we should know?",
        helper: 'If you\'ve been wondering whether something is "normal" for years, this would be an excellent place to tell us.',
        type: "textarea",
      },
    ],
  },
  {
    id: "supplements",
    title: "Nutritional supplements",
    fields: [
      {
        key: "supplements.list",
        label: "Please list all nutritional supplements you're currently taking.",
        helper:
          'Include brand, product name, dose, timing and approximately how long you\'ve been taking each one. You\'ll also attach photos of the labels separately — because "I take a magnesium" leaves us with approximately 4,000 follow-up questions.',
        type: "textarea",
      },
      {
        key: "supplements.labelPhotos",
        label: "Photos of your supplement labels",
        helper: "Attach a clear photo of each label directly here — no need to send these separately.",
        type: "images",
      },
      { key: "supplements.reactionYesNo", label: "Do you react badly or unusually to any vitamins or supplements?", type: "yesno" },
      {
        key: "supplements.reactionDetails",
        label: "If yes, which ones and what happens?",
        helper: "For example: anxiety, headaches, nausea, diarrhoea, insomnia, feeling wired, sedation, flushing or itching.",
        type: "textarea",
      },
      { key: "supplements.positive", label: "Are there any supplements you've previously taken that made you feel noticeably better? What improved?", type: "textarea" },
    ],
  },
  {
    id: "caffeine",
    title: "Caffeine & drinks",
    sectionHeading: {
      title: "Social & Lifestyle",
      subtitle:
        "This is where we get to know the life your biology is actually living. Sleep, stress, relationships, movement, sunlight, alcohol, caffeine, recreational drugs and the way you spend your days can all influence how your body functions.\n\n" +
        "So please be transparent. We're not here to judge your coffee intake, your sex life, your coping mechanisms or what you got up to in your twenties. We just need good data.",
    },
    fields: [
      { key: "caffeine.yesNo", label: "Do you consume caffeine?", type: "yesno" },
      {
        key: "caffeine.details",
        label: "If yes, what type and how much per day?",
        helper: "Coffee / green tea / black tea / hot chocolate / energy drinks / other.",
        type: "textarea",
      },
      { key: "caffeine.softDrinkYesNo", label: "Do you consume soft drinks?", type: "yesno" },
      { key: "caffeine.softDrinkDetails", label: "If yes, which ones and how many per day/week?", type: "textarea" },
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol",
    fields: [
      { key: "alcohol.yesNo", label: "Do you drink alcohol?", type: "yesno" },
      {
        key: "alcohol.details",
        label: "Tell us what you drink in a typical week and approximately how much.",
        helper:
          'For example: 4 \u00d7 150 mL glasses of wine, 3 \u00d7 330 mL beers, 2 \u00d7 30 mL spirits. Please estimate the actual serving size. "One glass" can apparently mean anything from a civilised pour to half a bottle.',
        type: "textarea",
      },
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
      { key: "substances.details", label: "For anything checked above, tell us frequency, how many years, and whether this is current or past use.", type: "textarea" },
      { key: "substances.secondHandYesNo", label: "Are you regularly exposed to second-hand cigarette, vape or marijuana smoke?", type: "yesno" },
      {
        key: "substances.secondHandDetails",
        label: "If yes, please elaborate.",
        helper: "If you're wondering whether you should tell us about it, you probably should. Help us help you.",
        type: "textarea",
      },
    ],
  },
  {
    id: "lifeMood",
    title: "Life & mood",
    fields: [
      { key: "lifeMood.feelAboutLife", label: "How do you feel about life in general?", type: "textarea" },
      { key: "lifeMood.happinessScale", label: "Happiness & wellbeing", type: "scale", scaleLabels: ["Really struggling", "Life is pretty bloody good"] },
      {
        key: "lifeMood.happinessDetails",
        label: "Tell us a little more.",
        helper: 'For example: "I\'m generally good, just exhausted" / "I feel overwhelmed most days" / "Life\'s great."',
        type: "textarea",
      },
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
      {
        key: "energy.throughoutDay",
        label: "What happens to your energy throughout the day?",
        helper: "Tell us about crashes, afternoon slumps, second winds at night or times when you feel particularly good.",
        type: "textarea",
      },
    ],
  },
  {
    id: "sleep",
    title: "Sleep",
    fields: [
      { key: "sleep.qualityScale", label: "Sleep quality", type: "scale", scaleLabels: ["Terrible", "I sleep like a champion"] },
      {
        key: "sleep.description",
        label: "Tell us what your sleep actually looks like.",
        helper: "Consider falling asleep, waking during the night, waking early, restless sleep, snoring, nightmares, restless legs, urination, feeling hot/cold or waking unrefreshed.",
        type: "textarea",
      },
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
      {
        key: "stress.driving",
        label: "What's driving it?",
        helper: "Work, relationships, finances, parenting, caring for others, health, grief, major life changes — or perhaps just other humans in general.",
        type: "textarea",
      },
      { key: "stress.duration", label: "How long has life felt this stressful?", type: "text" },
      {
        key: "stress.management",
        label: "What do you typically do to manage stress?",
        helper: "Exercise, walking, meditation, alcohol, food, scrolling, talking, avoiding everyone, breathing exercises, hobbies — whatever it is, tell us.",
        type: "textarea",
      },
    ],
  },
  {
    id: "movement",
    title: "Movement & activity",
    fields: [
      { key: "movement.scale", label: "Activity level", type: "scale", scaleLabels: ["Mostly sedentary", "Rarely stop moving"] },
      { key: "movement.workType", label: "Is your work physically demanding or mostly seated?", type: "textarea" },
      { key: "movement.sittingTime", label: "How much time do you typically spend sitting each day, including commuting?", type: "text" },
      {
        key: "movement.exercise",
        label: "Do you exercise each week? Tell us exactly what you do.",
        helper: "Include type, frequency, duration and intensity.",
        type: "textarea",
      },
      {
        key: "movement.enjoy",
        label: "And importantly — do you actually enjoy it?",
        helper: "Love it, tolerate it, do it because I know I should, or would happily never exercise again?",
        type: "textarea",
      },
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
    intro: "Yes, we're asking. Your libido can tell us quite a lot about hormones, energy, stress and overall health — so don't be shy now.",
    fields: [
      { key: "sexLife.scale", label: "Sex drive", type: "scale", scaleLabels: ["What sex drive?", "Alive and very well, thank you"] },
      {
        key: "sexLife.changed",
        label: "Has your sex drive changed over time?",
        helper: "Tell us whether it's always been high/low, has noticeably increased or declined, and approximately when things changed.",
        type: "textarea",
      },
      {
        key: "sexLife.other",
        label: "Anything else about your sex life that you think may be relevant to your health?",
        helper: "You decide how much detail we need. This is a health history, not Fifty Shades of Grey.",
        type: "textarea",
      },
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
      {
        key: "overallHealth.otherPractitionersYesNo",
        label: "Do you currently see any other health or holistic practitioners?",
        helper: "For example: naturopath, Chinese medicine practitioner, osteopath, physiotherapist, nutritionist or health coach.",
        type: "textarea",
      },
      { key: "overallHealth.otherPractitioners", label: "If yes, tell us who you see, why and how often.", type: "textarea" },
    ],
  },
  {
    id: "maleHormonal",
    title: "Male hormonal & reproductive health",
    part: {
      number: 3,
      title: "Hormones, Fertility & Reproductive Health",
      subtitle:
        "Hormonal and reproductive history across different stages of life — whether having children is relevant to you or not.\n\n" +
        "Hormones influence far more than fertility. They affect energy, mood, metabolism, body composition, libido, sleep and how we feel across different stages of life. Complete the section that applies to your biology and mark the rest not relevant.",
    },
    intro: "Complete this section if relevant to your biology, otherwise mark it not relevant in the final notes.",
    fields: [
      {
        key: "maleHormonal.lowTSymptoms",
        label: "Do you experience symptoms that make you wonder about low testosterone?",
        helper: "For example: fatigue, low libido, poor muscle recovery, weight gain or brain fog.",
        type: "yesnounsure",
      },
      { key: "maleHormonal.testTested", label: "Have you ever tested testosterone levels?", type: "yesno" },
      { key: "maleHormonal.testDetails", label: "If yes, when and what were you told about the result?", type: "textarea" },
      { key: "maleHormonal.dhtTested", label: "Have you had DHT (dihydrotestosterone) tested?", type: "yesno" },
      { key: "maleHormonal.e2Tested", label: "Have you ever tested oestradiol (E2) / oestrogen?", type: "yesno" },
      { key: "maleHormonal.symptoms", label: "Do you experience hair loss, oily skin or prostate issues?", type: "yesno" },
      {
        key: "maleHormonal.medsAffecting",
        label: "Do you take or have you taken anything that may affect testosterone, DHT or aromatase activity?",
        helper: "For example: finasteride, saw palmetto, zinc, DIM, testosterone replacement therapy or other hormone therapy.",
        type: "textarea",
      },
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
      {
        key: "femaleContraception.details",
        label: "If yes, what type(s), at what ages/dates, and for how long?",
        helper: "For example: oral contraceptive pill, injection, patch, ring, implant, emergency contraception, copper or hormonal IUD.",
        type: "textarea",
      },
      { key: "femaleContraception.problems", label: "Did you experience any problems or noticeable changes associated with contraception?", type: "textarea" },
      {
        key: "femaleContraception.hormoneTherapy",
        label: "Have you ever used or are you currently using hormone therapy?",
        helper: "Include progesterone, oestrogen, testosterone, DHEA, pregnenolone, conventional HRT or bioidentical hormones. Please include product, dose, dates and whether you still use it.",
        type: "textarea",
      },
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
        label: "If yes, please summarise your pregnancy history.",
        helper: "Include total pregnancies, live births, miscarriages and gestation, stillbirths, ectopic pregnancies, terminations/abortions, Caesarean births and any major pregnancy or birth complications.",
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
      {
        key: "menstrual.pmsSymptoms",
        label: "What symptoms do you notice in the week before or during your period?",
        helper: "For example: pain, migraines/headaches, mood changes, anxiety, cravings, bloating, diarrhoea/constipation, acne, sleep changes, fatigue or breathlessness.",
        type: "textarea",
      },
      { key: "menstrual.treatment", label: "Have you received treatment for menstrual or cycle issues? What was tried and what changed?", type: "textarea" },
    ],
  },
  {
    id: "perimenopause",
    title: "Perimenopause & menopause",
    fields: [
      { key: "perimenopause.currentYesNo", label: "Are you currently experiencing changes you believe may be perimenopause?", type: "yesnounsure" },
      {
        key: "perimenopause.changes",
        label: "If yes or unsure, when did the changes begin and what has changed?",
        helper: "For example: cycle length/flow, sleep, temperature regulation, mood, libido, body composition, headaches, cognition or energy.",
        type: "textarea",
      },
      { key: "perimenopause.effect", label: "How has this transition affected you?", type: "textarea" },
      { key: "menopause.reachedYesNo", label: "Have you reached menopause (12 months without a period, not explained by pregnancy/breastfeeding/other)?", type: "yesnounsure" },
      { key: "menopause.ageYear", label: "If yes, what age/year was your final period?", type: "text" },
      {
        key: "menopause.experience",
        label: "Please describe your experience transitioning through menopause.",
        helper: "Include physical symptoms, mood/cognitive changes, sleep, libido, body composition and anything else significant.",
        type: "textarea",
      },
      { key: "menopause.approaches", label: "Have you used any complementary or lifestyle approaches for perimenopause/menopause? What did you try and did it help?", type: "textarea" },
    ],
  },
  {
    id: "finalNotes",
    title: "What to send us",
    intro:
      "Thank you for completing your health history. Please also gather: a 7-day food and drink diary, clear front and back photos of all supplements you currently take, requested blood/urine test results, your full DNA/gene report, and any other relevant test results.",
    fields: [
      {
        key: "finalNotes.attachments",
        label: "What will you be sending separately?",
        type: "checkboxes",
        options: [
          "7-day food and drink diary — all meals, snacks and beverages",
          "Clear front and back photos of all supplements you currently take",
          "Requested blood and urine test results",
          "Your full DNA / gene report",
          "Any other relevant test results you would like us to review",
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