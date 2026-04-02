export default function AdLoading() {
  return (
    <div className="flex flex-col h-screen bg-background animate-pulse overflow-hidden">
      <div className="w-full pt-[100%] bg-muted" />
      <div className="flex gap-2 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-16 h-16 bg-muted rounded-lg shrink-0" />
        ))}
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
