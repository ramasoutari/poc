import { useEffect, useState } from 'react';

export default function useTabs(tabs = []) {
  const [currentTab, setCurrentTab] = useState(0);

  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return {
    tabs: tabs.map((tab, index) => ({
      ...tab,
      isActive: currentTab === index,
      onClick: (event) => changeTab(event, index),
    })),
    currentTab,
    changeTab,
  };
}
