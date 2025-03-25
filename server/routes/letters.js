const express = require('express');
const { google } = require('googleapis');
const Letter = require('../models/Letter');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};

// Create Google Drive client
const createDriveClient = (accessToken) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Create Google Drive folder for user
const createDriveFolder = async (drive, userId) => {
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
const getUserFolder = async (drive, userId) => {
  try {
    const response = await drive.files.list({
      q: "name='LetterDrive' and mimeType='application/vnd.google-apps.folder'",
      spaces: 'drive'
    });

    if (response.data.files.length > 0) {
      return response.data.files[0].id;
    }

    return await createDriveFolder(drive, userId);
  } catch (error) {
    console.error('Error getting folder:', error);
    throw error;
  }
};

// Get all letters
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const letters = await Letter.find({ user: req.user._id });
    res.json(letters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching letters' });
  }
});

// Create new letter
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const drive = createDriveClient(req.user.accessToken);

    // Get or create user's folder
    const folderId = await getUserFolder(drive, req.user._id);

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
      user: req.user._id,
      googleDriveFileId: driveResponse.data.id
    });

    res.status(201).json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating letter' });
  }
});

// Update letter
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const letter = await Letter.findOne({ _id: req.params.id, user: req.user._id });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    const drive = createDriveClient(req.user.accessToken);
    
    // Update file in Google Drive
    await drive.files.update({
      fileId: letter.googleDriveFileId,
      media: {
        mimeType: 'text/plain',
        body: content
      }
    });

    // Update letter in database
    letter.title = title;
    letter.content = content;
    await letter.save();

    res.json(letter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating letter' });
  }
});

// Delete letter
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const letter = await Letter.findOne({ _id: req.params.id, user: req.user._id });

    if (!letter) {
      return res.status(404).json({ message: 'Letter not found' });
    }

    const drive = createDriveClient(req.user.accessToken);
    
    // Delete from Google Drive
    await drive.files.delete({
      fileId: letter.googleDriveFileId
    });

    // Delete from database
    await letter.deleteOne();

    res.json({ message: 'Letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting letter' });
  }
});

module.exports = router; 