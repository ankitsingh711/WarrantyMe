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

interface HomeState {
  letters: Letter[];
  loading: boolean;
  deleteDialog: boolean;
  selectedLetter: Letter | null;
}

const Home: React.FC = () => {
  const [state, setState] = useState<HomeState>({
    letters: [],
    loading: true,
    deleteDialog: false,
    selectedLetter: null
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
      setState(prev => ({ ...prev, letters: response.data }));
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // ... rest of the component with proper types
};

export default Home; 