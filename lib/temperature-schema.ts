// Single source of truth for the 14-day body temperature tracking form.
// Mirrors lib/food-diary-schema.ts so it can reuse the same Field
// component and wizard pattern.
import { FieldType } from "@/lib/intake-schema";

export interface TemperatureField {
  key: string;
  label: string;
  helper?: string;
  type: FieldType;
  options?: string[];
  // When true, this field is rendered side-by-side with the field that
  // immediately follows it (used to pair a reading's time with its value).
  inlineWithNext?: boolean;
}

export interface TemperatureStep {
  id: string;
  title: string;
  intro?: string;
  fields: TemperatureField[];
}

const dayStep = (dayNumber: number): TemperatureStep => ({
  id: `day${dayNumber}`,
  title: `Day ${dayNumber}`,
  fields: [
    {
      key: `day${dayNumber}.wakingTime`,
      label: "Waking temperature — time",
      helper: "Immediately upon waking, before getting out of bed if possible, and before eating, drinking, showering or exercising.",
      type: "mealtime",
      inlineWithNext: true,
    },
    {
      key: `day${dayNumber}.wakingTemp`,
      label: "Waking temperature — reading",
      helper: "Example: 36.2°C",
      type: "temperature",
    },
    {
      key: `day${dayNumber}.breakfastTime`,
      label: "After breakfast — time",
      helper: "Approximately 30 minutes after finishing breakfast.",
      type: "mealtime",
      inlineWithNext: true,
    },
    {
      key: `day${dayNumber}.breakfastTemp`,
      label: "After breakfast — reading",
      helper: "Example: 36.7°C",
      type: "temperature",
    },
    {
      key: `day${dayNumber}.exerciseTime`,
      label: "After exercise or movement — time",
      helper: "Wait approximately 5–10 minutes after finishing before taking your temperature.",
      type: "mealtime",
      inlineWithNext: true,
    },
    {
      key: `day${dayNumber}.exerciseTemp`,
      label: "After exercise or movement — reading",
      helper: "Example: 37.0°C",
      type: "temperature",
    },
    {
      key: `day${dayNumber}.exerciseType`,
      label: "What type of exercise did you do, and for roughly how long?",
      type: "text",
    },
    {
      key: `day${dayNumber}.notesFlags`,
      label: "Anything to note today?",
      type: "checkboxes",
      options: [
        "Unwell / fever",
        "Slept particularly poorly",
        "Menstruating",
        "Something unusual today (travel, significant stress, alcohol, etc.)",
      ],
    },
    {
      key: `day${dayNumber}.notesDetails`,
      label: "Please elaborate on anything checked above.",
      type: "textarea",
    },
  ],
});

export const TEMPERATURE_STEPS: TemperatureStep[] = [
  {
    id: "welcome",
    title: "14-Day Body Temperature Tracking",
    intro:
      "Dr Jen has asked you to begin tracking your body temperature for the next 14 days.\n\n" +
      "This is one of the simplest but most valuable pieces of information used when assessing how your metabolism, thyroid function, nervous system and overall energy production are functioning. Rather than relying on a single temperature reading taken in a clinic, observing how your temperature responds throughout the day gives a much clearer picture of how your body is regulating itself.\n\n" +
      "What you'll need:\n" +
      "— A digital thermometer (an oral thermometer is ideal)\n" +
      "— This portal, or a notebook/journal or your phone's notes app, to jot readings down as you go\n\n" +
      "Please use the same thermometer each time and measure your temperature the same way each day — under the tongue is preferred.\n\n" +
      "Each day, you'll record three readings: immediately on waking (before getting up, eating, drinking, showering or exercising), approximately 30 minutes after breakfast, and 5–10 minutes after your usual exercise or movement for the day.\n\n" +
      "Please do not use an Oura Ring, smartwatch or other wearable device for these readings. Wearable devices estimate temperature from skin sensors, which are affected by room temperature, bedding, clothing and blood flow — they reflect surface temperature trends rather than true core body temperature. An oral thermometer gives a much more accurate and consistent reading for the patterns Dr Jen is assessing, so please use the same digital oral thermometer for all 14 days. Consistency matters just as much as accuracy here, since we're looking for changes and trends over time rather than a single number.\n\n" +
      "Please also note, on any day it applies: if you're unwell with a fever, if you slept particularly poorly, if you're menstruating (as temperature naturally changes across the cycle), or anything unusual that day such as travel, significant stress or alcohol.\n\n" +
      "This is a lot of information to take in — please reach out to Dr Jen if you need assistance at any point.",
    fields: [],
  },
  dayStep(1),
  dayStep(2),
  dayStep(3),
  dayStep(4),
  dayStep(5),
  dayStep(6),
  dayStep(7),
  dayStep(8),
  dayStep(9),
  dayStep(10),
  dayStep(11),
  dayStep(12),
  dayStep(13),
  dayStep(14),
];