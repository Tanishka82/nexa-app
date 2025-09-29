import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/data/industries";
import OnboardingForm from "../dashboard/_components/onboarding-form";

const OnboardingPage = async () => {
    // Check if user is already onboarded
    const { isOnboarded } = await getUserOnboardingStatus();

    if (isOnboarded) {
        redirect("/dashboard");
    }

  return (
  <main>
    <OnboardingForm industries={industries} />
  </main>
  );
};

export default OnboardingPage;