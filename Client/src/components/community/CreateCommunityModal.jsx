import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createCommunity } from '../../store/communitySlice';
import Modal from '../common/Modal';

const CreateCommunityModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    icon: null,
    banner: null
  });
  const [iconPreview, setIconPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const dispatch = useDispatch();
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, icon: file });
      setIconPreview(URL.createObjectURL(file));
    }
  };
  
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, banner: file });
      setBannerPreview(URL.createObjectURL(file));
    }
  };
  
  const handleCreate = () => {
    const communityData = new FormData();
    communityData.append('name', formData.name);
    communityData.append('description', formData.description);
    communityData.append('type', formData.type);
    if (formData.icon) communityData.append('icon', formData.icon);
    if (formData.banner) communityData.append('banner', formData.banner);
    
    dispatch(createCommunity(communityData));
    onClose();
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create your community</h3>
            
            <div>
              <label className="input-label">Community Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-custom"
                placeholder="e.g., Gaming Squad"
                maxLength="50"
              />
            </div>
            
            <div>
              <label className="input-label">Description (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-custom h-24"
                placeholder="Tell people what your community is about..."
                maxLength="200"
              />
            </div>
            
            <div>
              <label className="input-label">Community Type</label>
              <div className="space-y-2 mt-2">
                <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="public"
                    checked={formData.type === 'public'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <div>
                    <p className="font-medium">Public</p>
                    <p className="text-xs text-gray-400">Anyone can join and see content</p>
                  </div>
                </label>
                
                <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="private"
                    checked={formData.type === 'private'}
                    onChange={handleInputChange}
                    className="text-primary"
                  />
                  <div>
                    <p className="font-medium">Private</p>
                    <p className="text-xs text-gray-400">Invite only. Content hidden from non-members</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customize your community</h3>
            
            {/* Icon Upload */}
            <div>
              <label className="input-label">Community Icon</label>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-20 h-20 bg-gray-800 rounded-full overflow-hidden">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Icon preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600">
                      {formData.name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    id="icon-upload"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="icon-upload"
                    className="btn-secondary cursor-pointer"
                  >
                    Upload Icon
                  </label>
                  <p className="text-xs text-gray-400 mt-1">Recommended: 512x512px</p>
                </div>
              </div>
            </div>
            
            {/* Banner Upload */}
            <div>
              <label className="input-label">Community Banner</label>
              <div className="mt-2">
                <div className="h-24 bg-gray-800 rounded-lg overflow-hidden mb-2">
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      Banner Preview
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="banner-upload"
                  accept="image/*"
                  onChange={handleBannerChange}
                  className="hidden"
                />
                <label
                  htmlFor="banner-upload"
                  className="btn-secondary cursor-pointer inline-block"
                >
                  Upload Banner
                </label>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Community">
      <div className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-primary' : 'bg-gray-700'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-primary text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
          </div>
        </div>
        
        {renderStep()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Back
            </button>
          )}
          
          {step < 2 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!formData.name}
              className="btn-primary ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={!formData.name}
              className="btn-primary ml-auto"
            >
              Create Community
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateCommunityModal;