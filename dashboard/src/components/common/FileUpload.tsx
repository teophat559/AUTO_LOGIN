import React, { useCallback, useState, useRef } from 'react';
import styled from 'styled-components';

const FileUploadContainer = styled.div<{ error?: boolean; isDragActive?: boolean }>`
  border: 2px dashed ${(props) => (props.error ? '#dc3545' : props.isDragActive ? '#007bff' : '#dee2e6')};
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.error ? '#fff5f5' : props.isDragActive ? '#f8f9ff' : 'transparent')};

  &:hover {
    border-color: ${(props) => (props.error ? '#dc3545' : '#6c757d')};
  }
`;

const HiddenInput = styled.input`
  display: none;
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
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const validFiles = newFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`);
        return false;
      }
      return true;
    });

    const updatedFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFileChange(updatedFiles);
  }, [files, maxSize, maxFiles, onFileChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

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
      <FileUploadContainer
        error={error}
        isDragActive={isDragActive}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleFileInputChange}
        />
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
                <RemoveButton onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}>×</RemoveButton>
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