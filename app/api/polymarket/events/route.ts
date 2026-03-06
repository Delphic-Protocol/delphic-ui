import { NextRequest, NextResponse } from "next/server";

const POLYMARKET_API_URL = process.env.NEXT_PUBLIC_POLYMARKET_GAMMA_API_URL;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user = searchParams.get("user");

  if (!user) {
    return NextResponse.json(
      { error: "User parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${POLYMARKET_API_URL}/events?user=${user}`
    );

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }

    const data = await response.json();

    // Ensure we return an array and filter out invalid entries
    const events = Array.isArray(data) ? data : [];
    const validEvents = events.filter(
      (event: any) =>
        event &&
        event.id &&
        event.timestamp &&
        typeof event.value === 'number' &&
        !isNaN(event.value)
    );

    return NextResponse.json(validEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}