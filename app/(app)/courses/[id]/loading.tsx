export default function CourseDetailLoading() {
  return (
    <article className="space-y-lg">
      <header className="space-y-sm">
        <div className="h-4 w-20 rounded bg-surface-muted" />
        <div className="space-y-sm">
          <div className="h-10 w-2/3 rounded bg-surface-muted" />
          <div className="h-6 w-full max-w-3xl rounded bg-surface-muted" />
        </div>
      </header>

      <div className="space-y-md">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="space-y-sm">
            <div className="h-5 w-full max-w-3xl rounded bg-surface-muted" />
            <div className="h-5 w-full max-w-3xl rounded bg-surface-muted" />
            <div className="h-5 w-5/6 max-w-3xl rounded bg-surface-muted" />
            <div className="h-5 w-2/3 max-w-3xl rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </article>
  );
}
