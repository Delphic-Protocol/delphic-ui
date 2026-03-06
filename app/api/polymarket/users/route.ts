import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAddress } from "viem";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("users")
      .select("user_address, safe_address")
      .eq("user_address", getAddress(address))
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json({ user: null });
      }
      throw error;
    }

    return NextResponse.json({
      user: {
        address: data.user_address,
        proxyWallet: data.safe_address
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}