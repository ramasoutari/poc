import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs } from '@mui/material';

export default function SettingsTabs({ tabs, value, handleChange }) {
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="basic tabs example"
      sx={{
        '& .MuiTabs-indicator': {
          bgcolor: 'primary.main',
          height: '18px',
          width: '5px !important',
          borderRadius: 1.5,
          top: '50% !important',
          transform: 'translateY(-50%) !important',
        },
        '& .MuiTab-root': {
          paddingLeft: 1,
          '&.Mui-selected': {
            fontWeight: 'fontWeightBold',
          },
        },
      }}
    >
      {tabs.map((tab, index) => (
        <Tab key={index} label={tab.name} {...a11yProps(index)} />
      ))}
    </Tabs>
  );
}

SettingsTabs.propTypes = {
  tabs: PropTypes.array,
  handleChange: PropTypes.func,
  value: PropTypes.number,
};
