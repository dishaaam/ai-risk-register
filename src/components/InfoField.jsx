const InfoField = ({ label, value, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      {children ? children : (
        <span className="text-sm font-medium text-gray-800">
          {value || "—"}
        </span>
      )}
    </div>
  );
};

export default InfoField;