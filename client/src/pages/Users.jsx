import { Search, MoreVertical, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllUsers } from "../api/userApi";
import { toast } from "react-hot-toast";
import ViewUserModal from "../components/users/ViewUserModal";
import ChangeRoleModal from "../components/users/ChangeRoleModal";
import ChangeStatusModal from "../components/users/ChangeStatusModal";
import { formatDate } from "../utils/formatDateUtils";

function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewUser, setShowViewUser] = useState(false);
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchUsers() {
    try {
      const response = await getAllUsers({ search, role, status, page, limit });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const errors = error.response?.data?.error;
      const message = error.response?.data?.message;
      if (errors && errors.length > 0) {
        toast.error(errors[0].msg);
      } else if (message) {
        toast.error(message);
      } else {
        toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [search, role, status, page]);

  useEffect(() => {
    setPage(1);
  }, [search, role, status]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage users, roles, and account status.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Role Filter */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">All Roles</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <User size={13} className="text-slate-500" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">All Users</h2>

            <p className="mt-1 text-xs text-slate-400">
              View and manage registered users.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Email
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Joined
                </th>

                <th className="px-5 py-3 text-xs font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center">
                    <p className="text-sm text-slate-500">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {user.name[0].toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {user.name[0].toUpperCase() + user.name.slice(1)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {user._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {user.role[0].toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium ${
                          user.status === "active"
                            ? "text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {user.status[0].toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(openMenu === user._id ? null : user._id)
                          }
                          className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreVertical size={17} />
                        </button>

                        {openMenu === user._id && (
                          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowViewUser(true);
                                setOpenMenu(null);
                              }}
                              type="button"
                              className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                              View User
                            </button>

                            <button
                              onClick={() => {
                                setShowChangeRole(true);
                                setSelectedUser(user);
                                setOpenMenu(null);
                              }}
                              type="button"
                              className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                              Change Role
                            </button>

                            <button
                              onClick={() => {
                                setShowChangeStatus(true);
                                setSelectedUser(user);
                                setOpenMenu(null);
                              }}
                              type="button"
                              className="block w-full px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                            >
                              Change Status
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <p className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showViewUser && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => {
            setShowViewUser(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showChangeRole && selectedUser && (
        <ChangeRoleModal
          user={selectedUser}
          fetchUsers={fetchUsers}
          onClose={() => {
            setShowChangeRole(false);
            setSelectedUser(null);
          }}
        />
      )}
      {showChangeStatus && selectedUser && (
        <ChangeStatusModal
          user={selectedUser}
          fetchUsers={fetchUsers}
          onClose={() => {
            setShowChangeStatus(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

export default Users;
