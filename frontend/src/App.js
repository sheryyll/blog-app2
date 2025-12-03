import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';
import API_BASE_URL from './config';
import { apiCall } from './utils/api';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      selectedPost: null,
      showForm: false,
      formMode: 'create' // 'create' or 'edit'
    };
  }

  // Fetch all posts
  fetchPosts = async () => {
    try {
      console.log('API Base URL:', API_BASE_URL); // Debug log
      const data = await apiCall('/api/posts');
      console.log('Posts fetched:', data); // Debug log
      this.setState({ posts: data });
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Error fetching posts: ' + error.message + '\n\nCheck console for details.');
    }
  }

  // Handle post creation
  handleCreatePost = async (postData) => {
    try {
      console.log('Submitting post data:', postData); // Debug log
      const newPost = await apiCall('/api/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });
      console.log('Post created successfully:', newPost); // Debug log
      this.setState({
        posts: [newPost, ...this.state.posts],
        showForm: false
      });
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  }

  // Handle post update
  handleUpdatePost = async (id, postData) => {
    try {
      console.log('Updating post with data:', postData); // Debug log
      const updatedPost = await apiCall(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
      });
      console.log('Post updated successfully:', updatedPost); // Debug log
      this.setState({
        posts: this.state.posts.map(post =>
          post._id === id ? updatedPost : post
        ),
        showForm: false,
        selectedPost: null
      });
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post: ' + error.message);
    }
  }

  // Handle post deletion
  handleDeletePost = async (id) => {
    try {
      await apiCall(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      this.setState({
        posts: this.state.posts.filter(post => post._id !== id),
        selectedPost: null
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post: ' + error.message);
    }
  }

  // Handle edit button click
  handleEditClick = (post) => {
    this.setState({
      selectedPost: post,
      showForm: true,
      formMode: 'edit'
    });
  }

  // Handle new post button click
  handleNewPostClick = () => {
    this.setState({
      selectedPost: null,
      showForm: true,
      formMode: 'create'
    });
  }

  // Handle form cancel
  handleFormCancel = () => {
    this.setState({
      showForm: false,
      selectedPost: null
    });
  }

  // Component lifecycle method
  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    return (
      <div className="App">
        <header className="app-header">
          <Container>
            <h1 className="app-title">My Blog</h1>
            <p className="app-subtitle">Share your thoughts and ideas</p>
          </Container>
        </header>

        <main className="app-main">
          <Container>
            {!this.state.showForm ? (
              <BlogList
                posts={this.state.posts}
                onEdit={this.handleEditClick}
                onDelete={this.handleDeletePost}
                onNewPost={this.handleNewPostClick}
                onRefresh={this.fetchPosts}
              />
            ) : (
              <BlogForm
                post={this.state.selectedPost}
                mode={this.state.formMode}
                onSubmit={this.state.formMode === 'create' 
                  ? this.handleCreatePost 
                  : (postData) => this.handleUpdatePost(this.state.selectedPost._id, postData)
                }
                onCancel={this.handleFormCancel}
              />
            )}
          </Container>
        </main>
      </div>
    );
  }
}

export default App;

