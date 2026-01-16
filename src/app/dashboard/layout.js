import DashboardSidebar from '../../components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />

      <div className="flex-1 min-w-0 lg:pl-4">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="lg:hidden h-4" />
          {children}
        </div>
      </div>
    </div>
  );
}