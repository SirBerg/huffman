import ScrollIndicator from "@/components/scrollIndicator";
import Landing from "@/components/landing";
import HowItWorks from "@/components/howItWorks";
import Theorie from "@/components/theorie";
import History from "@/components/history";
export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
        <ScrollIndicator />
        <Landing />
        <Theorie />
        <HowItWorks />
        <History />
    </div>
  );
}
