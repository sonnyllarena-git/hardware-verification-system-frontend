import { Monitor, Apple } from "lucide-react";

const DOWNLOAD_OPTIONS = [
  {
    key: "windows",
    label: "Windows",
    icon: Monitor,
    fileName: "Hardware_Checker.exe",
    worksOn: "Works on: Windows 10, 11",
  },
  {
    key: "macos",
    label: "Macbook",
    icon: Apple,
    fileName: "Hardware_Checker.dmg",
    worksOn: "Works on: macOS 12+",
  },
];

function DownloadPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Select Your Operating System</h1>
      <p className="mb-6 text-sm text-gray-500">Download the version for your computer.</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DOWNLOAD_OPTIONS.map((option) => (
          <div
            key={option.key}
            className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-8 text-center"
          >
            <option.icon className="h-12 w-12 text-gray-700" />
            <p className="text-lg font-semibold text-gray-900">{option.label}</p>
            <p className="font-mono text-sm text-gray-600">{option.fileName}</p>
            <p className="text-sm text-gray-500">{option.worksOn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DownloadPage;
