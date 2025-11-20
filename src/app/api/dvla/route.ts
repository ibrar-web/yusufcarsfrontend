import { NextResponse } from "next/server";

const DVLA_API_URL =
  process.env.DVLA_API ??
  "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";
const DVLA_API_KEY = process.env.DVLA_API_KEY;

export async function POST(request: Request) {
  if (!DVLA_API_KEY) {
    return NextResponse.json(
      { error: "DVLA integration is not configured." },
      { status: 500 }
    );
  }

  const { registrationNumber } = await request.json().catch(() => ({}));
  if (!registrationNumber || typeof registrationNumber !== "string") {
    return NextResponse.json(
      { error: "registrationNumber is required." },
      { status: 400 }
    );
  }

  try {
    const dvlaResponse = await fetch(DVLA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DVLA_API_KEY,
      },
      body: JSON.stringify({ registrationNumber }),
      cache: "no-store",
    });

    if (!dvlaResponse.ok) {
      const message = await dvlaResponse.text().catch(() => dvlaResponse.statusText);
      return NextResponse.json(
        { error: message || "Failed to contact DVLA." },
        { status: dvlaResponse.status }
      );
    }

    const data = await dvlaResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while contacting DVLA.",
      },
      { status: 500 }
    );
  }
}
