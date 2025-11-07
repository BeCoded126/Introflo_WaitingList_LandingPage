import FacilityCard from "@/components/FacilityCard";
import { getFacilityMatches, getFacilityById } from "@/lib/api";
import { mockMatches } from "@/lib/mockData";
import type { Facility, Match } from "@/types";

export default async function MatchesPage() {
  const matchData = await getFacilityMatches();

  // Use mock data in dev when no real data available
  if (!matchData || matchData.length === 0) {
    const isDev = process.env.NODE_ENV !== "production";
    const matches = isDev ? mockMatches : [];

    return (
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Your Matches
            </h1>
            {isDev && matches.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Showing demo data • Configure Supabase to see real matches
              </p>
            )}
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <div key={match.id} className="relative">
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {Math.round(match.score * 100)}% Match
                      </span>
                    </div>
                    <FacilityCard facility={match.facility as Facility} />
                  </div>
                ))}

                {matches.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">
                      No matches yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Complete your profile to start seeing matches.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const matches: (Match & { facility: Facility | null })[] = await Promise.all(
    (matchData || []).map(async (m: any) => {
      // Try to resolve matched facility; if schema differs, fall back gracefully
      const facilityId = m.matchedWith || m.facilityId || m.facility_id || null;
      const facility = facilityId ? await getFacilityById(facilityId) : null;
      return { ...m, facility } as any;
    })
  );

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Your Matches
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matches.map((match) => (
                <div key={match.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {Math.round(match.score * 100)}% Match
                    </span>
                  </div>
                  {match.facility ? (
                    <FacilityCard
                      facility={match.facility as Facility}
                      onConnect={() => {
                        // Handle connect action
                        console.log(
                          "Connect with facility:",
                          (match.facility as Facility).id
                        );
                      }}
                    />
                  ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-sm text-gray-500">
                      Facility details unavailable.
                    </div>
                  )}
                </div>
              ))}

              {matches.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    No matches yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Complete your profile to start seeing matches.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
