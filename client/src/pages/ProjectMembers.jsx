import { Plus, Search, MoreVertical, User } from "lucide-react";
import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import AddMemberModal from "../components/members/AddMemberModal";
import RemoveMemberModal from "../components/members/RemoveMemberModal";

function ProjectMembers() {
  const { id } = useParams();
  const { members, fetchProject } = useOutletContext();
  const [showAddMember, setShowAddMember] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showRemoveMember, setShowRemoveMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState("");
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Members</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage members assigned to this project.
          </p>
        </div>

        <button
          onClick={() => setShowAddMember(true)}
          className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 cursor-pointer"
        >
          <Plus size={17} />
          Add Member
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Table Header */}
        <div className="hidden border-b border-slate-200 px-5 py-4 md:grid md:grid-cols-[2fr_2fr_1fr_40px] md:items-center md:gap-4">
          <p className="text-xs font-medium text-slate-400">Member</p>

          <p className="text-xs font-medium text-slate-400">Email</p>

          <p className="text-xs font-medium text-slate-400">Role</p>

          <span />
        </div>

        {/* Member Rows */}
        <div>
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="border-b border-slate-100 px-5 py-4 last:border-b-0 hover:bg-slate-50 transition"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_2fr_1fr_40px] md:items-center md:gap-4">
                {/* Member */}
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                    <User size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {member.name[0].toUpperCase() + member.name.slice(1)}
                    </p>

                    <p className="text-xs text-slate-400">Project Member</p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs text-slate-600">{member.email}</p>
                </div>

                {/* Role */}
                <div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                    {member.role[0].toUpperCase() + member.role.slice(1)}
                  </span>
                </div>

                {/* More */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(openMenu === member._id ? null : member._id)
                    }
                    className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:block cursor-pointer"
                  >
                    <MoreVertical size={17} />
                  </button>
                  {openMenu === member._id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowRemoveMember(true);
                          setOpenMenu(null);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        Remove Member
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showAddMember && (
        <AddMemberModal
          id={id}
          fetchProject={fetchProject}
          onClose={() => {
            setShowAddMember(false);
          }}
        />
      )}
      {showRemoveMember && (
        <RemoveMemberModal
          id={id}
          fetchProject={fetchProject}
          member={selectedMember}
          onClose={() => {
            (setSelectedMember(null), setShowRemoveMember(false));
          }}
        />
      )}
    </div>
  );
}

export default ProjectMembers;
