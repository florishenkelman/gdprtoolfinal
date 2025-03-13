import { useQuery } from '@tanstack/react-query';
import { gdprService } from '../../services/gdprService';
import { useTheme } from '../../context/ThemeContext';
import './SavedArticles.css'; // New CSS file

export default function SavedArticles() {
    const { theme } = useTheme();
    const { data: savedArticles, isLoading } = useQuery({
        queryKey: ['savedArticles'],
        queryFn: () => gdprService.getSavedArticles(),
    });

    if (isLoading) {
        return (
            <div className={`saved-articles-loading ${theme}`}>
                Loading saved articles...
            </div>
        );
    }

    return (
        <div className={`saved-articles-container ${theme}`}>
            <h3 className="saved-articles-title">Saved Articles</h3>
            {savedArticles?.map((article) => (
                <div key={article.id} className={`saved-article-card ${theme}`}>
                    <h4 className="saved-article-number">
                        Article {article.articleNumber}
                    </h4>
                    <p className="saved-article-title">
                        {article.title}
                    </p>
                </div>
            ))}
        </div>
    );
}