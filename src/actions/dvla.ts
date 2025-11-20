const DVLA_API_URL = process.env.DVLA_API;
const DVLA_API_KEY = process.env.DVLA_API_KEY;

export type VehicleEnquiryRequest = {
  registrationNumber: string;
};

export type VehicleEnquiryResponse = {
  registrationNumber: string;
  make?: string;
  monthOfFirstRegistration?: string;
  yearOfManufacture?: number;
  engineCapacity?: number;
  co2Emissions?: number;
  fuelType?: string;
  markedForExport?: boolean;
  colour?: string;
  typeApproval?: string;
  motExpiryDate?: string;
  dateOfLastV5CIssued?: string;
  wheelplan?: string;
  revenueWeight?: number;
  realDrivingEmissions?: string;
  euroStatus?: string;
  taxStatus?: string;
  taxDueDate?: string;
};

function ensureConfig() {
  if (!DVLA_API_KEY) {
    throw new Error(
      "Missing DVLA_API_KEY; update your environment configuration."
    );
  }
}

export async function enquiryVehicle(
  registrationNumber: string
): Promise<VehicleEnquiryResponse> {
  ensureConfig();

  if (!registrationNumber) {
    throw new Error("Registration number is required.");
  }

  const response = await fetch(DVLA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": DVLA_API_KEY,
    },
    body: JSON.stringify({ registrationNumber }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`DVLA lookup failed: ${message || response.statusText}`);
  }

  return (await response.json()) as VehicleEnquiryResponse;
}
