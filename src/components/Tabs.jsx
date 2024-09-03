import React from 'react';
import PropTypes from 'prop-types';

const Tabs = ({ activeTab, onTabClick }) => {
  const tabs = ['All', 'New', 'on progress', 'Take', 'Done'];

  return (
    <div className="flex justify-start border-b-2 border-gray-300 mb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabClick(tab.toLowerCase())}
          className={`text-base py-2 px-4 transition-colors duration-300 ${
            activeTab === tab.toLowerCase()
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired, // Tambahkan validasi untuk onTabClick
};

export default Tabs;
