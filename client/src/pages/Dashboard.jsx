function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <p className="text-slate-500 mt-2">
          Overview of your workspace and activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Total Projects</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">--</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Active Tasks</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">--</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Completed Tasks</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">--</h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">Workspace Activity</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">--</h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
