export default function DashboardPage() {
  return (
    <section className="space-y-md">
      <div className="space-y-sm">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand">
          Dashboard
        </p>
        <h1 className="font-heading text-3xl font-semibold text-text-strong">
          Authenticated content area
        </h1>
        <p className="max-w-2xl text-base text-text-soft">
          This page sits inside the authenticated shell layout and uses the shared
          header, sidebar slot, and content container.
        </p>
      </div>
    </section>
  );
}
