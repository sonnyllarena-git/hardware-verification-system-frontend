import { useState } from "react";
import Modal from "../Modal";
import { addApplicantsBulk } from "../../services/applicantsService";

// Same pattern as tcp-hardware-check-api/routes/applicants.js's EMAIL_PATTERN — server does the
// authoritative check, this is just a client-side hint before upload.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripQuotes(value) {
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;
}

// Hand-rolled parse (no Papa Parse — not an approved dependency, CLAUDE_Supabase.md §2). Only
// needs to handle a plain 2-column Name,Email file, not embedded commas/quoted CSV edge cases.
function parseCsvRows(text) {
  const lines = text
    .split("\n")
    .map((line) => line.replace(/\r$/, ""))
    .filter((line) => line.trim() !== "");
  if (lines.length < 2) return [];

  return lines
    .slice(1)
    .map((line) => {
      const commaIndex = line.indexOf(",");
      if (commaIndex === -1) return null;
      const name = stripQuotes(line.slice(0, commaIndex).trim());
      const email = stripQuotes(line.slice(commaIndex + 1).trim());
      return name && email ? { name, email } : null;
    })
    .filter(Boolean);
}

function annotateRows(rows) {
  const emailCounts = new Map();
  rows.forEach((row) => {
    const key = row.email.toLowerCase();
    emailCounts.set(key, (emailCounts.get(key) ?? 0) + 1);
  });
  return rows.map((row) => ({
    ...row,
    invalidEmail: !EMAIL_PATTERN.test(row.email),
    duplicate: emailCounts.get(row.email.toLowerCase()) > 1,
  }));
}

function BulkUploadModal({ open, onClose, onUploaded }) {
  const [rows, setRows] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  if (!open) return null;

  const resetAndClose = () => {
    setRows([]);
    setFileError(null);
    setUploadResult(null);
    setBusy(false);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadResult(null);
    setFileError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const parsed = annotateRows(parseCsvRows(String(reader.result ?? "")));
      if (parsed.length === 0) {
        setRows([]);
        setFileError(
          "No valid rows found in this file. Expected a header row followed by Name,Email per applicant.",
        );
      } else {
        setRows(parsed);
      }
    };
    reader.onerror = () => setFileError("Failed to read file.");
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    setBusy(true);
    setFileError(null);
    try {
      const payload = rows.map(({ name, email }) => ({ name, email }));
      const response = await addApplicantsBulk(payload);
      setUploadResult(response);
      if (!response.errors || response.errors.length === 0) {
        onUploaded();
        resetAndClose();
      }
    } catch (err) {
      setFileError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDone = () => {
    onUploaded();
    resetAndClose();
  };

  return (
    <Modal title="Bulk Upload Applicants" onClose={resetAndClose}>
      {!uploadResult ? (
        <>
          <input type="file" accept=".csv" onChange={handleFileChange} className="mb-3 text-sm" />
          {fileError && <p className="mb-3 text-sm text-red-600">{fileError}</p>}
          {rows.length > 0 && (
            <>
              <div className="mb-3 max-h-64 overflow-auto rounded-md border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                      <th className="px-3 py-2 font-medium">Name</th>
                      <th className="px-3 py-2 font-medium">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={`${row.email}-${index}`}
                        className={`border-b border-gray-100 ${
                          row.invalidEmail || row.duplicate ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-900">{row.name}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {row.email}
                          {row.invalidEmail && (
                            <span className="ml-2 text-xs text-red-600">Invalid email</span>
                          )}
                          {row.duplicate && (
                            <span className="ml-2 text-xs text-red-600">Duplicate in file</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={busy}
                  className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "Uploading…" : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="cursor-pointer text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-700">{uploadResult.inserted.length} added</p>
          {uploadResult.errors.length > 0 && (
            <div className="mb-3 max-h-64 overflow-auto rounded-md border border-red-200 bg-red-50 p-3">
              <p className="mb-2 text-sm font-medium text-red-700">
                {uploadResult.errors.length} failed
              </p>
              <ul className="space-y-1 text-sm text-red-700">
                {uploadResult.errors.map((err, index) => (
                  <li key={`${err.email}-${index}`}>
                    {err.name} ({err.email}) — {err.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            onClick={handleDone}
            className="cursor-pointer rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Done
          </button>
        </>
      )}
    </Modal>
  );
}

export default BulkUploadModal;
