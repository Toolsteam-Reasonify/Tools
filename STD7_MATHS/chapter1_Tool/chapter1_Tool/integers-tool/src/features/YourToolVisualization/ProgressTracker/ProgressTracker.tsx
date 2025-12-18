type Props = {
  accuracy: number; // 0-1
  attempts: number;
  avgTimeSec?: number;
};

export default function ProgressTracker({ accuracy, attempts, avgTimeSec }: Props) {
  return (
    <div className="rounded border bg-white p-3 text-sm">
      <div>Accuracy: {(accuracy * 100).toFixed(0)}%</div>
      <div>Attempts: {attempts}</div>
      {avgTimeSec != null && <div>Avg time: {avgTimeSec.toFixed(1)}s</div>}
    </div>
  );
}



