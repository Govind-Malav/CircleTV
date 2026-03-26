import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMemberRole, selectMembersByCommunityId } from '../../store/communitySlice';
import Modal from '../common/Modal';
import { 
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';

const RoleManager = ({ community, isOpen, onClose }) => {
  const [roles, setRoles] = useState([
    { id: 'admin', name: 'Admin', color: '#f59e0b', permissions: ['all'] },
    { id: 'moderator', name: 'Moderator', color: '#3b82f6', permissions: ['manage_channels', 'kick_members', 'manage_messages'] },
    { id: 'member', name: 'Member', color: '#6b7280', permissions: ['send_messages', 'read_channels'] }
  ]);
  const [editingRole, setEditingRole] = useState(null);
  const [showCreateRole, setShowCreateRole] = useState(false);
  
  const dispatch = useDispatch();
  const members = useSelector(state => selectMembersByCommunityId(state, community?._id));
  
  const permissionsList = [
    { id: 'all', name: 'All Permissions', icon: '👑' },
    { id: 'manage_channels', name: 'Manage Channels', icon: '📁' },
    { id: 'manage_roles', name: 'Manage Roles', icon: '🎭' },
    { id: 'kick_members', name: 'Kick Members', icon: '👢' },
    { id: 'ban_members', name: 'Ban Members', icon: '🔨' },
    { id: 'manage_messages', name: 'Manage Messages', icon: '✏️' },
    { id: 'send_messages', name: 'Send Messages', icon: '💬' },
    { id: 'read_channels', name: 'Read Channels', icon: '👁️' },
    { id: 'connect_voice', name: 'Connect to Voice', icon: '🎤' },
    { id: 'speak_voice', name: 'Speak in Voice', icon: '🔊' },
    { id: 'mute_members', name: 'Mute Members', icon: '🔇' },
    { id: 'create_invites', name: 'Create Invites', icon: '🔗' }
  ];
  
  const getMembersCount = (roleId) => {
    return members.filter(m => m.role === roleId).length;
  };
  
  const handleCreateRole = (newRole) => {
    setRoles([...roles, { ...newRole, id: Date.now().toString() }]);
    setShowCreateRole(false);
  };
  
  const handleDeleteRole = (roleId) => {
    if (roleId === 'admin' || roleId === 'moderator' || roleId === 'member') {
      alert('Cannot delete default roles');
      return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
  };
  
  const handleUpdateRole = (roleId, updates) => {
    setRoles(roles.map(r => r.id === roleId ? { ...r, ...updates } : r));
    setEditingRole(null);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Role Manager">
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {/* Existing Roles */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Server Roles</h3>
            <button
              onClick={() => setShowCreateRole(true)}
              className="flex items-center gap-1 text-sm text-primary hover:text-blue-400"
            >
              <PlusIcon className="w-4 h-4" />
              Create Role
            </button>
          </div>
          
          {roles.map(role => (
            <div key={role.id} className="bg-gray-800 rounded-lg p-3">
              {editingRole === role.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    defaultValue={role.name}
                    className="input-custom text-sm"
                    placeholder="Role name"
                    id={`role-name-${role.id}`}
                  />
                  <input
                    type="color"
                    defaultValue={role.color}
                    className="w-full h-10 rounded bg-gray-700"
                    id={`role-color-${role.id}`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newName = document.getElementById(`role-name-${role.id}`).value;
                        const newColor = document.getElementById(`role-color-${role.id}`).value;
                        handleUpdateRole(role.id, { name: newName, color: newColor });
                      }}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingRole(null)}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className="font-medium text-white">{role.name}</span>
                    <span className="text-xs text-gray-400">
                      {getMembersCount(role.id)} members
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {role.id !== 'admin' && role.id !== 'moderator' && role.id !== 'member' && (
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingRole(role.id)}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Permissions */}
              {role.permissions && role.permissions[0] !== 'all' && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map(perm => {
                      const permInfo = permissionsList.find(p => p.id === perm);
                      return permInfo && (
                        <span key={perm} className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                          {permInfo.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Create Role Modal */}
        {showCreateRole && (
          <CreateRoleModal
            onClose={() => setShowCreateRole(false)}
            onCreate={handleCreateRole}
            permissionsList={permissionsList}
          />
        )}
      </div>
    </Modal>
  );
};

// Sub-component for creating new role
const CreateRoleModal = ({ onClose, onCreate, permissionsList }) => {
  const [roleName, setRoleName] = useState('');
  const [roleColor, setRoleColor] = useState('#5865F2');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  
  const handleCreate = () => {
    if (roleName.trim()) {
      onCreate({
        name: roleName,
        color: roleColor,
        permissions: selectedPermissions
      });
      onClose();
    }
  };
  
  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Create New Role</h3>
        
        <div className="space-y-4">
          <div>
            <label className="input-label">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="input-custom"
              placeholder="e.g., Event Manager"
            />
          </div>
          
          <div>
            <label className="input-label">Role Color</label>
            <input
              type="color"
              value={roleColor}
              onChange={(e) => setRoleColor(e.target.value)}
              className="w-full h-10 rounded bg-gray-700"
            />
          </div>
          
          <div>
            <label className="input-label">Permissions</label>
            <div className="max-h-48 overflow-y-auto space-y-2 mt-2">
              {permissionsList.filter(p => p.id !== 'all').map(perm => (
                <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-gray-300">{perm.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">
            Cancel
          </button>
          <button onClick={handleCreate} className="btn-primary">
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleManager;