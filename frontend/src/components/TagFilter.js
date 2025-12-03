import React, { useState, useEffect, useMemo } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { Search, Calendar, X, Tag as TagIcon } from 'lucide-react';
import './TagFilter.css';

const TagFilter = ({ posts, onFilterChange }) => {
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [selectedDate, setSelectedDate] = useState('');

  // Extract all unique tags from posts using useMemo to prevent recalculation
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

  // Filter posts based on selected tag and date
  useEffect(() => {
    let filtered = [...posts]; // Create a copy to avoid mutation

    if (selectedTag && selectedTag !== 'All Tags') {
      filtered = filtered.filter(post => {
        const hasTag = post.tags && 
          Array.isArray(post.tags) && 
          post.tags.some(tag => String(tag).trim() === selectedTag.trim());
        console.log(`Post "${post.title}" has tag "${selectedTag}":`, hasTag, 'Tags:', post.tags); // Debug log
        return hasTag;
      });
      console.log('Filtered by tag:', selectedTag, 'Result count:', filtered.length); // Debug log
    }

    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate.toDateString() === filterDate.toDateString();
      });
    }

    console.log('Final filtered posts:', filtered.length); // Debug log
    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, selectedDate, posts]); // Removed onFilterChange from deps

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedTag('All Tags');
    setSelectedDate('');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="tag-filter">
      <div className="filter-header">
        <h4>
          <Search size={18} className="filter-icon" />
          Filter Articles
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
              placeholder="dd-mm-yyyy"
            />
            <Calendar size={18} className="calendar-icon" />
          </div>
        </div>
      </div>

      {allTags.length === 0 && posts.length > 0 && (
        <p className="no-tags-message">No tags available. Add tags when creating posts!</p>
      )}
    </div>
  );
};

export default TagFilter;

