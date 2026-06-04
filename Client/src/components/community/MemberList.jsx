import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { communityAPI } from '../../services/api';
import { COMMUNITY_ROLES } from '../../utils/constants';

const roleColors = {
  owner: 'text-yellow-400',
  admin: 'text-red-400',
  moderator: 'text-violet-400',
  member: 'text-gray-300',
};

const roleBadgeColors = {
  owner: 'bg-yellow-400/10 text-yellow-400',
  admin: 'bg-red-400/10 text-red-400',
  moderator: 'bg-violet-400/10 text-violet-400',
  member: 'hidden',
};

const MemberList = () => {
  const { communityId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) return;
    const load = async () => {
      try {
        const response = await communityAPI.getMembers(communityId);
        setMembers(response.data?.data || []);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [communityId]);

  if (loading) return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-gray-800" />
          <div className="h-3 bg-gray-800 rounded w-24" />
        </div>
      ))}
    </div>
  );

  // Group by role
  const grouped = members.reduce((acc, member) => {
    const role = member.role || 'member';
    if (!acc[role]) acc[role] = [];
    acc[role].push(member);
    return acc;
  }, {});

  const roleOrder = ['owner', 'admin', 'moderator', 'member'];

  return (
    <div className="py-3 px-2">
      {roleOrder.map(role => {
        const group = grouped[role];
        if (!group?.length) return null;
        return (
          <div key={role} className="mb-4">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
              {role}s — {group.length}
            </p>
            {group.map(member => (
              <div
                key={member._id || member.user?._id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <img
                    src={member.user?.avatar || member.avatar || `https://ui-avatars.com/api/?name=${member.user?.username || member.username}&background=7C3AED&color=fff&size=28`}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${roleColors[role] || 'text-gray-300'}`}>
                    {member.user?.username || member.username}
                  </p>
                </div>
                {role !== 'member' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${roleBadgeColors[role]}`}>
                    {role}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;