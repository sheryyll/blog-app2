import React, { Component } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { Edit, Trash2, Calendar, User, Tag } from 'lucide-react';
import './BlogPostCard.css';

class BlogPostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullContent: false
    };
  }

  handleToggleContent = () => {
    this.setState(prevState => ({
      showFullContent: !prevState.showFullContent
    }));
  }

  handleEdit = () => {
    this.props.onEdit(this.props.post);
  }

  handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.props.onDelete(this.props.post._id);
    }
  }

  formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  render() {
    const { post, viewMode = 'grid' } = this.props;
    const { showFullContent } = this.state;
    const displayContent = showFullContent 
      ? post.content 
      : this.truncateContent(post.content);
    
    // Debug log for tags
    if (post.tags) {
      console.log(`Post "${post.title}" tags:`, post.tags, 'Type:', typeof post.tags, 'Is Array:', Array.isArray(post.tags));
    }

    return (
      <Card className={`blog-post-card ${viewMode === 'list' ? 'list-view' : ''}`}>
        <Card.Body className={viewMode === 'list' ? 'list-view-body' : ''}>
          <div className={viewMode === 'list' ? 'blog-post-content-wrapper' : ''}>
            <Card.Title className="blog-post-title">{post.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted blog-post-author">
              <User size={14} /> By {post.author}
            </Card.Subtitle>
            <Card.Text className="blog-post-content">
              {displayContent}
            </Card.Text>
            {post.content.length > 150 && (
              <Button
                variant="link"
                className="read-more-btn"
                onClick={this.handleToggleContent}
              >
                {showFullContent ? 'Read Less' : 'Read More'}
              </Button>
            )}
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
          <div className="blog-post-footer">
            <small className="text-muted blog-post-date">
              <Calendar size={12} /> {this.formatDate(post.createdAt)}
            </small>
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

