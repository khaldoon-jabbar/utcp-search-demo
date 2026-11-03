import { NextRequest, NextResponse } from "next/server";
import { searchListings, type SearchQuery } from "@/lib/listings";

export const dynamic = "force-dynamic";

function parseCount(
  value: string | null,
  name: string,
): number | null | { error: string } {
  if (value === null || value.trim() === "") {
    return null;
  }
  if (!/^\d+$/.test(value.trim())) {
    return { error: `${name} must be a non-negative integer` };
  }
  return Number(value);
}

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const adults = parseCount(params.get("adults"), "adults");
  const children = parseCount(params.get("children"), "children");

  if (adults && typeof adults === "object") {
    return NextResponse.json({ error: adults.error }, { status: 400 });
  }
  if (children && typeof children === "object") {
    return NextResponse.json({ error: children.error }, { status: 400 });
  }

  const query: SearchQuery = {
    query: params.get("query") ?? "",
    adults,
    children,
    destination: params.get("destination") ?? "",
  };

  return NextResponse.json(searchListings(query));
}
