import React from 'react';
import ArticleList from '../components/gdpr/ArticleList';
import SavedArticles from '../components/gdpr/SavedArticles';
import { useTheme } from '../context/ThemeContext';
import './GdprArticles.css';

const GdprArticles = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
      <div className={`gdpr-container ${isDark ? 'dark-theme' : 'light-theme'}`}>
        <div className="gdpr-content">
          {/* Main content area */}
          <div className="article-list">
            <ArticleList />
          </div>

          {/* Sidebar */}
          <div className="saved-articles">
            <div className={`saved-articles-box ${isDark ? 'dark-box' : 'light-box'}`}>
              <SavedArticles />
            </div>
          </div>
        </div>
      </div>
  );
};

export default GdprArticles;