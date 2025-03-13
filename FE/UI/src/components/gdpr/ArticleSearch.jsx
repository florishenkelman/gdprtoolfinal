import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useTheme } from '../../context/ThemeContext';
import './ArticleSearch.css'; // New CSS file

export default function ArticleSearch({ onSearch }) {
    const { theme } = useTheme();
    const [searchInput, setSearchInput] = useState('');

    const debouncedSearch = useCallback(
        debounce((value) => {
            onSearch(value);
        }, 1800),
        []
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setSearchInput('');
        onSearch('');
    };

    return (
        <div className={`article-search ${theme}`}>
            <div className="article-search-container">
                <input
                    type="text"
                    className={`article-input ${theme}`}
                    placeholder="Search articles..."
                    value={searchInput}
                    onChange={handleChange}
                />
                <div className="article-icon">
                    <svg
                        className="icon-svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {searchInput && (
                    <button onClick={handleClear} className="article-clear">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon-svg-clear"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}