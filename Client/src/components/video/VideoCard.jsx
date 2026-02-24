import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { addToHistory } from '../../store/videoSlice';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(addToHistory(video));
    navigate(`/watch/${video._id}`);
  };