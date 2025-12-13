import { Suspense } from "react";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import {
  getFacilityServiceAreas,
  getCurrentUser,
  createClient,
} from "@/lib/api";
import { mockServiceAreas } from "@/lib/mockData";

export default async function ServiceAreasPage() {
  const areas = await getFacilityServiceAreas();
  const isDev = process.env.NODE_ENV !== "production";
  const displayAreas = areas.length > 0 ? areas : isDev ? mockServiceAreas : [];

  // Determine a facilityId to associate saves with. Prefer first facility in the user's org.
  const user = await getCurrentUser();
  let facilityId: string | undefined = undefined;
  if (user?.org_id) {
    const supabase = await createClient();
    const { data: facilities } = await supabase
      .from("facilities")
      .select("id")
      .eq("org_id", user.org_id)
      .limit(1);
    if (facilities && facilities.length > 0) facilityId = facilities[0].id;
  }

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Service Areas
          </h1>
          {isDev && areas.length === 0 && displayAreas.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Showing demo data • Configure Supabase to manage real service
              areas
            </p>
          )}
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <Suspense
                  fallback={
                    <div className="animate-pulse h-[400px] bg-gray-200 rounded-lg" />
                  }
                >
                  <ServiceAreaMap
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                    serviceAreas={displayAreas}
                    facilityId={facilityId}
                    isEditable={true}
                    onAreaChange={async (areas) => {
                      // Handle area changes
                      console.log("Areas updated:", areas);
                    }}
                  />
                </Suspense>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Coverage Details</h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {displayAreas.map((area) => (
                    <li key={area.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-6 w-6 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {area.lat.toFixed(4)}, {area.lng.toFixed(4)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {area.radiusMiles} mile radius
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Edit
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
