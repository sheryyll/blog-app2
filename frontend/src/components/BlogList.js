import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Plus, RefreshCw, Grid3x3, List } from 'lucide-react';
import BlogPostCard from './BlogPostCard';
import TagFilter from './TagFilter';
import './BlogList.css';

const BlogList = ({ posts, onEdit, onDelete, onNewPost, onRefresh }) => {
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle tag filter change (memoized)
  const handleFilterChange = useCallback((filtered) => {
    setFilteredPosts(filtered);
  }, []);

  // Update filtered posts when the main posts change
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <div className="blog-list">
      {/* Header */}
      <div className="blog-list-header">
        <h2>All Posts</h2>

        <div className="blog-list-actions">
          {/* Grid / List View Toggle */}
          <ButtonGroup className="view-toggle-group">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('grid')}
              className="view-btn"
            >
              <Grid3x3 size={16} /> Grid
            </Button>

            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('list')}
              className="view-btn"
            >
              <List size={16} /> List
            </Button>
          </ButtonGroup>

          {/* New Post Button */}
          <Button
            variant="primary"
            onClick={onNewPost}
            className="me-2 new-post-btn"
          >
            <Plus size={16} /> New Post
          </Button>

          {/* Refresh Button */}
          <Button
            variant="outline-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'spinning' : ''}
            />{' '}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Tag Filter */}
      {posts.length > 0 && (
        <TagFilter posts={posts} onFilterChange={handleFilterChange} />
      )}

      {/* When posts exist but filter removes them */}
      {filteredPosts.length === 0 && posts.length > 0 ? (
        <Card className="empty-state-card">
          <Card.Body className="text-center">
            <h4>No posts match your filters</h4>
            <p>Try adjusting your search or tag filter</p>
          </Card.Body>
        </Card>
      ) : filteredPosts.length === 0 ? (
        // When no posts exist at all
        <Card className="empty-state-card">
          <Card.Body className="text-center">
            <h4>No posts yet</h4>
            <p>Create your first blog post to get started!</p>
            <Button variant="primary" onClick={onNewPost}>
              Create First Post
            </Button>
          </Card.Body>
        </Card>
      ) : (
        // Grid / List rendering
        <div className={viewMode === 'grid' ? 'blog-grid-view' : 'blog-list-view'}>
          {viewMode === 'grid' ? (
            <Row>
              {filteredPosts.map((post) => (
                <Col key={post._id} md={6} lg={4} className="mb-4">
                  <BlogPostCard
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    viewMode={viewMode}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="list-view-container">
              {filteredPosts.map((post) => (
                <BlogPostCard
                  key={post._id}
                  post={post}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
