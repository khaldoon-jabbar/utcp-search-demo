export type Listing = {
  id: string;
  title: string;
  destination: string;
  country: string;
  summary: string;
  nights: number;
  pricePerNight: number;
  currency: "USD";
  maxGuests: number;
};

export type SearchQuery = {
  query: string;
  adults: number | null;
  children: number | null;
  destination: string;
};

export type SearchResponse = SearchQuery & {
  count: number;
  results: Listing[];
};

type CatalogListing = Listing & { tags: string[] };

const CATALOG: CatalogListing[] = [
  {
    id: "santorini-caldera",
    title: "Caldera cliff villa",
    destination: "Santorini",
    country: "Greece",
    summary: "Whitewashed villa above the caldera with a small plunge pool and sunset views. Beach coves are a short drive away.",
    nights: 7,
    pricePerNight: 340,
    currency: "USD",
    maxGuests: 4,
    tags: ["beach", "island", "villa"],
  },
  {
    id: "crete-olive-grove",
    title: "Olive grove house",
    destination: "Chania",
    country: "Greece",
    summary: "Family house in an olive grove, ten minutes from a sandy beach and a harbor town.",
    nights: 7,
    pricePerNight: 180,
    currency: "USD",
    maxGuests: 6,
    tags: ["beach", "family", "island"],
  },
  {
    id: "kyoto-machiya",
    title: "River machiya",
    destination: "Kyoto",
    country: "Japan",
    summary: "Restored wooden townhouse near the Kamo River, walkable to temples and evening markets.",
    nights: 5,
    pricePerNight: 220,
    currency: "USD",
    maxGuests: 4,
    tags: ["city", "culture", "temple"],
  },
  {
    id: "bali-ubud",
    title: "Rice terrace bungalow",
    destination: "Ubud",
    country: "Indonesia",
    summary: "Open-air bungalow facing rice terraces, with a jungle path down to a river pool.",
    nights: 6,
    pricePerNight: 150,
    currency: "USD",
    maxGuests: 3,
    tags: ["jungle", "wellness"],
  },
  {
    id: "amalfi-path",
    title: "Lemon-path apartment",
    destination: "Amalfi",
    country: "Italy",
    summary: "Apartment on a stepped lane above the coast, with a terrace and a beach club a walk below.",
    nights: 5,
    pricePerNight: 290,
    currency: "USD",
    maxGuests: 4,
    tags: ["beach", "coast", "town"],
  },
  {
    id: "banff-cabin",
    title: "Lakeside cabin",
    destination: "Banff",
    country: "Canada",
    summary: "Log cabin near the lake with trail access for day hikes and a wood stove for cold evenings.",
    nights: 4,
    pricePerNight: 260,
    currency: "USD",
    maxGuests: 5,
    tags: ["hiking", "mountains", "cabin"],
  },
  {
    id: "marrakech-riad",
    title: "Medina riad courtyard",
    destination: "Marrakech",
    country: "Morocco",
    summary: "Riad with a tiled courtyard, rooftop breakfast, and a guide to the souks arranged on request.",
    nights: 4,
    pricePerNight: 130,
    currency: "USD",
    maxGuests: 6,
    tags: ["city", "riad", "culture"],
  },
  {
    id: "queenstown-lodge",
    title: "Remarkables lodge room",
    destination: "Queenstown",
    country: "New Zealand",
    summary: "Lodge room looking at the Remarkables, set up for hikers and lake days.",
    nights: 5,
    pricePerNight: 240,
    currency: "USD",
    maxGuests: 2,
    tags: ["hiking", "lake", "adventure"],
  },
  {
    id: "lisbon-alfama",
    title: "Alfama apartment",
    destination: "Lisbon",
    country: "Portugal",
    summary: "Top-floor apartment in Alfama with a tram stop outside and a river view from the kitchen.",
    nights: 4,
    pricePerNight: 160,
    currency: "USD",
    maxGuests: 4,
    tags: ["city", "coast"],
  },
  {
    id: "tulum-casita",
    title: "Cenote casita",
    destination: "Tulum",
    country: "Mexico",
    summary: "Palm casita between the beach road and a freshwater cenote, with bikes for the town.",
    nights: 6,
    pricePerNight: 210,
    currency: "USD",
    maxGuests: 5,
    tags: ["beach", "cenote"],
  },
];

function includesText(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function searchListings(input: SearchQuery): SearchResponse {
  const query = input.query.trim();
  const destination = input.destination.trim();
  const party = (input.adults ?? 0) + (input.children ?? 0);

  const results = CATALOG.filter((listing) => {
    if (party > 0 && listing.maxGuests < party) {
      return false;
    }
    if (destination) {
      const place = `${listing.destination} ${listing.country}`;
      if (!includesText(place, destination)) {
        return false;
      }
    }
    if (query) {
      const haystack = [
        listing.title,
        listing.summary,
        listing.destination,
        listing.country,
        listing.tags.join(" "),
      ].join(" ");
      if (!includesText(haystack, query)) {
        return false;
      }
    }
    return true;
  }).map(({ tags: _tags, ...listing }) => listing);

  return {
    query,
    adults: input.adults,
    children: input.children,
    destination,
    count: results.length,
    results,
  };
}
