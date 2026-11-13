// Subscription plans. The SERVER decides the price - never the browser.
export const PLAN_CONFIG = {
  Monthly: { amount: 299, months: 1, propertyLimit: 20 },
  Quarterly: { amount: 599, months: 3, propertyLimit: 80 },
  Yearly: { amount: 2200, months: 12, propertyLimit: 260 },
};

export type PlanType = keyof typeof PLAN_CONFIG;