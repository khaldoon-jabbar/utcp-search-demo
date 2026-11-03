import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Absolute tool URL from the incoming Host header.
 * Always https so the manual is valid on any Vercel domain.
 */
function searchToolUrl(request: NextRequest): string {
  const raw = (request.headers.get("host") ?? "localhost:3000").split(",")[0]?.trim() ?? "";
  const host = /^[A-Za-z0-9.:[\]-]+$/.test(raw) ? raw : "localhost:3000";
  return `https://${host}/api/search`;
}

export function GET(request: NextRequest) {
  const manual = {
    manual_version: "1.0.0",
    utcp_version: "1.0.1",
    info: {
      title: "UTCP Search Demo",
      version: "1.0.0",
      description:
        "Public manual for a mock vacation search. No authentication.",
    },
    tools: [
      {
        name: "search_listings",
        description:
          "Search mock travel and vacation listings by free-text query, destination, and party size. Inputs are sent as the query string of a GET request.",
        tags: ["travel", "search"],
        inputs: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "Free-text search matched against title, summary, place, and tags. Example: beach.",
            },
            adults: {
              type: "number",
              minimum: 0,
              description: "Number of adults. Listings smaller than the party are omitted.",
            },
            children: {
              type: "number",
              minimum: 0,
              description: "Number of children. Counted with adults toward party size.",
            },
            destination: {
              type: "string",
              description:
                "Destination or country substring. Example: Greece.",
            },
          },
          additionalProperties: false,
        },
        outputs: {
          type: "object",
          properties: {
            query: { type: "string" },
            adults: { type: ["number", "null"] },
            children: { type: ["number", "null"] },
            destination: { type: "string" },
            count: { type: "number" },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  destination: { type: "string" },
                  country: { type: "string" },
                  summary: { type: "string" },
                  nights: { type: "number" },
                  pricePerNight: { type: "number" },
                  currency: { type: "string" },
                  maxGuests: { type: "number" },
                },
                required: [
                  "id",
                  "title",
                  "destination",
                  "country",
                  "summary",
                  "nights",
                  "pricePerNight",
                  "currency",
                  "maxGuests",
                ],
              },
            },
          },
          required: ["query", "adults", "children", "destination", "count", "results"],
        },
        tool_call_template: {
          name: "search_listings",
          call_template_type: "http",
          url: searchToolUrl(request),
          http_method: "GET",
          // GET has no body. Leaving body_field unset would default to "body"
          // in UTCP clients and is the wrong mapping. Null sends every input
          // (query, adults, children, destination) on the query string.
          body_field: null,
          header_fields: null,
        },
      },
    ],
  };

  return NextResponse.json(manual, {
    headers: { "Cache-Control": "no-store" },
  });
}
