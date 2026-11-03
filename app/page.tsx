import { searchListings, type SearchQuery } from "@/lib/listings";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseCount(value: string): number | null | { error: string } {
  if (value.trim() === "") {
    return null;
  }
  if (!/^\d+$/.test(value.trim())) {
    return { error: "Adults and children must be non-negative integers." };
  }
  return Number(value);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const submitted = ["query", "adults", "children", "destination"].some(
    (key) => params[key] !== undefined,
  );
  const queryText = first(params.query);
  const destination = first(params.destination);
  const adultsRaw = first(params.adults);
  const childrenRaw = first(params.children);
  const adultsParsed = parseCount(adultsRaw);
  const childrenParsed = parseCount(childrenRaw);
  const adults = typeof adultsParsed === "object" && adultsParsed ? null : adultsParsed;
  const children = typeof childrenParsed === "object" && childrenParsed ? null : childrenParsed;
  const error =
    typeof adultsParsed === "object" && adultsParsed
      ? adultsParsed.error
      : typeof childrenParsed === "object" && childrenParsed
        ? childrenParsed.error
        : null;

  const search: SearchQuery | null =
    submitted && !error
      ? {
          query: queryText,
          destination,
          adults,
          children,
        }
      : null;
  const response = search ? searchListings(search) : null;
  const apiQuery = new URLSearchParams();
  if (submitted) {
    if (queryText) apiQuery.set("query", queryText);
    if (destination) apiQuery.set("destination", destination);
    if (adultsRaw) apiQuery.set("adults", adultsRaw);
    if (childrenRaw) apiQuery.set("children", childrenRaw);
  }
  const apiHref = apiQuery.size ? `/api/search?${apiQuery.toString()}` : "/api/search";

  return (
    <main className="page">
      <header>
        <h1>UTCP search demo</h1>
        <p>
          A public manual for a mock vacation search. Agents read <code>GET /utcp</code>,
          then call <code>GET /api/search</code> directly. There is no account, token, or
          sign-in on any route.
        </p>
      </header>

      <h2>Try a search</h2>
      <form method="get" action="/">
        <label>
          Query
          <input name="query" defaultValue={submitted ? queryText : "beach"} />
        </label>
        <label>
          Destination
          <input name="destination" defaultValue={submitted ? destination : "Greece"} />
        </label>
        <div className="pair">
          <label>
            Adults
            <input
              name="adults"
              inputMode="numeric"
              defaultValue={submitted ? adultsRaw : "2"}
            />
          </label>
          <label>
            Children
            <input
              name="children"
              inputMode="numeric"
              defaultValue={submitted ? childrenRaw : "1"}
            />
          </label>
        </div>
        <button type="submit">Search listings</button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {response ? (
        <>
          <h2>
            {response.count} listing{response.count === 1 ? "" : "s"}
          </h2>
          <p className="meta">
            Same parameters as JSON: <a href={apiHref}>{apiHref}</a>
          </p>
          <div className="results">
            {response.results.map((listing) => (
              <article key={listing.id} className="result">
                <h3>{listing.title}</h3>
                <p className="meta">
                  {listing.destination}, {listing.country} · up to {listing.maxGuests} guests ·{" "}
                  {listing.nights} nights · ${listing.pricePerNight}/night
                </p>
                <p>{listing.summary}</p>
              </article>
            ))}
            {response.count === 0 ? <p>No listings matched those filters.</p> : null}
          </div>
        </>
      ) : null}

      <h2>Endpoints</h2>
      <section className="endpoints">
        <div>
          <p>
            <a href="/utcp">GET /utcp</a>
          </p>
          <p className="meta">
            UTCP manual (<code>application/json</code>). The tool URL is{" "}
            <code>https://</code> plus this request&apos;s host plus <code>/api/search</code>.
          </p>
        </div>
        <div>
          <p>
            <a href="/api/search?query=beach&destination=Greece&adults=2&children=1">
              GET /api/search?query=beach&amp;destination=Greece&amp;adults=2&amp;children=1
            </a>
          </p>
          <p className="meta">
            Mock listings. <code>query</code> and <code>destination</code> are strings.{" "}
            <code>adults</code> and <code>children</code> are numbers. Omit a parameter to skip
            that filter.
          </p>
        </div>
        <pre>{`curl -s "$ORIGIN/utcp"
curl -s "$ORIGIN/api/search?query=beach&destination=Greece&adults=2&children=1"`}</pre>
      </section>
    </main>
  );
}
