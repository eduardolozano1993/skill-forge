export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_hsl(var(--surface-strong))_0%,_hsl(var(--surface-inverse))_100%)] text-text-inverse">
      {children}
    </div>
  );
}
