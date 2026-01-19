import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();

  // Handle Loading/Error State
  if (!insights) {
      return (
          <div className="container mx-auto py-20 text-center">
              <h1 className="text-4xl font-bold mb-4">Generating Insights...</h1>
              <p className="text-muted-foreground mb-8">
                  We are analyzing industry data for you. This may take a few seconds.
              </p>
              {/* Force a refresh button */}
              <a href="/dashboard" className="px-4 py-2 bg-primary text-white rounded-md">
                  Refresh Page
              </a>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-6">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;