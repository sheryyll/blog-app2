import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { Save, X, Tag, FileText, User } from 'lucide-react';
import './BlogForm.css';

const BlogForm = ({ post, mode, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (mode === 'edit' && post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        author: post.author || '',
        tags: post.tags && Array.isArray(post.tags) ? post.tags.join(', ') : ''
      });
    }
  }, [mode, post]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process tags - split by comma and trim
      const processedTags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      console.log('Form tags input:', formData.tags); // Debug log
      console.log('Processed tags array:', processedTags); // Debug log
      
      const submitData = {
        title: formData.title,
        content: formData.content,
        author: formData.author,
        tags: processedTags
      };
      
      console.log('Submitting data with tags:', submitData); // Debug log
      await onSubmit(submitData);
      // Reset form after successful submission
      setFormData({
        title: '',
        content: '',
        author: '',
        tags: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="blog-form-card">
      <Card.Header className="blog-form-header">
        <h3>{mode === 'edit' ? 'Edit Post' : 'Create New Post'}</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FileText size={16} /> Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <User size={16} /> Author
            </Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              isInvalid={!!errors.author}
            />
            <Form.Control.Feedback type="invalid">
              {errors.author}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog post content here..."
              isInvalid={!!errors.content}
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <Tag size={16} /> Tags
            </Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)"
            />
            <Form.Text className="text-muted">
              Separate multiple tags with commas
            </Form.Text>
          </Form.Group>

          <div className="blog-form-actions">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X size={16} /> Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              <Save size={16} /> {isSubmitting ? 'Submitting...' : (mode === 'edit' ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BlogForm;

