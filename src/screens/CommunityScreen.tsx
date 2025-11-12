import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import '../App.css';

interface User {
  id: string;
  name: string;
  username: string;
  isVerified: boolean;
}

interface Comment {
  id: string;
  author: User;
  content: string;
  date: string;
  likes: number;
}

interface Post {
  id: string;
  author: User;
  content: string;
  category: string;
  likes: number;
  comments: Comment[];
  shares: number;
  date: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const categories = [
  { id: 'all', name: 'All', icon: '📋' },
  { id: 'prayer', name: 'Prayer', icon: '🕐' },
  { id: 'quran', name: 'Quran', icon: '📖' },
  { id: 'dua', name: 'Dua', icon: '🤲' },
  { id: 'ramadan', name: 'Ramadan', icon: '🌙' },
  { id: 'hajj', name: 'Hajj', icon: '🕋' },
  { id: 'general', name: 'General', icon: '💬' },
];

const CommunityScreen: React.FC = () => {
  const { authState } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('general');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await api.listPosts(20);
      const items = Array.isArray(data?.data) ? data.data : [];
      
      const mappedPosts: Post[] = items.map((p: any) => ({
        id: p.id,
        author: {
          id: p?.user?.id || 'user',
          name: p?.user?.name || p?.user?.email?.split('@')[0] || 'User',
          username: (p?.user?.name || p?.user?.email || 'user').split('@')[0].toLowerCase(),
          isVerified: false,
        },
        content: p.content,
        category: 'general',
        likes: (p._count?.likes as number) || 0,
        comments: Array.isArray(p?.comments) ? p.comments.map((c: any) => ({
          id: c.id,
          author: {
            id: c.user?.id || 'user',
            name: c.user?.name || c.user?.email?.split('@')[0] || 'User',
            username: (c.user?.name || c.user?.email || 'user').split('@')[0].toLowerCase(),
            isVerified: false,
          },
          content: c.content,
          date: new Date(c.createdAt || Date.now()).toLocaleString(),
          likes: 0,
        })) : [],
        shares: 0,
        date: new Date(p.createdAt || Date.now()).toLocaleString(),
        isLiked: false,
        isBookmarked: false,
      }));
      
      setPosts(mappedPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const createPost = async () => {
    if (!newPostContent.trim()) return;
    
    if (!authState.user) {
      alert('Please sign in to create posts');
      return;
    }

    const optimistic: Post = {
      id: `tmp-${Date.now()}`,
      author: {
        id: authState.user.id || 'user',
        name: authState.user.name || authState.user.email?.split('@')[0] || 'User',
        username: (authState.user.name || authState.user.email || 'user').split('@')[0].toLowerCase(),
        isVerified: false,
      },
      content: newPostContent.trim(),
      category: newPostCategory,
      likes: 0,
      comments: [],
      shares: 0,
      date: 'Just now',
      isLiked: false,
      isBookmarked: false,
    };
    
    setPosts([optimistic, ...posts]);
    setNewPostContent('');
    setShowCreatePost(false);
    
    try {
      const created = await api.createPost(optimistic.content, []);
      setPosts(prev => [{
        ...optimistic,
        id: created.id,
        date: new Date(created.createdAt || Date.now()).toLocaleString(),
      }, ...prev.filter(p => p.id !== optimistic.id)]);
    } catch (error: any) {
      setPosts(prev => prev.filter(p => p.id !== optimistic.id));
      alert(error?.message || 'Failed to create post');
    }
  };

  const toggleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const wasLiked = post.isLiked;
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, isLiked: !p.isLiked, likes: wasLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));

    try {
      if (wasLiked) {
        await api.unlikePost(postId);
      } else {
        await api.likePost(postId);
      }
    } catch (error) {
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isLiked: wasLiked, likes: wasLiked ? p.likes + 1 : p.likes - 1 }
          : p
      ));
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;
    
    const optimistic: Comment = {
      id: `tmp-${Date.now()}`,
      author: {
        id: authState.user?.id || 'user',
        name: authState.user?.name || authState.user?.email?.split('@')[0] || 'User',
        username: (authState.user?.name || authState.user?.email || 'user').split('@')[0].toLowerCase(),
        isVerified: false,
      },
      content: newComment.trim(),
      date: 'Just now',
      likes: 0,
    };

    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, comments: [...p.comments, optimistic] }
        : p
    ));
    setNewComment('');
    
    try {
      await api.addComment(postId, optimistic.content);
      // Optionally reload comments
    } catch (error) {
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, comments: p.comments.filter(c => c.id !== optimistic.id) }
          : p
      ));
      alert('Failed to add comment');
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B3F39 0%, #052F2A 100%)',
        paddingTop: '40px',
        paddingBottom: '20px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#E7F5F1', marginBottom: '8px' }}>
          👥 Community
        </h1>
        <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
          Connect with fellow Muslims
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
          />
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedCategory === cat.id ? '#00BFA5' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Create Post Button */}
        {authState.isAuthenticated && (
          <button
            onClick={() => setShowCreatePost(true)}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            + Create Post
          </button>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#E7F5F1' }}>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>💬</p>
            <p style={{ fontSize: '18px', color: '#E7F5F1', marginBottom: '8px' }}>
              No posts found
            </p>
            <p style={{ fontSize: '14px', color: '#BBE1D5' }}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to post!'}
            </p>
          </div>
        ) : (
          <div>
            {filteredPosts.map((post) => (
              <div key={post.id} className="card" style={{ marginBottom: '16px' }}>
                {/* Post Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00BFA5 0%, #11C48D 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                    }}>
                      {post.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#E7F5F1', margin: 0 }}>
                          {post.author.name}
                        </p>
                        {post.author.isVerified && (
                          <span style={{ color: '#00BFA5' }}>✓</span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#BBE1D5', margin: 0 }}>
                        @{post.author.username} · {post.date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <p style={{
                  fontSize: '15px',
                  color: '#BBE1D5',
                  lineHeight: '1.6',
                  marginBottom: '16px',
                  whiteSpace: 'pre-wrap',
                }}>
                  {post.content}
                </p>

                {/* Post Actions */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: post.isLiked ? '#00BFA5' : '#BBE1D5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{post.isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#BBE1D5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>💬</span>
                    <span>{post.comments.length}</span>
                  </button>

                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#BBE1D5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🔗</span>
                    <span>{post.shares}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments === post.id && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {post.comments.map((comment) => (
                      <div key={comment.id} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(0, 191, 165, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#00BFA5',
                            fontWeight: 'bold',
                            fontSize: '12px',
                          }}>
                            {comment.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#E7F5F1', margin: '0 0 4px' }}>
                              {comment.author.name}
                            </p>
                            <p style={{ fontSize: '13px', color: '#BBE1D5', margin: 0 }}>
                              {comment.content}
                            </p>
                            <p style={{ fontSize: '11px', color: '#9E9E9E', margin: '4px 0 0' }}>
                              {comment.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {authState.isAuthenticated && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addComment(post.id);
                            }
                          }}
                          className="input-field"
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          className="btn btn-primary"
                        >
                          Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#052F2A',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#E7F5F1', margin: 0 }}>
                Create Post
              </h2>
              <button
                onClick={() => setShowCreatePost(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#E7F5F1',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <select
              value={newPostCategory}
              onChange={(e) => setNewPostCategory(e.target.value)}
              className="input-field"
              style={{ marginBottom: '16px' }}
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="input-field"
              style={{
                minHeight: '150px',
                resize: 'vertical',
                marginBottom: '16px',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={createPost}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Post
              </button>
              <button
                onClick={() => setShowCreatePost(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityScreen;

