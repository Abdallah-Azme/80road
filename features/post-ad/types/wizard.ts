import { Category } from "@/features/post-ad/services/post-ad.service";

export type WizardStepType =
  | "category"
  | "country"
  | "state"
  | "city"
  | "video"
  | "images"
  | "details"
  | "summary";

export type WizardStep =
  | { type: "category"; data: Category; key: string }
  | { type: "country"; key: string; data?: never }
  | { type: "state"; key: string; data?: never }
  | { type: "city"; key: string; data?: never }
  | { type: "video"; key: string; data?: never }
  | { type: "images"; key: string; data?: never }
  | { type: "details"; key: string; data?: never }
  | { type: "summary"; key: string; data?: never };
