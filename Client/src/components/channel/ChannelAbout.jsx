import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './ChannelAbout.module.css';

const ChannelAbout = ({ channel, channelId }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const isOwner = user?._id === channel?.owner?._id;

  useEffect(() => {
    if (channel) {
      setDescription(channel.description || '');
    }
  }, [channel]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${channelId}/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ description })
      });
      
      if (response.ok) {
        const updatedChannel = await response.json();
        channel.description = updatedChannel.description;
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Joined', value: formatDate(channel?.createdAt) },
    { label: 'Total Views', value: formatNumber(channel?.totalViews || 0) },
    { label: 'Subscribers', value: formatNumber(channel?.subscriberCount || 0) },
    { label: 'Videos', value: formatNumber(channel?.videoCount || 0) }
  ];

  const socialLinks = channel?.socialLinks || [];

  return (
    <div className={styles.channelAbout}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Description</h3>
          {isOwner && !isEditing && (
            <button onClick={() => setIsEditing(true)} className={styles.editBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
              </svg>
              Edit
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className={styles.editForm}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Tell viewers about your channel..."
              className={styles.textarea}
            />
            <div className={styles.formActions}>
              <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={loading} className={styles.saveBtn}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.description}>
            {description ? (
              <p>{description}</p>
            ) : (
              <p className={styles.noDescription}>
                {isOwner 
                  ? 'No description yet. Click edit to add one!' 
                  : 'No description provided.'}
              </p>
            )}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>Channel Statistics</h3>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {socialLinks.length > 0 && (
        <div className={styles.section}>
          <h3>Connect</h3>
          <div className={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                {getSocialIcon(link.platform)}
                <span>{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getSocialIcon = (platform) => {
  switch(platform.toLowerCase()) {
    case 'twitter':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.683-11.5c0-.214-.005-.425-.015-.636A9.936 9.936 0 0024 4.59z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
        </svg>
      );
  }
};

export default ChannelAbout;
