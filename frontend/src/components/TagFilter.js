import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { Search, Calendar, X, Tag as TagIcon } from 'lucide-react';
import './TagFilter.css';

const TagFilter = ({ posts, onFilterChange }) => {
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [selectedDate, setSelectedDate] = useState('');

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && typeof tag === 'string' && tag.trim()) {
            tagSet.add(tag.trim());
          }
        });
      }
    });
    const tagsArray = Array.from(tagSet).sort();
    console.log('Extracted tags:', tagsArray); // Debug log
    return tagsArray;
  }, [posts]);

  // Filter posts whenever selectedTag, selectedDate, or posts change
  useEffect(() => {
    let filtered = [...posts]; // Clone array to avoid mutating original

    // Filter by tag
    if (selectedTag && selectedTag !== 'All Tags') {
      filtered = filtered.filter(post => {
        return post.tags &&
               Array.isArray(post.tags) &&
               post.tags.some(tag => String(tag).trim() === selectedTag.trim());
      });
    }

    // Filter by date
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate.toDateString() === filterDate.toDateString();
      });
    }

    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, selectedDate, posts]);

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTag('All Tags');
    setSelectedDate('');
  };

  return (
    <div className="tag-filter">
      <div className="filter-header d-flex justify-content-between align-items-center">
        <h4>
          <Search size={18} className="filter-icon" /> Filter Articles
        </h4>
        {(selectedTag !== 'All Tags' || selectedDate) && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleClearFilters}
            className="clear-filters-btn"
          >
            <X size={14} /> Clear Filters
          </Button>
        )}
      </div>

      <div className="filter-controls">
        {/* Tag Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <TagIcon size={16} /> Filter by Tag
          </label>
          <Dropdown className="tag-dropdown" drop="down">
            <Dropdown.Toggle className="dropdown-toggle-custom" id="tag-dropdown-toggle">
              {selectedTag}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-custom" align="start">
              <Dropdown.Item
                active={selectedTag === 'All Tags'}
                onClick={() => handleTagSelect('All Tags')}
              >
                All Tags
              </Dropdown.Item>
              {allTags.map((tag, index) => (
                <Dropdown.Item
                  key={index}
                  active={selectedTag === tag}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Date Filter */}
        <div className="filter-group">
          <label className="filter-label">
            <Calendar size={16} /> Filter by Date
          </label>
          <div className="date-input-wrapper">
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-input"
            />
            <Calendar size={18} className="calendar-icon" />
          </div>
        </div>
      </div>

      {/* Message when no tags exist */}
      {allTags.length === 0 && posts.length > 0 && (
        <p className="no-tags-message">
          No tags available. Add tags when creating posts!
        </p>
      )}
    </div>
  );
};

export default TagFilter;
