import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-100">
      <Navbar />

      <div className="flex w-full">
        <Sidebar />

        <main className="min-h-[calc(100vh-64px)] flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;