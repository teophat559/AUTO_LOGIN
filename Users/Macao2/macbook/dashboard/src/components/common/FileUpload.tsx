import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

const FileUploadContainer = styled.div<{ error?: boolean }>`
  border: 2px dashed ${(props) => (props.error ? '#dc3545' : '#dee2e6')};
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.error ? '#fff5f5' : 'transparent')};

  &:hover {
    border-color: ${(props) => (props.error ? '#dc3545' : '#6c757d')};
  }
`;

const UploadText = styled.p`
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
`;

const FileList = styled.div`
  margin-top: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const FileName = styled.span`
  font-size: 0.875rem;
  color: #495057;
`;

const FileSize = styled.span`
  font-size: 0.75rem;
  color: #6c757d;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;

  &:hover {
    color: #bd2130;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  error?: boolean;
  errorMessage?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  error,
  errorMessage,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onFileChange(newFiles);
    },
    [files, maxFiles, onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    maxFiles,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <FileUploadContainer {...getRootProps()} error={error}>
        <input {...getInputProps()} />
        <UploadText>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </UploadText>
        {files.length > 0 && (
          <FileList>
            {files.map((file, index) => (
              <FileItem key={index}>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
                <RemoveButton onClick={() => removeFile(index)}>×</RemoveButton>
              </FileItem>
            ))}
          </FileList>
        )}
      </FileUploadContainer>
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </div>
  );
};

export default FileUpload;