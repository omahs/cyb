import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useGetSelectTab(history) {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('swap');

  useEffect(() => {
    const { pathname } = location;
    if (
      pathname.match(/add-liquidity/gm) &&
      pathname.match(/add-liquidity/gm).length > 0
    ) {
      setSelectedTab('add-liquidity');
    } else if (
      pathname.match(/sub-liquidity/gm) &&
      pathname.match(/sub-liquidity/gm).length > 0
    ) {
      setSelectedTab('sub-liquidity');
      history.replace({
        search: '',
      });
    } else if (
      pathname.match(/create-pool/gm) &&
      pathname.match(/create-pool/gm).length > 0
    ) {
      setSelectedTab('createPool');
    } else if (
      pathname.match(/teleport/gm) &&
      pathname.match(/teleport/gm).length > 0
    ) {
      setSelectedTab('swap');
    } else {
      setSelectedTab('pools');
    }
  }, [location.pathname]);

  return { selectedTab };
}

export default useGetSelectTab;
