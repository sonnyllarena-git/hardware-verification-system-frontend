import ApplicantRow from "./ApplicantRow";

function ApplicantsTable({
  applicants,
  onRefresh,
  onToast,
  onOpenEmailModal,
  onOpenDeleteModal,
  onOpenResultModal,
}) {
  if (applicants.length === 0) {
    return <p className="text-sm text-gray-500">No applicants yet</p>;
  }

  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-gray-500">
          <th className="px-4 py-2 font-medium">Name</th>
          <th className="px-4 py-2 font-medium">Email</th>
          <th className="px-4 py-2 font-medium">Status</th>
          <th className="px-4 py-2 font-medium"></th>
          <th className="px-2 py-2 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {applicants.map((applicant) => (
          <ApplicantRow
            key={applicant.id}
            applicant={applicant}
            onRefresh={onRefresh}
            onToast={onToast}
            onOpenEmailModal={onOpenEmailModal}
            onOpenDeleteModal={onOpenDeleteModal}
            onOpenResultModal={onOpenResultModal}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ApplicantsTable;
