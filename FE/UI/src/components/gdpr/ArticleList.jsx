import { useTheme } from '../../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { gdprService } from '../../services/gdprService';
import ArticleSearch from './ArticleSearch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import './ArticleList.css'; // Include a new CSS file

export default function ArticleList() {
    const { theme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: articles, isLoading } = useQuery({
        queryKey: ['articles', searchTerm],
        queryFn: () => searchTerm ? gdprService.searchArticles(searchTerm) : gdprService.getAllArticles(),
    });

    const handleSaveArticle = async (articleId) => {
        try {
            await gdprService.saveArticle(articleId);
            toast.success('Article saved successfully');
        } catch (error) {
            toast.error('Failed to save article');
        }
    };

    if (isLoading) {
        return <div className="article-loading">Loading articles...</div>;
    }

    return (
        <div className="article-list">
            <div className="article-header">
                <h2 className={`article-title ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                    GDPR Articles
                </h2>
                <ArticleSearch onSearch={setSearchTerm} />
            </div>

            <div className="article-container">
                {articles?.map((article) => (
                    <div
                        key={article.id}
                        className={`article-card ${theme === 'dark' ? 'dark-card' : 'light-card'}`}
                    >
                        <div className="article-card-header">
                            <h3 className="article-number">{article.articleNumber}</h3>
                            <button
                                onClick={() => handleSaveArticle(article.id)}
                                className={`save-article-button ${theme === 'dark' ? 'dark-button' : 'light-button'}`}
                            >
                                Save Article
                            </button>
                        </div>
                        <h4 className="article-title">{article.title}</h4>
                        <p className="article-content">{article.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}