import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchVideos,
  fetchVideoById,
  uploadVideo,
  likeVideo,
  dislikeVideo,
  deleteVideo,
  fetchRecommendedVideos,
  fetchComments,
  addComment,
  setSearchQuery,
  setCategory,
  setSortBy,
  clearCurrentVideo,
  addToHistory,
  clearHistory,
  clearError,
  clearSuccess,
  selectAllVideos,
  selectCurrentVideo,
  selectRecommendedVideos,
  selectVideoComments,
  selectVideoLoading,
  selectVideoUploading,
  selectVideoError,
  selectVideoSuccess,
  selectSearchQuery,
  selectSelectedCategory,
  selectHistory,
  selectHasMore,
  selectCurrentPage,
} from '../store/videoSlice';

/**
 * useVideo — access to video state and all video dispatch actions
 */
const useVideo = () => {
  const dispatch = useDispatch();

  const videos            = useSelector(selectAllVideos);
  const currentVideo      = useSelector(selectCurrentVideo);
  const recommendedVideos = useSelector(selectRecommendedVideos);
  const comments          = useSelector(selectVideoComments);
  const loading           = useSelector(selectVideoLoading);
  const uploading         = useSelector(selectVideoUploading);
  const error             = useSelector(selectVideoError);
  const success           = useSelector(selectVideoSuccess);
  const searchQuery       = useSelector(selectSearchQuery);
  const selectedCategory  = useSelector(selectSelectedCategory);
  const history           = useSelector(selectHistory);
  const hasMore           = useSelector(selectHasMore);
  const currentPage       = useSelector(selectCurrentPage);

  return {
    // State
    videos,
    currentVideo,
    recommendedVideos,
    comments,
    loading,
    uploading,
    error,
    success,
    searchQuery,
    selectedCategory,
    history,
    hasMore,
    currentPage,
    // Actions
    fetchVideos:      useCallback((params) => dispatch(fetchVideos(params)), [dispatch]),
    fetchVideoById:   useCallback((id) => dispatch(fetchVideoById(id)), [dispatch]),
    uploadVideo:      useCallback((data) => dispatch(uploadVideo(data)), [dispatch]),
    likeVideo:        useCallback((id) => dispatch(likeVideo(id)), [dispatch]),
    dislikeVideo:     useCallback((id) => dispatch(dislikeVideo(id)), [dispatch]),
    deleteVideo:      useCallback((id) => dispatch(deleteVideo(id)), [dispatch]),
    fetchRecommended: useCallback((id) => dispatch(fetchRecommendedVideos(id)), [dispatch]),
    fetchComments:    useCallback((id) => dispatch(fetchComments(id)), [dispatch]),
    addComment:       useCallback((data) => dispatch(addComment(data)), [dispatch]),
    setSearchQuery:   useCallback((q) => dispatch(setSearchQuery(q)), [dispatch]),
    setCategory:      useCallback((cat) => dispatch(setCategory(cat)), [dispatch]),
    setSortBy:        useCallback((sort) => dispatch(setSortBy(sort)), [dispatch]),
    clearCurrentVideo: useCallback(() => dispatch(clearCurrentVideo()), [dispatch]),
    addToHistory:     useCallback((video) => dispatch(addToHistory(video)), [dispatch]),
    clearHistory:     useCallback(() => dispatch(clearHistory()), [dispatch]),
    clearError:       useCallback(() => dispatch(clearError()), [dispatch]),
    clearSuccess:     useCallback(() => dispatch(clearSuccess()), [dispatch]),
  };
};

export default useVideo;
export { useVideo };
