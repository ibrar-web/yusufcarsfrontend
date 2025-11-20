"use server";
import { VehicleEnquiryResponse } from "@/types/dvla";

export async function enquiryVehicle(
  registrationNumber: string
): Promise<VehicleEnquiryResponse> {
  if (!registrationNumber) {
    throw new Error("Registration number is required.");
  }

  const apiKey = process.env.DVLA_API_KEY;
  const apiUrl = process.env.DVLA_API;

  if (!apiKey || !apiUrl) {
    throw new Error("System configuration error. Please try again later.");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ registrationNumber }),
  });

  const raw = await response.text();
  console.log("raw :", raw);

  // Handle errors safely
  if (!response.ok) {
    let parsed: any = null;

    try {
      parsed = JSON.parse(raw);
    } catch {
      // JSON can't be parsed → internal provider error, hide it
      throw new Error("Unable to retrieve vehicle details. Please try again later.");
    }

    const firstError = parsed?.errors?.[0];

    // INVALID REG FORMAT
    if (
      firstError?.status === "400" &&
      firstError?.code === "400" &&
      firstError?.detail?.includes("Invalid format")
    ) {
      throw new Error("The registration number format is invalid.");
    }

    // VEHICLE NOT FOUND
    if (firstError?.code === "404") {
      throw new Error("Vehicle information not found for this registration number.");
    }

    // ANY OTHER PROVIDER ERROR → Do NOT expose details
    throw new Error("Unable to retrieve vehicle details at this time. Please try again later.");
  }

  // Handle success response
  try {
    return JSON.parse(raw) as VehicleEnquiryResponse;
  } catch {
    throw new Error("Unexpected response received from the verification service.");
  }
}
