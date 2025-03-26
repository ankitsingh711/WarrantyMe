import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class DriveService {
  private drive;

  constructor(accessToken: string) {
    const oauth2Client = new OAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
  }

  async createOrGetLettersFolder(): Promise<string> {
    try {
      // Check if Letters folder exists
      const response = await this.drive.files.list({
        q: "name='LetterDrive' and mimeType='application/vnd.google-apps.folder'",
        spaces: 'drive',
        fields: 'files(id, name)'
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Create new folder
      const folderMetadata = {
        name: 'LetterDrive',
        mimeType: 'application/vnd.google-apps.folder'
      };

      const folder = await this.drive.files.create({
        requestBody: folderMetadata,
        fields: 'id'
      });

      return folder.data.id!;
    } catch (error) {
      console.error('Error with Drive folder:', error);
      throw error;
    }
  }

  async saveLetter(title: string, content: string, folderId: string): Promise<string> {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: title,
          mimeType: 'application/vnd.google-apps.document',
          parents: [folderId]
        },
        media: {
          mimeType: 'text/plain',
          body: content
        },
        fields: 'id'
      });

      return response.data.id!;
    } catch (error) {
      console.error('Error saving to Drive:', error);
      throw error;
    }
  }
} 