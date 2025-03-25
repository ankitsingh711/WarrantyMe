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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Home = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  useEffect(() => {
    if (user) {
      fetchLetters();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchLetters = async () => {
    try {
      const response = await axios.get('/api/letters', { 
        withCredentials: true 
      });
      setLetters(response.data);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (letter) => {
    setSelectedLetter(letter);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/letters/${selectedLetter._id}`, {
        withCredentials: true
      });
      setLetters(letters.filter(l => l._id !== selectedLetter._id));
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting letter:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to LetterDrive
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Create and save your letters directly to Google Drive.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/login')}
        >
          Get Started
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Your Letters
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/editor')}
        >
          New Letter
        </Button>
      </Box>

      <Grid container spacing={3}>
        {letters.map((letter) => (
          <Grid item xs={12} sm={6} md={4} key={letter._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {letter.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(letter.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => navigate(`/editor/${letter._id}`)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(letter)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {letters.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No letters yet. Create your first one!
        </Typography>
      )}

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Letter</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedLetter?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 