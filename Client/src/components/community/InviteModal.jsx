import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInvite, selectInvites } from '../../store/communitySlice';
import Modal from '../common/Modal';
import { 
  DocumentDuplicateIcon,
  LinkIcon,
  UserPlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const InviteModal = ({ community, isOpen, onClose }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [expiresIn, setExpiresIn] = useState('7d');
  const [maxUses, setMaxUses] = useState('unlimited');
  const [copied, setCopied] = useState(false);
  
  const dispatch = useDispatch();
  const invites = useSelector(state => selectInvites(state, community?._id));
  
  useEffect(() => {
    if (isOpen && community) {
      generateInvite();
    }
  }, [isOpen, community]);
  
  const generateInvite = () => {
    const expiresMap = {
      '1h': 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    
    const maxUsesMap = {
      '1': 1,
      '5': 5,
      '10': 10,
      '25': 25,
      'unlimited': 0
    };
    
    const link = `${window.location.origin}/invite/${community?._id}?expires=${expiresIn}&uses=${maxUses}`;
    setInviteLink(link);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCreateNew = () => {
    generateInvite();
  };
  
  const getExpiryText = (invite) => {
    if (invite.expiresAt) {
      const days = Math.ceil((new Date(invite.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
      return `${days} days left`;
    }
    return 'Never expires';
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invite to ${community?.name}`}>
      <div className="p-6">
        {/* Current Invite Link */}
        <div className="mb-6">
          <label className="input-label mb-2 block">Invite Link</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 truncate">
              {inviteLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              title="Copy Link"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-success mt-1">Copied to clipboard!</p>
          )}
        </div>
        
        {/* Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-white">Link Settings</h3>
          
          <div>
            <label className="input-label">Expires After</label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="input-custom"
            >
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
          
          <div>
            <label className="input-label">Max Uses</label>
            <select
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="input-custom"
            >
              <option value="1">1 use</option>
              <option value="5">5 uses</option>
              <option value="10">10 uses</option>
              <option value="25">25 uses</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
          
          <button
            onClick={handleCreateNew}
            className="btn-secondary w-full"
          >
            Generate New Link
          </button>
        </div>
        
        {/* Recent Invites */}
        {invites.length > 0 && (
          <div>
            <h3 className="font-semibold text-white mb-3">Recent Invites</h3>
            <div className="space-y-2">
              {invites.slice(0, 3).map(invite => (
                <div key={invite._id} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 truncate max-w-[150px]">
                      {invite.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <UserPlusIcon className="w-3 h-3" />
                      <span>{invite.uses || 0}/{invite.maxUses || '∞'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <ClockIcon className="w-3 h-3" />
                      <span>{getExpiryText(invite)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-800 flex justify-end">
        <button onClick={onClose} className="btn-primary">
          Done
        </button>
      </div>
    </Modal>
  );
};

export default InviteModal;