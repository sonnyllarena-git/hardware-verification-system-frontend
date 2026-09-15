import { UserPlus, Link2, Mail, Puzzle, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "1. Add the applicant",
    body: [
      "Go to the Applicants page.",
      "Enter their Name and Email in the top-right fields, then click Add.",
    ],
  },
  {
    icon: Link2,
    title: "2. Generate their link",
    body: [
      "Click Generate link on their row.",
      "This creates a 7-day API key and check-in link, and moves their status to pending.",
    ],
  },
  {
    icon: Mail,
    title: "3. Send them the link",
    body: [
      "Click Email link to open the pre-filled message.",
      "Click Copy to Clipboard, then paste it into Outlook and send it yourself.",
      "Send Email is also in that modal, but real sending isn't turned on yet — use Copy to Clipboard for now.",
    ],
  },
  {
    icon: Puzzle,
    title: "4. Applicant runs the check",
    body: [
      "They plug in a headset, webcam, and ethernet cable first, if those are being tested.",
      "They open the link and follow the instructions already on that page.",
      'In Chrome: menu (⋮) → Extensions → Visit Chrome Web Store → search "TCP Hardware Checker" → Add to Chrome.',
      "They click the extension icon (keeping the check-in tab open) — it auto-fills their name, email, API key, and detected hardware.",
      "They review the specs and click Submit Hardware Check.",
    ],
  },
  {
    icon: CheckCircle2,
    title: "5. See the result",
    body: [
      "Back on Applicants, their row updates to PASS or FAIL.",
      "Click Test Result for the full spec breakdown and which requirements passed or failed.",
      "The Dashboard's counters and chart update automatically too.",
    ],
  },
];

function HelpPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Hardware Check Guide
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        How to run a hardware check end to end, from adding an applicant to seeing their result.
      </p>

      <div className="space-y-4">
        {STEPS.map((step) => (
          <section
            key={step.title}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-3 flex items-center gap-2">
              <step.icon className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {step.title}
              </h2>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
              {step.body.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default HelpPage;
