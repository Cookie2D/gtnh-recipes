import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
