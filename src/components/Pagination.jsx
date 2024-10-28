import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPagination = () => {
    const pagesToShow = [];
    const maxPagesToShow = 3; // Number of pages to show before and after the current page

    // Always show the first page
    if (totalPages > 0) pagesToShow.push(1);

    // Add ellipses if the current page is not near the start
    if (currentPage > maxPagesToShow + 1) {
      pagesToShow.push('...');
    }

    // Show pages around the current page
    for (
      let i = Math.max(2, currentPage - maxPagesToShow);
      i <= Math.min(totalPages - 1, currentPage + maxPagesToShow);
      i++
    ) {
      pagesToShow.push(i);
    }

    // Add ellipses if the current page is not near the end
    if (currentPage < totalPages - maxPagesToShow) {
      pagesToShow.push('...');
    }

    // Always show the last page if it's not already included
    if (totalPages > 1 && !pagesToShow.includes(totalPages)) {
      pagesToShow.push(totalPages);
    }

    return pagesToShow.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={index}
            className="px-3 py-1 border rounded-md text-gray-700"
          >
            {page}
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-700">
        Showing {(currentPage - 1) * 10 + 1} to{' '}
        {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10}{' '}
        results
      </span>
      <div className="flex space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          &lt;
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
