import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { IUser } from '../types';

interface EditorState {
  content: string;
  users: {
    id: string;
    name: string;
    cursor?: {
      index: number;
      length: number;
    };
  }[];
}

const editors: Map<string, EditorState> = new Map();

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    const user = socket.handshake.auth.user as IUser;
    let currentDocument: string | null = null;

    socket.on('join-document', (documentId: string) => {
      currentDocument = documentId;
      socket.join(documentId);

      if (!editors.has(documentId)) {
        editors.set(documentId, { content: '', users: [] });
      }

      const editor = editors.get(documentId)!;
      editor.users.push({
        id: socket.id,
        name: user.name
      });

      // Broadcast user joined
      socket.to(documentId).emit('user-joined', {
        id: socket.id,
        name: user.name
      });

      // Send current state to new user
      socket.emit('document-state', editor);
    });

    socket.on('content-change', (data: { content: string; cursor?: { index: number; length: number } }) => {
      if (!currentDocument) return;

      const editor = editors.get(currentDocument)!;
      editor.content = data.content;

      if (data.cursor) {
        const user = editor.users.find(u => u.id === socket.id);
        if (user) {
          user.cursor = data.cursor;
        }
      }

      socket.to(currentDocument).emit('content-update', {
        content: data.content,
        userId: socket.id,
        cursor: data.cursor
      });
    });

    socket.on('disconnect', () => {
      if (currentDocument) {
        const editor = editors.get(currentDocument);
        if (editor) {
          editor.users = editor.users.filter(u => u.id !== socket.id);
          socket.to(currentDocument).emit('user-left', socket.id);
        }
      }
    });
  });

  return io;
}; 