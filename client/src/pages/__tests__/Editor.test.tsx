import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import Editor from '../Editor';
import axios from '../../config/axios';

jest.mock('../../config/axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Editor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders editor form correctly', () => {
    render(<Editor />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('shows validation error when trying to save without content', async () => {
    render(<Editor />);
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(await screen.findByText(/please fill in both title and content/i))
      .toBeInTheDocument();
  });

  it('saves new letter successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          _id: '123',
          title: 'Test Letter',
          content: 'Test Content'
        },
        status: 'success'
      }
    });

    render(<Editor />);
    
    await userEvent.type(screen.getByLabelText(/title/i), 'Test Letter');
    // Simulate Quill editor content change
    const editor = screen.getByRole('textbox');
    await userEvent.type(editor, 'Test Content');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/letter saved successfully/i)).toBeInTheDocument();
    });
  });
}); 