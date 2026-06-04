import { useSelector } from 'react-redux';

/**
 * useCommunity — access community state from Redux
 */
const useCommunity = () => {
  const communityState = useSelector((state) => state.community);
  return communityState;
};

export default useCommunity;
export { useCommunity };
