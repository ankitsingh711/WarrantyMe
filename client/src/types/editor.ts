import { ReactQuillProps } from 'react-quill';

export interface EditorState {
  title: string;
  content: string;
  error: string;
  success: string;
  loading: boolean;
  saving: boolean;
}

export interface QuillConfig extends Partial<ReactQuillProps> {
  modules: {
    toolbar: (string | string[] | object)[][];
  };
  formats: string[];
} 