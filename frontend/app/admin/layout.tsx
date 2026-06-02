export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Spacer mobile: compensa o top bar fixo do Sidebar (h-14 = 56px) */}
      <div className="md:hidden h-14" aria-hidden="true" />
      {children}
    </div>
  );
}
