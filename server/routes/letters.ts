import { Router, Response } from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import Letter from '../models/Letter';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Create Google Drive client
const createDriveClient = (accessToken: string): any => {
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Create Google Drive folder for user
const createDriveFolder = async (drive: any): Promise<string> => {
  try {
    const folderResponse = await drive.files.create({
      requestBody: {
        name: 'LetterDrive',
        mimeType: 'application/vnd.google-apps.folder'
      }
    });
    return folderResponse.data.id;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

// Get or create user's folder
const getUserFolder = async (drive: any, _userId: string): Promise<string> => {
  try {
    const response = await drive.files.list({
      q: "name='LetterDrive' and mimeType='application/vnd.google-apps.folder'",
      spaces: 'drive'
    });

    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    return await createDriveFolder(drive);
  } catch (error) {
    console.error('Error getting folder:', error);
    throw error;
  }
};

// Get all letters
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const letters = await Letter.find({ user: req.user!._id });
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching letters' });
  }
});

// Create new letter
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const drive = createDriveClient(req.user!.accessToken!);

    // Get or create user's folder
    const folderId = await getUserFolder(drive, req.user!._id);

    // Create file in Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: title,
        mimeType: 'application/vnd.google-apps.document',
        parents: [folderId]
      },
      media: {
        mimeType: 'text/plain',
        body: content
      }
    });

    // Create letter in database
    const letter = await Letter.create({
      title,
      content,
      user: req.user!._id,
      googleDriveFileId: driveResponse.data.id
    });

    res.status(201).json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating letter' });
  }
});

// ... rest of the routes with proper types

export default router; 