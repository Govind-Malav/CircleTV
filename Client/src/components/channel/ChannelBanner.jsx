import React, { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChannelBanner = ({ channel }) => {
  const { user } = useAuth();
  const { updateBanner } = useAuthContext();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const isOwner = user?._id === channel?.owner?._id || user?._id === channel?._id;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Banner must be under 5MB');
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('banner', file);
      await updateBanner(formData);
      toast.success('Banner updated!');
    } catch {
      toast.error('Failed to update banner');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const bannerSrc = preview || channel?.banner;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
      {/* Banner image or gradient fallback */}
      {bannerSrc ? (
        <img
          src={bannerSrc}
          alt="Channel banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)',
          }}
        />
      )}

      {/* Subtle gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Edit banner button (owner only) */}
      {isOwner && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="banner-upload"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full transition-all border border-white/20"
            aria-label="Edit channel banner"
          >
            {uploading ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.829 1.172H7v-2a4 4 0 011.172-2.829L9 13z" />
                </svg>
                Edit banner
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default ChannelBanner;
