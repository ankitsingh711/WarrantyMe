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
import axios from 'axios';
import { useAutoSave } from '../hooks/useAutoSave';

const Editor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchLetter();
    }
  }, [id]);

  const fetchLetter = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/letters/${id}`, {
        withCredentials: true
      });
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      setError('Error loading letter');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!title || !content) {
        setError('Please fill in both title and content');
        return;
      }

      setSaving(true);
      const endpoint = id ? `/api/letters/${id}` : '/api/letters';
      const method = id ? 'put' : 'post';

      await axios[method](endpoint, {
        title,
        content
      }, { withCredentials: true });

      setSuccess('Letter saved successfully!');
      if (!id) {
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving letter');
    } finally {
      setSaving(false);
    }
  };

  const autoSave = useAutoSave(async () => {
    if (title && content && id) {
      try {
        setSaving(true);
        await axios.put(`/api/letters/${id}`, {
          title,
          content
        }, { withCredentials: true });
        setSuccess('Auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setSaving(false);
      }
    }
  });

  useEffect(() => {
    if (id) {
      autoSave();
    }
  }, [title, content, id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            {id ? 'Edit Letter' : 'Create New Letter'}
          </Typography>
          {saving && <CircularProgress size={24} />}
        </Box>
        
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button 
            variant="contained" 
            onClick={handleSave}
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            Save to Drive
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess('')}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Editor; 