import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDirectChat, createGroupChat } from '../../store/chatSlice';
import Modal from '../common/Modal';

const NewChatModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: select type, 2: select users, 3: group details
  const [chatType, setChatType] = useState('direct'); // 'direct' or 'group'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  
  const dispatch = useDispatch();
  const users = useSelector(state => state.user?.suggestedUsers || []);
  const currentUser = useSelector(state => state.auth.user);
  
  // Filter out current user and already selected users
  const filteredUsers = users.filter(u => 
    u._id !== currentUser?._id &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.toLowerCase()))
  );
  
  const handleUserSelect = (user) => {
    if (chatType === 'direct') {
      setSelectedUsers([user]);
      setStep(3); // Skip to creation for DM
    } else {
      if (selectedUsers.includes(user)) {
        setSelectedUsers(selectedUsers.filter(u => u !== user));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };
  
  const handleCreate = () => {
    if (chatType === 'direct' && selectedUsers.length === 1) {
      dispatch(createDirectChat(selectedUsers[0]._id));
      onClose();
    } else if (chatType === 'group' && selectedUsers.length > 0 && groupName) {
      dispatch(createGroupChat({
        name: groupName,
        participants: selectedUsers.map(u => u._id)
      }));
      onClose();
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose chat type</h3>
            
            <button
              onClick={() => {
                setChatType('direct');
                setStep(2);
              }}
              className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition"
            >
              <h4 className="font-medium">Direct Message</h4>
              <p className="text-sm text-gray-400">Chat privately with one person</p>
            </button>
            
            <button
              onClick={() => {
                setChatType('group');
                setStep(2);
              }}
              className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition"
            >
              <h4 className="font-medium">Group Chat</h4>
              <p className="text-sm text-gray-400">Chat with multiple people</p>
            </button>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {chatType === 'direct' ? 'Select a user' : 'Select users'}
            </h3>
            
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-custom"
            />
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                    ${selectedUsers.includes(user) 
                      ? 'bg-primary bg-opacity-20 border border-primary' 
                      : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                  {selectedUsers.includes(user) && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              ))}
            </div>
            
            {chatType === 'group' && selectedUsers.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="btn-primary w-full"
              >
                Next
              </button>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Group details</h3>
            
            <div>
              <label className="input-label">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Gaming Squad"
                className="input-custom"
              />
            </div>
            
            <div>
              <label className="input-label">Selected members ({selectedUsers.length})</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map(user => (
                  <span
                    key={user._id}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {user.name}
                    <button
                      onClick={() => setSelectedUsers(selectedUsers.filter(u => u !== user))}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleCreate}
              disabled={!groupName}
              className="btn-primary w-full"
            >
              Create Group
            </button>
          </div>
        );
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Chat">
      <div className="p-6">
        {renderStep()}
        
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        )}
      </div>
    </Modal>
  );
};

export default NewChatModal;