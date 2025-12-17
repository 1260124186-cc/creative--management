import React, { useState, useEffect } from 'react';
import './styles/global.css';

const DEFAULT_IDEAS = [
  {
    id: 1,
    title: '新品发布会创意策划',
    description:
      '围绕即将上线的新品，规划一场线上发布会，包括直播脚本、互动抽奖和社交媒体话题传播方案。',
    createdAt: '2025-03-01T10:00:00.000Z',
  },
  {
    id: 2,
    title: '品牌视觉升级海报',
    description:
      '为品牌春季营销活动设计一套统一风格的KV海报素材，适配官网Banner、社交媒体及线下易拉宝。',
    createdAt: '2025-03-15T15:30:00.000Z',
  },
  {
    id: 3,
    title: '内部创意征集活动',
    description:
      '发起全员创意征集活动，鼓励同事提交产品改进、运营玩法、内容栏目等创意，并设置评审与激励机制。',
    createdAt: '2025-04-02T09:20:00.000Z',
  },
];

function App() {
  const [ideas, setIdeas] = useState(DEFAULT_IDEAS);
  const [newIdea, setNewIdea] = useState({ title: '', description: '' });
  const [editingIdea, setEditingIdea] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAvatarTip, setShowAvatarTip] = useState(false);
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  // 初始化时从本地存储中读取创意列表，避免刷新后数据丢失
  useEffect(() => {
    try {
      const storedIdeas = localStorage.getItem('ideas');
      if (storedIdeas) {
        const parsed = JSON.parse(storedIdeas);
        if (Array.isArray(parsed)) {
          setIdeas(parsed);
        }
      }
    } catch (error) {
      console.error('加载本地创意数据失败:', error);
    }
  }, []);

  // 每当创意列表变化时，同步到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('ideas', JSON.stringify(ideas));
    } catch (error) {
      console.error('保存创意数据到本地失败:', error);
    }
  }, [ideas]);

  // 头像提示气泡自动消失
  useEffect(() => {
    if (!showAvatarTip) return;
    const timer = setTimeout(() => {
      setShowAvatarTip(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showAvatarTip]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = newIdea.title.trim();
    const trimmedDescription = newIdea.description.trim();

    const nextErrors = { title: '', description: '' };

    if (!trimmedTitle) {
      nextErrors.title = '请输入创意标题';
    } else if (trimmedTitle.length < 2 || trimmedTitle.length > 10) {
      nextErrors.title = '创意标题需要控制在 2-10 个字';
    }

    if (!trimmedDescription) {
      nextErrors.description = '请输入创意描述';
    } else if (trimmedDescription.length < 5 || trimmedTitle.length > 50) {
      nextErrors.description = '创意描述控制在 5-50 个字';
    }

    if (nextErrors.title || nextErrors.description) {
      setErrors(nextErrors);
      return;
    }

    if (editingIdea) {
      // 更新现有创意
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === editingIdea.id
            ? {
                ...idea,
                title: trimmedTitle,
                description: trimmedDescription,
              }
            : idea
        )
      );
      setEditingIdea(null);
    } else {
      // 创建新创意
      const idea = {
        id: Date.now(),
        title: trimmedTitle,
        description: trimmedDescription,
        createdAt: new Date().toISOString(),
      };
      setIdeas((prevIdeas) => [...prevIdeas, idea]);
    }

    // 重置表单
    setNewIdea({ title: '', description: '' });
    setErrors({ title: '', description: '' });
    setIsModalOpen(false);
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setNewIdea({ title: idea.title, description: idea.description });
    setErrors({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleAskDelete = (idea) => {
    setPendingDelete(idea);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
  };

  const handleOpenNewIdea = () => {
    setEditingIdea(null);
    setNewIdea({ title: '', description: '' });
    setErrors({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIdea(null);
    setNewIdea({ title: '', description: '' });
    setErrors({ title: '', description: '' });
  };

  const handleAvatarClick = () => {
    // 每次点击都重新展示提示，由上面的 effect 负责 3 秒后自动关闭
    setShowAvatarTip(true);
  };

  const handleFieldChange = (field, value) => {
    setNewIdea((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const displayIdeas = normalizedKeyword
    ? ideas.filter((idea) => {
        const title = idea.title.toLowerCase();
        const desc = idea.description.toLowerCase();
        return (
          title.includes(normalizedKeyword) || desc.includes(normalizedKeyword)
        );
      })
    : ideas;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-left">
          <div className="logo-mark">CM</div>
          <div className="logo-text-group">
            <span className="logo-text-main">创意管理与协作系统</span>
            <span className="logo-text-sub">Creative Management</span>
          </div>
        </div>
        <div className="header-right">
          <div
            className="avatar-button"
            onClick={handleAvatarClick}
            aria-label="用户头像，点击查看提示"
          >
            U
          </div>
          {showAvatarTip && (
            <div className="avatar-tooltip">功能正在开发中</div>
          )}
        </div>
      </header>

      <main className="main-content" aria-label="创意管理主内容区域">
        <section className="banner" aria-label="创意管理横幅">
          <div className="banner-text">C M</div>
          <div className="banner-content">
            <p className="banner-tagline">Creative Management</p>
            <h2 className="banner-title">创意管理与协作</h2>
            <p className="banner-description">
              将创意想法集中到同一平台，支持多成员协作评审、版本跟踪与全流程管理。
            </p>
            <button
              type="button"
              className="btn btn-banner"
              onClick={handleOpenNewIdea}
            >
              发表创意
            </button>
          </div>
        </section>


        <div className="content-inner">
          <section
            className="idea-list-section"
            aria-label="创意列表与协作看板"
          >
              <div className="search-wrapper">
              <form
                className="search-bar"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  className="search-input"
                  placeholder="请输入关键字，例如：头脑风暴、海报设计"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button type="submit" className="search-button">
                  <span className="search-icon" aria-hidden="true">
                    🔍
                  </span>
                  搜索
                </button>
              </form>
            </div>

            <div className="section-header">
              <h2 className="section-title">创意列表</h2>
              <p className="section-subtitle">
                当前共有 <strong>{displayIdeas.length}</strong> 条创意，团队成员可基于此进行讨论与改进。
              </p>
            </div>

            <div className="idea-list">
              {displayIdeas.map((idea) => (
                <article
                  key={idea.id}
                  className="idea-card"
                  aria-label={`创意：${idea.title}`}
                >
                  <h3>{idea.title}</h3>
                  <p className="idea-description">{idea.description}</p>
                  {idea.createdAt && (
                    <p className="meta">
                      创建时间：{new Date(idea.createdAt).toLocaleString()}
                    </p>
                  )}
                  <div className="actions" aria-label="创意操作">
                    <button
                      type="button"
                      className="btn btn-edit"
                      onClick={() => handleEdit(idea)}
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => handleAskDelete(idea)}
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {ideas.length === 0 && (
              <div className="idea-card empty-state">
                <p>暂无创意，快来提交您的第一个创意吧！</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="idea-modal-title"
          onClick={handleCloseModal}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="idea-modal-title">
                {editingIdea ? '编辑创意' : '提交新创意'}
              </h2>
              <button
                type="button"
                className="modal-close"
                aria-label="关闭创意弹窗"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">创意标题</label>
                <input
                  type="text"
                  id="title"
                  value={newIdea.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="例如：改进团队头脑风暴流程"
                  aria-invalid={!!errors.title}
                  className={errors.title ? 'input-control is-error' : 'input-control'}
                />
                {errors.title && (
                  <p className="form-error">{errors.title}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description">创意描述</label>
                <textarea
                  id="description"
                  value={newIdea.description}
                  onChange={(e) =>
                    handleFieldChange('description', e.target.value)
                  }
                  placeholder="请详细描述创意的背景、目标及预期收益"
                  aria-invalid={!!errors.description}
                  className={
                    errors.description ? 'input-control is-error' : 'input-control'
                  }
                />
                <p className="field-hint">
                  提示：尽量写清楚「为何这样做」「如何落地」「谁会参与」等信息，便于后续协作。
                </p>
                {errors.description && (
                  <p className="form-error">{errors.description}</p>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingIdea ? '更新创意' : '提交创意'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          onClick={handleCancelDelete}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="delete-modal-title">确认删除</h2>
              <button
                type="button"
                className="modal-close"
                aria-label="关闭删除确认弹窗"
                onClick={handleCancelDelete}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                确定要删除「{pendingDelete.title}」这条创意吗？删除后将不可恢复。
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
