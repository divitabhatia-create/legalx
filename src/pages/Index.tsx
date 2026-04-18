import { AppProvider, useApp } from "@/state/AppContext";
import { Topbar } from "@/components/Topbar";
import { Dashboard } from "@/screens/Dashboard";
import { CasesScreen } from "@/screens/CasesScreen";
import { DeadlinesScreen } from "@/screens/DeadlinesScreen";
import { CalendarScreen } from "@/screens/CalendarScreen";
import { CaseDetailScreen } from "@/screens/CaseDetailScreen";
import { CreateCaseModal } from "@/components/CreateCaseModal";

function Router() {
  const { view } = useApp();
  return (
    <main className="max-w-[1480px] mx-auto px-6 py-6">
      {view.name === "dashboard" && <Dashboard />}
      {view.name === "cases" && <CasesScreen />}
      {view.name === "deadlines" && <DeadlinesScreen />}
      {view.name === "calendar" && <CalendarScreen />}
      {view.name === "case" && <CaseDetailScreen id={view.id} />}
    </main>
  );
}

const Index = () => (
  <AppProvider>
    <div className="min-h-screen bg-background">
      <Topbar />
      <Router />
      <CreateCaseModal />
    </div>
  </AppProvider>
);

export default Index;
