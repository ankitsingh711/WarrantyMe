import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';
import { Letter } from '../types';
import LoadingState from '../components/LoadingState';

interface HomeState {
  letters: Letter[];
  loading: boolean;
  deleteDialog: boolean;
  selectedLetter: Letter | null;
  error: string;
}

const Home: React.FC = () => {
  const [state, setState] = useState<HomeState>({
    letters: [],
    loading: true,
    deleteDialog: false,
    selectedLetter: null,
    error: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchLetters();
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  const fetchLetters = async (): Promise<void> => {
    try {
      const response = await axios.get<Letter[]>('/api/letters');
      setState(prev => ({ ...prev, letters: response.data, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Error fetching letters',
        loading: false 
      }));
    }
  };

  const handleDeleteClick = (letter: Letter): void => {
    setState(prev => ({ 
      ...prev, 
      selectedLetter: letter,
      deleteDialog: true 
    }));
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    try {
      if (!state.selectedLetter) return;
      
      await axios.delete(`/api/letters/${state.selectedLetter._id}`);
      setState(prev => ({
        ...prev,
        letters: prev.letters.filter(l => l._id !== prev.selectedLetter?._id),
        deleteDialog: false,
        selectedLetter: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error deleting letter',
        deleteDialog: false
      }));
    }
  };

  if (state.loading) {
    return <LoadingState />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Your existing JSX */}
    </Container>
  );
};

export default Home; 