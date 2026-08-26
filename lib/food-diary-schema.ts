// Single source of truth for the 7-day food diary form.
// Mirrors the shape of lib/intake-schema.ts so it can reuse the same
// Field component and wizard pattern.

export type FoodDiaryFieldType = "text" | "textarea";

export interface FoodDiaryField {
  key: string;
  label: string;
  helper?: string;
  type: FoodDiaryFieldType;
}

export interface FoodDiaryStep {
  id: string;
  title: string;
  intro?: string;
  fields: FoodDiaryField[];
}

const dayStep = (dayNumber: number): FoodDiaryStep => ({
  id: `day${dayNumber}`,
  title: `Day ${dayNumber}`,
  intro: "Please list any food or drinks you consumed during the day in the corresponding area.",
  fields: [
    { key: `day${dayNumber}.breakfast`, label: "Breakfast", type: "textarea" },
    { key: `day${dayNumber}.lunch`, label: "Lunch", type: "textarea" },
    { key: `day${dayNumber}.dinner`, label: "Dinner", type: "textarea" },
    { key: `day${dayNumber}.snacks`, label: "Snacks", type: "textarea" },
    { key: `day${dayNumber}.drinks`, label: "Drinks", type: "textarea" },
  ],
});

export const FOOD_DIARY_STEPS: FoodDiaryStep[] = [
  {
    id: "welcome",
    title: "Seven Days of Meals",
    intro:
      "In the space below, please track your meals, snacks and drinks from the past seven days.\n\n" +
      "The more detail and information you can provide for our team, the better!",
    fields: [],
  },
  {
    id: "personal",
    title: "Your details",
    fields: [
      { key: "personal.title", label: "Title", type: "text" },
      { key: "personal.name", label: "Name", type: "text" },
      { key: "personal.preferredName", label: "Preferred name", type: "text" },
      { key: "personal.email", label: "Email address", type: "text" },
    ],
  },
  dayStep(1),
  dayStep(2),
  dayStep(3),
  dayStep(4),
  dayStep(5),
  dayStep(6),
  dayStep(7),
];