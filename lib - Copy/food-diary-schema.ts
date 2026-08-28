// Single source of truth for the 7-day food diary form.
// Mirrors the shape of lib/intake-schema.ts so it can reuse the same
// Field component and wizard pattern.

export type FoodDiaryFieldType = "text" | "date" | "textarea";

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

export const BASE_DAY_COUNT = 7;

export const dayStep = (dayNumber: number): FoodDiaryStep => ({
  id: `day${dayNumber}`,
  title: `Day ${dayNumber}`,
  intro: "Please list any food or drinks you consumed during the day in the corresponding area.",
  fields: [
    { key: `day${dayNumber}.date`, label: "Date", type: "date" },
    { key: `day${dayNumber}.breakfastTime`, label: "Breakfast — time", type: "text" },
    { key: `day${dayNumber}.breakfast`, label: "Breakfast", type: "textarea" },
    { key: `day${dayNumber}.lunchTime`, label: "Lunch — time", type: "text" },
    { key: `day${dayNumber}.lunch`, label: "Lunch", type: "textarea" },
    { key: `day${dayNumber}.dinnerTime`, label: "Dinner — time", type: "text" },
    { key: `day${dayNumber}.dinner`, label: "Dinner", type: "textarea" },
    { key: `day${dayNumber}.snacksTime`, label: "Snacks — time(s)", type: "text" },
    { key: `day${dayNumber}.snacks`, label: "Snacks", type: "textarea" },
    { key: `day${dayNumber}.drinksTime`, label: "Drinks — time(s)", type: "text" },
    { key: `day${dayNumber}.drinks`, label: "Drinks", type: "textarea" },
    {
      key: `day${dayNumber}.additionalNotes`,
      label: "Anything else you'd like to add about this day?",
      helper: "Use this space for extra detail that didn't fit above — more meals, second helpings, exact quantities, or anything else worth noting.",
      type: "textarea",
    },
  ],
});

export const FOOD_DIARY_STEPS: FoodDiaryStep[] = [
  {
    id: "welcome",
    title: "Seven Days of Meals",
    intro:
      "On the next pages, please track your meals, snacks and drinks for at least seven days.\n\n" +
      "The more detail and information you can provide for our team, the better! If seven days doesn't feel like enough, you can add extra days at the end.",
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
  ...Array.from({ length: BASE_DAY_COUNT }, (_, i) => dayStep(i + 1)),
];