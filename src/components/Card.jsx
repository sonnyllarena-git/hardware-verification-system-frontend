function Card({ label, value, valueClassName = "text-gray-900", icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-6 py-4">
      {Icon && <Icon className="h-6 w-6 text-gray-400" />}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-semibold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}

export default Card;
