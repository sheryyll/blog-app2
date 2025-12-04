import React, { Component } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { Edit, Trash2, Calendar, User, Tag, RefreshCw } from 'lucide-react';
import './BlogPostCard.css';

class BlogPostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullContent: false
    };
  }

  // Toggle full/truncated content
  handleToggleContent = () => {
    this.setState(prevState => ({
      showFullContent: !prevState.showFullContent
    }));
  }

  // Call parent edit handler
  handleEdit = () => {
    this.props.onEdit(this.props.post);
  }

  // Call parent delete handler with confirmation
  handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.props.onDelete(this.props.post._id);
    }
  }

  // Format date for display
  formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Truncate content for preview
  truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  render() {
    const { post, viewMode = 'grid' } = this.props;
    const { showFullContent } = this.state;
    const displayContent = showFullContent 
      ? post.content 
      : this.truncateContent(post.content);

    return (
      <Card className={`blog-post-card ${viewMode === 'list' ? 'list-view' : ''}`}>
        <Card.Body className={viewMode === 'list' ? 'list-view-body' : ''}>
          <div className={viewMode === 'list' ? 'blog-post-content-wrapper' : ''}>
            {/* Title */}
            <Card.Title className="blog-post-title">{post.title}</Card.Title>

            {/* Author */}
            <Card.Subtitle className="mb-2 text-muted blog-post-author">
              <User size={14} /> By {post.author}
            </Card.Subtitle>

            {/* Content */}
            <Card.Text className="blog-post-content">
              {displayContent}
            </Card.Text>

            {/* Read More / Read Less */}
            {post.content && post.content.length > 150 && (
              <Button
                variant="link"
                className="read-more-btn"
                onClick={this.handleToggleContent}
              >
                {showFullContent ? 'Read Less' : 'Read More'}
              </Button>
            )}

            {/* Tags */}
            {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="blog-post-tags">
                <Tag size={14} className="tags-icon" />
                {post.tags.map((tag, index) => (
                  <span key={index} className="post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer with timestamps and actions */}
          <div className="blog-post-footer d-flex justify-content-between align-items-center">
            <div className="timestamps">
              <small className="text-muted blog-post-date">
                <Calendar size={12} /> Created: {this.formatDate(post.createdAt)}
              </small>
              {post.updatedAt && (
                <small className="text-muted blog-post-date ms-2">
                  <RefreshCw size={12} /> Updated: {this.formatDate(post.updatedAt)}
                </small>
              )}
            </div>

            <ButtonGroup size="sm">
              <Button
                variant="outline-primary"
                onClick={this.handleEdit}
                className="edit-btn"
              >
                <Edit size={14} /> Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={this.handleDelete}
                className="delete-btn"
              >
                <Trash2 size={14} /> Delete
              </Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default BlogPostCard;
