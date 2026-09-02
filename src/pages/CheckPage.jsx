import { useMemo } from "react";
import tcpLogo from "../tcp logo/TheCreditPros - Orange Navy1.png";

function CheckPage() {
  const { apiKey, name, email } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      apiKey: params.get("apiKey"),
      name: params.get("name"),
      email: params.get("email"),
    };
  }, []);

  const isValid = Boolean(apiKey && name && email);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <img src={tcpLogo} alt="TheCreditPros" className="mx-auto mb-4 h-10 w-auto" />

        {isValid ? (
          <>
            <h1 className="mb-1 text-xl font-semibold text-gray-900">Welcome, {name}!</h1>
            <p className="mb-6 text-sm text-gray-500">{email}</p>
            <div className="mb-4 rounded-md bg-amber-50 p-4 text-left text-sm text-amber-800">
              <p className="mb-1 font-semibold">Before you continue:</p>
              <p>
                Plug in your headset, camera, and internet (ethernet) cable so the checker can
                detect them.
              </p>
            </div>
            <div className="rounded-md bg-gray-50 p-4 text-left text-sm text-gray-600">
              <p className="mb-1 font-semibold text-gray-900">Next steps:</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Open Google Chrome</li>
                <li>Go to the Chrome Web Store and search "TCP Hardware Checker"</li>
                <li>Click "Add to Chrome"</li>
                <li>Click the TCP Hardware Checker icon in your Chrome toolbar to open it</li>
                <li>Review your auto-detected hardware</li>
                <li>Click Submit</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-2 text-xl font-semibold text-red-600">Invalid Link</h1>
            <p className="text-sm text-gray-600">
              This link is missing required information. Please contact HR for a new link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckPage;
