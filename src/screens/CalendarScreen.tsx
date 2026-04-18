import { HearingCalendar } from "@/components/HearingCalendar";

export function CalendarScreen() {
  return (
    <div className="bg-card border border-line-card rounded-[11px] card-shadow p-5 animate-fade-up">
      <HearingCalendar standalone />
    </div>
  );
}
