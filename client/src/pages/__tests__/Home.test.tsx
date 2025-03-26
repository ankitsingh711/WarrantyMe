import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/test-utils';
import Home from '../Home';
import axios from '../../config/axios';
import { Letter } from '../../types';

jest.mock('../../config/axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockLetters: Letter[] = [
  {
    _id: '1',
    title: 'Test Letter 1',
    content: 'Content 1',
    user: 'user1',
    googleDriveFileId: 'drive1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(<Home />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays letters after loading', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockLetters });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Letter 1')).toBeInTheDocument();
    });
  });

  it('handles letter deletion', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockLetters });
    mockedAxios.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Letter 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText('Test Letter 1')).not.toBeInTheDocument();
    });
  });
}); 