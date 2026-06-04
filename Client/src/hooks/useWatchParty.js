import { useSelector } from 'react-redux';

/**
 * useWatchParty — access watchParty state from Redux
 */
const useWatchParty = () => {
  const watchPartyState = useSelector((state) => state.watchParty);
  return watchPartyState;
};

export default useWatchParty;
export { useWatchParty };
