import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Container,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../config/axios';
import { useAutoSave } from '../hooks/useAutoSave';
import { Letter } from '../types';

interface EditorState {
  title: string;
  content: string;
  error: string;
  success: string;
  loading: boolean;
  saving: boolean;
}

const Editor: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    title: '',
    content: '',
    error: '',
    success: '',
    loading: false,
    saving: false
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchLetter();
    }
  }, [id]);

  const fetchLetter = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await axios.get<Letter>(`/api/letters/${id}`);
      setState(prev => ({
        ...prev,
        title: response.data.title,
        content: response.data.content
      }));
    } catch (error) {
      setState(prev => ({ ...prev, error: 'Error loading letter' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      if (!state.title || !state.content) {
        setState(prev => ({ ...prev, error: 'Please fill in both title and content' }));
        return;
      }

      setState(prev => ({ ...prev, saving: true }));
      const endpoint = id ? `/api/letters/${id}` : '/api/letters';
      const method = id ? 'put' : 'post';

      await axios[method](endpoint, {
        title: state.title,
        content: state.content
      });

      setState(prev => ({ ...prev, success: 'Letter saved successfully!' }));
      if (!id) {
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Error saving letter'
      }));
    } finally {
      setState(prev => ({ ...prev, saving: false }));
    }
  };

  // ... rest of the component remains similar but with proper types
};

export default Editor; 