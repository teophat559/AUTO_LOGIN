import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, TextArea, FileUpload } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const SubmissionContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
`;

const Description = styled.p`
  color: #6c757d;
  margin: 0.5rem 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #212529;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const PreviewSection = styled.div`
  margin-top: 1rem;
`;

const PreviewTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: #212529;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubmissionRules = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
`;

const RulesTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  color: #212529;
  margin-bottom: 1rem;
`;

const RulesList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  color: #495057;
`;

const RuleItem = styled.li`
  margin-bottom: 0.5rem;
`;

interface SubmissionForm {
  title: string;
  description: string;
  files: File[];
}

const ContestSubmission: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<SubmissionForm>({
    title: '',
    description: '',
    files: [],
  });
  const [errors, setErrors] = useState<Partial<SubmissionForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof SubmissionForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      files,
    }));

    // Create preview URL for the first image file
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Clear file error
    if (errors.files) {
      setErrors((prev) => ({
        ...prev,
        files: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<SubmissionForm> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.files.length === 0) {
      newErrors.files = 'At least one file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showToast('Submission created successfully', 'success');
      // Reset form
      setFormData({
        title: '',
        description: '',
        files: [],
      });
      setPreviewUrl(null);
    } catch (error) {
      showToast('Failed to create submission', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubmissionContainer>
      <Header>
        <Title>Submit Your Entry</Title>
        <Description>
          Upload your work and provide details about your submission
        </Description>
      </Header>

      <SubmissionRules>
        <RulesTitle>Submission Rules</RulesTitle>
        <RulesList>
          <RuleItem>
            All submissions must be original work created by the contestant
          </RuleItem>
          <RuleItem>
            Maximum file size: 10MB per file
          </RuleItem>
          <RuleItem>
            Supported formats: JPG, PNG, PDF, MP4
          </RuleItem>
          <RuleItem>
            You can submit up to 3 files per entry
          </RuleItem>
        </RulesList>
      </SubmissionRules>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a title for your submission"
            error={!!errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your submission"
            rows={4}
            error={!!errors.description}
          />
          {errors.description && (
            <ErrorMessage>{errors.description}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Files</Label>
          <FileUpload
            onFileChange={handleFileChange}
            accept="image/*,application/pdf,video/mp4"
            maxSize={10 * 1024 * 1024} // 10MB
            maxFiles={3}
            error={!!errors.files}
          />
          {errors.files && <ErrorMessage>{errors.files}</ErrorMessage>}
        </FormGroup>

        {previewUrl && (
          <PreviewSection>
            <PreviewTitle>Preview</PreviewTitle>
            <PreviewImage src={previewUrl} alt="Preview" />
          </PreviewSection>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Submit Entry
        </Button>
      </Form>
    </SubmissionContainer>
  );
};

export default ContestSubmission;