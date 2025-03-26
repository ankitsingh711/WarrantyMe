import React, { useState } from 'react';
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
import axios from '../config/axios';
import { EditorState, QuillConfig } from '../types/editor';

const QUILL_CONFIG: QuillConfig = {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean']
    ]
  },
  formats: [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ]
};

const Editor: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    title: '',
    content: '',
    error: '',
    success: '',
    loading: false,
    saving: false
  });

  const handleSave = async () => {
    if (!state.title || !state.content) {
      setState(prev => ({ ...prev, error: 'Please fill in both title and content' }));
      return;
    }

    setState(prev => ({ ...prev, saving: true }));

    try {
      await axios.post('/api/letters', {
        title: state.title,
        content: state.content
      });

      setState(prev => ({
        ...prev,
        saving: false,
        success: 'Letter saved successfully'
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        saving: false,
        error: 'Error saving letter'
      }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={state.title}
            onChange={(e) => setState(prev => ({ 
              ...prev, 
              title: e.target.value 
            }))}
            variant="outlined"
          />
        </Box>

        <ReactQuill
          theme="snow"
          value={state.content}
          onChange={(content) => setState(prev => ({ ...prev, content }))}
          {...QUILL_CONFIG}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={state.saving}
            startIcon={state.saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {state.saving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={!!state.error} 
        autoHideDuration={6000} 
        onClose={() => setState(prev => ({ ...prev, error: '' }))}
      >
        <Alert severity="error">{state.error}</Alert>
      </Snackbar>

      <Snackbar 
        open={!!state.success} 
        autoHideDuration={3000} 
        onClose={() => setState(prev => ({ ...prev, success: '' }))}
      >
        <Alert severity="success">{state.success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default Editor; 