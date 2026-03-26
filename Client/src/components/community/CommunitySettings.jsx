import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCommunity, deleteCommunity } from '../../store/communitySlice';
import Modal from '../common/Modal';

const CommunitySettings = ({ community, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: community?.name || '',
    description: community?.description || '',
    type: community?.type || 'public'
  });
  const [iconPreview, setIconPreview] = useState(community?.icon);
  const [bannerPreview, setBannerPreview] = useState(community?.banner);
  const [activeTab, setActiveTab] = useState('general');
  
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const isAdmin = community?.ownerId === currentUser?._id;
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
      setFormData({ ...formData, icon: file });
    }
  };
  
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
      setFormData({ ...formData, banner: file });
    }
  };
  
  const handleSave = () => {
    const updateData = new FormData();
    updateData.append('name', formData.name);
    updateData.append('description', formData.description);
    updateData.append('type', formData.type);
    if (formData.icon) updateData.append('icon', formData.icon);
    if (formData.banner) updateData.append('banner', formData.banner);
    
    dispatch(updateCommunity({ communityId: community._id, data: updateData }));
    onClose();
  };
  
  const handleDelete = () => {
    if (window.confirm('Delete this community? This cannot be undone!')) {
      dispatch(deleteCommunity(community._id));
      onClose();
    }
  };
  
  if (!community) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Community Settings">
      <div className="flex h-[500px]">
        {/* Sidebar */}
        <div className="w-40 border-r border-gray-800 p-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'general' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'roles' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === 'members' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
            }`}
          >
            Members
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mt-4 ${
                activeTab === 'danger' ? 'bg-red-900 text-red-400' : 'text-red-400 hover:bg-red-900'
              }`}
            >
              Danger Zone
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="input-label">Community Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-custom"
                  maxLength="50"
                />
              </div>
              
              <div>
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-custom h-24"
                  maxLength="200"
                />
              </div>
              
              <div>
                <label className="input-label">Community Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="input-custom"
                >
                  <option value="public">Public - Anyone can join</option>
                  <option value="private">Private - Invite only</option>
                </select>
              </div>
              
              <div>
                <label className="input-label">Community Icon</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden">
                    {iconPreview ? (
                      <img src={iconPreview} alt="Icon" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-600">
                        {formData.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="icon-settings"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                  />
                  <label htmlFor="icon-settings" className="btn-secondary cursor-pointer">
                    Change Icon
                  </label>
                </div>
              </div>
              
              <div>
                <label className="input-label">Community Banner</label>
                <div className="h-32 bg-gray-800 rounded-lg overflow-hidden mt-2">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No banner uploaded
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="banner-settings"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                <label htmlFor="banner-settings" className="btn-secondary cursor-pointer mt-2 inline-block">
                  Upload Banner
                </label>
              </div>
            </div>
          )}
          
          {activeTab === 'roles' && (
            <div className="text-center text-gray-400 py-8">
              Role management coming soon...
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="text-center text-gray-400 py-8">
              Member management coming soon...
            </div>
          )}
          
          {activeTab === 'danger' && isAdmin && (
            <div className="space-y-4">
              <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">Delete Community</h3>
                <p className="text-sm text-gray-400 mb-4">
                  This action cannot be undone. All channels, messages, and member data will be permanently deleted.
                </p>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Community
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary">
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default CommunitySettings;