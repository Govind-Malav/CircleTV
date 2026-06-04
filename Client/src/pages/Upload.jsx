import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { uploadVideo } from '../store/videoSlice';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { VIDEO_CATEGORIES, VIDEO_VISIBILITY, MAX_VIDEO_SIZE, MAX_THUMBNAIL_SIZE } from '../utils/constants';
import { formatFileSize } from '../utils/formatters';

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1); // 1=file, 2=details

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'public',
    tags: '',
  });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      if (file.size > MAX_VIDEO_SIZE) { toast.error('Video must be under 500MB'); return; }
      setVideo(file);
      if (!form.title) setForm(f => ({ ...f, title: file.name.replace(/\.[^/.]+$/, '') }));
      setStep(2);
    } else { toast.error('Please drop a valid video file'); }
  }, [form.title]);

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE) { toast.error('Video must be under 500MB'); return; }
    setVideo(file);
    if (!form.title) setForm(f => ({ ...f, title: file.name.replace(/\.[^/.]+$/, '') }));
    setStep(2);
  };

  const handleThumbFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_THUMBNAIL_SIZE) { toast.error('Thumbnail must be under 5MB'); return; }
    setThumbnail(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) { toast.error('Please select a video'); return; }
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.category) { toast.error('Please select a category'); return; }

    const formData = new FormData();
    formData.append('video', video);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('visibility', form.visibility);
    if (form.tags) formData.append('tags', form.tags);

    setUploading(true);
    try {
      const result = await dispatch(uploadVideo(formData)).unwrap();
      toast.success('Video uploaded successfully!');
      navigate(`/watch/${result._id}`);
    } catch (err) {
      toast.error(err || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Upload video</h1>
        <p className="text-gray-400 mb-8">Share your content with the world</p>

        {/* Step 1: File drop zone */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => videoRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
              dragging ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-900'
            }`}
          >
            <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoFile} className="hidden" />
            <div className="w-20 h-20 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Drag & drop your video here</h3>
            <p className="text-gray-400 text-sm mb-4">or click to browse</p>
            <p className="text-xs text-gray-500">MP4, WebM, MKV up to 500MB</p>
          </motion.div>
        )}

        {/* Step 2: Details form */}
        {step === 2 && (
          <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: form fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Video file info */}
              {video && (
                <div className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                  <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{video.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(video.size)}</p>
                  </div>
                  <button type="button" onClick={() => { setVideo(null); setStep(1); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Title <span className="text-red-400">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} maxLength={100} placeholder="Enter video title"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
                <div className="flex justify-end"><span className="text-xs text-gray-500">{form.title.length}/100</span></div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={5} maxLength={5000} placeholder="Describe your video..."
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors resize-none" />
              </div>

              {/* Category + Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">Category <span className="text-red-400">*</span></label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors">
                    <option value="">Select...</option>
                    {VIDEO_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-300">Visibility</label>
                  <select value={form.visibility} onChange={e => setForm(f => ({...f, visibility: e.target.value}))}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors">
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">Tags</label>
                <input type="text" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="gaming, tutorial, vlog (comma-separated)"
                  className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors" />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setStep(1); setVideo(null); }} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors">
                  Back
                </button>
                <button type="submit" disabled={uploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25">
                  {uploading ? (<><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Uploading...</>) : 'Publish video'}
                </button>
              </div>
            </div>

            {/* Right: Thumbnail */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">Thumbnail</label>
              <div onClick={() => thumbRef.current?.click()} className="relative aspect-video bg-gray-900 border border-gray-700 rounded-xl overflow-hidden cursor-pointer hover:border-violet-500 transition-colors group">
                <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbFile} className="hidden" />
                {thumbPreview ? (
                  <img src={thumbPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 group-hover:text-violet-400 transition-colors">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">Upload thumbnail</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Recommended: 1280x720px, max 5MB</p>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Upload;
