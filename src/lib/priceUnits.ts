// Price units a property can be listed in.
// "value" is saved in the database, "label" is shown in forms,
// and "suffix" is shown right after the price (empty for a total price).
export const PRICE_UNITS = [
  { value: "Total", label: "Total", suffix: "" },
  { value: "PerMonth", label: "Per Month", suffix: " /month" },
  { value: "PerSqft", label: "Per Sqft", suffix: " /sqft" },
  { value: "PerSqMeter", label: "Per Sq Meter", suffix: " /sq meter" },
  { value: "PerDismil", label: "Per Dismil", suffix: " /dismil" },
  { value: "PerBiswa", label: "Per Biswa", suffix: " /biswa" },
  { value: "PerBigha", label: "Per Bigha", suffix: " /bigha" },
  { value: "PerGuntha", label: "Per Guntha", suffix: " /guntha" },
  { value: "PerAcre", label: "Per Acre", suffix: " /acre" },
  { value: "PerHectare", label: "Per Hectare", suffix: " /hectare" },
];

export const PRICE_UNIT_VALUES = PRICE_UNITS.map((unit) => unit.value);

// Text shown right after the price, e.g. " /bigha"
export function getPriceSuffix(priceUnit?: string): string {
  return PRICE_UNITS.find((unit) => unit.value === priceUnit)?.suffix ?? "";
}