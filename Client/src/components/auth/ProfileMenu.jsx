import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser, selectUser } from '../../store/authSlice';

const ProfileMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-800 py-1 z-50">
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-sm text-white font-medium">{user?.name}</p>
        <p className="text-xs text-gray-400">{user?.email}</p>
      </div>
      
      <Link
        to={`/channel/${user?._id}`}
        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
        onClick={onClose}
      >
        Your Channel
      </Link>
      
      <Link
        to="/settings"
        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
        onClick={onClose}
      >
        Settings
      </Link>
      
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-gray-800"
      >
        Sign Out
      </button>
    </div>
  );
};

export default ProfileMenu;