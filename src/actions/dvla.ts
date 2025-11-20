"use server";
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
  motStatus?: string;
  artEndDate?: string;
};

export async function enquiryVehicle(
  registrationNumber: string
): Promise<VehicleEnquiryResponse> {
  if (!registrationNumber) {
    throw new Error("Registration number is required.");
  }

  const apiKey = process.env.DVLA_API_KEY;
  const apiUrl = process.env.DVLA_API;
  console.log(apiKey, apiUrl,registrationNumber);
  if (!apiKey || !apiUrl) {
    throw new Error("DVLA API configuration missing in environment variables.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ registrationNumber }),
  });
  console.log("response :", response);
  const raw = await response.text();

  if (!response.ok) {
    try {
      const parsed = JSON.parse(raw);

      // Handle DVLA "Vehicle Not Found"
      if (parsed?.errors?.[0]?.code === "404") {
        throw new Error("Vehicle not found in DVLA records.");
      }

      throw new Error(
        parsed?.error || `DVLA lookup failed: ${response.statusText}`
      );
    } catch {
      throw new Error(
        raw
          ? `DVLA lookup failed: ${raw}`
          : `DVLA lookup failed: ${response.statusText}`
      );
    }
  }

  try {
    return JSON.parse(raw) as VehicleEnquiryResponse;
  } catch {
    throw new Error(
      raw
        ? `Unable to parse DVLA response: ${raw}`
        : "Unable to parse DVLA response."
    );
  }
}
