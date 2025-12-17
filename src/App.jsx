import React, { useState } from 'react';
import './styles/App.css';

function App() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });
  const [editingIdea, setEditingIdea] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newIdea.title.trim() && newIdea.description.trim()) {
      if (editingIdea) {
        // 更新现有创意
        setIdeas(ideas.map(idea => 
          idea.id === editingIdea.id 
            ? { ...idea, title: newIdea.title, description: newIdea.description }
            : idea
        ));
        setEditingIdea(null);
      } else {
        // 创建新创意
        const idea = {
          id: Date.now(),
          title: newIdea.title,
          description: newIdea.description
        };
        setIdeas([...ideas, idea]);
      }
      // 重置表单
      setNewIdea({ title: '', description: '' });
    }
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setNewIdea({ title: idea.title, description: idea.description });
  };

  const handleDelete = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>创意管理与协作系统</h1>
      </header>

      <div className="idea-form">
        <h2>{editingIdea ? '编辑创意' : '提交新创意'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">创意标题</label>
            <input
              type="text"
              id="title"
              value={newIdea.title}
              onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              placeholder="请输入创意标题"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">创意描述</label>
            <textarea
              id="description"
              value={newIdea.description}
              onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
              placeholder="请详细描述您的创意"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingIdea ? '更新创意' : '提交创意'}
            </button>
            {editingIdea && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setEditingIdea(null);
                  setNewIdea({ title: '', description: '' });
                }}
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="idea-list">
        {ideas.map(idea => (
          <div key={idea.id} className="idea-card">
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <div className="actions">
              <button 
                className="btn btn-edit"
                onClick={() => handleEdit(idea)}
              >
                编辑
              </button>
              <button 
                className="btn btn-delete"
                onClick={() => handleDelete(idea.id)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {ideas.length === 0 && (
        <div className="idea-card">
          <p style={{ textAlign: 'center', color: '#999' }}>暂无创意，快来提交您的第一个创意吧！</p>
        </div>
      )}
    </div>
  );
}

export default App;
