const STATUS_STYLES = {
  PASS: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  FAIL: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  PENDING: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function Badge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export default Badge;
