import api from '../utils/axios';
import { API_ENDPOINTS } from './apiConfig';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const mockArticles = [
  { id: 1, title: 'Article 1', content: 'Content of GDPR Article 1', saved: false },
  { id: 2, title: 'Article 2', content: 'Content of GDPR Article 2', saved: true },
  { id: 3, title: 'Article 3', content: 'Content of GDPR Article 3', saved: false },
];

export const gdprService = {
  getAllArticles: async () => {
    if (useMock) {
      console.log('Mock getAllArticles called');
      return Promise.resolve(mockArticles);
    }
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.getAll);
      return response;
    } catch (error) {
      console.error('Error getting all GDPR articles:', error);
      throw error;
    }
  },

  getArticleById: async (id) => {
    if (useMock) {
      console.log(`Mock getArticleById called with ID: ${id}`);
      const article = mockArticles.find((a) => a.id === id);
      if (article) {
        return Promise.resolve(article);
      }
      return Promise.reject(new Error('Article not found'));
    }
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.getById(id));
      return response;
    } catch (error) {
      console.error('Error getting GDPR article by ID:', error);
      throw error;
    }
  },

  searchArticles: async (searchTerm) => {
    if (useMock) {
      console.log(`Mock searchArticles called with searchTerm: "${searchTerm}"`);
      const filteredArticles = mockArticles.filter((article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return Promise.resolve(filteredArticles);
    }
    try {
      const response = await api.get(`${API_ENDPOINTS.gdpr.search}?searchTerm=${searchTerm}`);
      return response;
    } catch (error) {
      console.error('Error searching GDPR articles:', error.response?.data || error.message);
      throw error;
    }
  },

  saveArticle: async (articleId) => {
    if (useMock) {
      console.log(`Mock saveArticle called with ID: ${articleId}`);
      const article = mockArticles.find((a) => a.id === articleId);
      if (article) {
        article.saved = true;
        return Promise.resolve(article);
      }
      return Promise.reject(new Error('Article not found'));
    }
    try {
      const response = await api.post(API_ENDPOINTS.gdpr.saved.save(articleId));
      return response;
    } catch (error) {
      console.error('Error saving GDPR article:', error);
      throw error;
    }
  },

  getSavedArticles: async () => {
    if (useMock) {
      console.log('Mock getSavedArticles called');
      const savedArticles = mockArticles.filter((article) => article.saved);
      return Promise.resolve(savedArticles);
    }
    try {
      const response = await api.get(API_ENDPOINTS.gdpr.saved.getAll);
      return response;
    } catch (error) {
      console.error('Error getting saved GDPR articles:', error);
      throw error;
    }
  },

  removeSavedArticle: async (savedArticleId) => {
    if (useMock) {
      console.log(`Mock removeSavedArticle called with ID: ${savedArticleId}`);
      const article = mockArticles.find((a) => a.id === savedArticleId);
      if (article) {
        article.saved = false;
        return Promise.resolve(article);
      }
      return Promise.reject(new Error('Article not found'));
    }
    try {
      const response = await api.delete(API_ENDPOINTS.gdpr.saved.delete(savedArticleId));
      return response;
    } catch (error) {
      console.error('Error removing saved GDPR article:', error);
      throw error;
    }
  },
};