import React, { useState } from 'react';

const BadgeInput = () => {
  const [tag, setTag] = useState('');

  const handleInputChange = (e:any) => {
    setTag(e.target.value);
  };

  const handleSubmit = (e:any) => {
    if (e.key === 'Enter' && tag) {
      // You can perform additional actions here if needed when a tag is set
      e.preventDefault();
    }
  };

  const removeTag = () => {
    setTag('');
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        {tag && (
          <div className="flex items-center bg-indigo-600 text-white px-2 py-1 rounded">
            {tag}
            <button className="ml-2" onClick={removeTag}>
              &times;
            </button>
          </div>
        )}
        <input
          type="text"
          value={tag}
          onChange={handleInputChange}
          onKeyDown={handleSubmit}
          className="p-2 border border-gray-300 rounded"
          placeholder="Type and press enter..."
        />
      </div>
    </div>
  );
};

export default BadgeInput;
