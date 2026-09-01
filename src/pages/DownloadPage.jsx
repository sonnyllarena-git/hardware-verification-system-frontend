import { Monitor, Apple } from "lucide-react";

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
const DOWNLOAD_URL = `${API_ORIGIN}/downloads/Hardware_Checker.zip`;

function DownloadPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-900">Select Your Operating System</h1>
      <p className="mb-6 text-sm text-gray-500">Download the version for your computer.</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-8 text-center">
          <Monitor className="h-12 w-12 text-gray-700" />
          <p className="text-lg font-semibold text-gray-900">Windows</p>
          <p className="font-mono text-sm text-gray-600">Hardware_Checker.zip</p>
          <p className="text-sm text-gray-500">Works on: Windows 10, 11 · ~31 MB</p>
          <a
            href={DOWNLOAD_URL}
            download="Hardware_Checker.zip"
            className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            Download Now
          </a>
          <div className="mt-4 w-full rounded-md bg-gray-50 p-3 text-left text-sm text-gray-600">
            <p className="mb-1 font-semibold text-gray-900">How to use:</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Get your API key from Settings → &quot;Issue Applicant API Key&quot;</li>
              <li>Extract the zip file</li>
              <li>Run Hardware_Checker.exe</li>
              <li>Paste your API key when prompted</li>
              <li>Results appear in your dashboard</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 p-8 text-center">
          <Apple className="h-12 w-12 text-gray-400" />
          <p className="text-lg font-semibold text-gray-900">Macbook</p>
          <p className="text-sm italic text-gray-500">Coming in Phase 2.2</p>
        </div>
      </div>
    </div>
  );
}

export default DownloadPage;
