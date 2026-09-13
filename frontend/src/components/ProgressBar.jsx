const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Progress
        </span>

        <span className="text-sm font-semibold text-slate-700">
          {progress}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;