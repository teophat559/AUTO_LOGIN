import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, Switch, Select } from '../../components/common';
import { useToast } from '../../hooks/useToast';

const SettingsContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: #212529;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SettingsCard = styled(Card)`
  padding: 1.5rem;
`;

const CardTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #212529;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
`;

const SwitchGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SwitchLabel = styled.span`
  color: #495057;
`;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Contest Platform',
    siteDescription: 'A platform for managing contests and competitions',
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
    defaultLanguage: 'en',
    timezone: 'UTC',
    maxFileSize: '10',
    allowedFileTypes: ['jpg', 'png', 'pdf', 'mp4'],
  });

  const { showToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    showToast('Settings saved successfully', 'success');
  };

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
      </Header>

      <SettingsGrid>
        <SettingsCard>
          <CardTitle>General Settings</CardTitle>
          <FormGroup>
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="defaultLanguage">Default Language</Label>
            <Select
              id="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={(value) => handleSelectChange('defaultLanguage', value)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
              ]}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              id="timezone"
              value={settings.timezone}
              onChange={(value) => handleSelectChange('timezone', value)}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'EST', label: 'Eastern Time' },
                { value: 'PST', label: 'Pacific Time' },
                { value: 'GMT', label: 'Greenwich Mean Time' },
              ]}
            />
          </FormGroup>
        </SettingsCard>

        <SettingsCard>
          <CardTitle>System Settings</CardTitle>
          <SwitchGroup>
            <SwitchLabel>Email Notifications</SwitchLabel>
            <Switch
              checked={settings.emailNotifications}
              onChange={() => handleSwitchChange('emailNotifications')}
            />
          </SwitchGroup>
          <SwitchGroup>
            <SwitchLabel>Maintenance Mode</SwitchLabel>
            <Switch
              checked={settings.maintenanceMode}
              onChange={() => handleSwitchChange('maintenanceMode')}
            />
          </SwitchGroup>
          <SwitchGroup>
            <SwitchLabel>Allow Registration</SwitchLabel>
            <Switch
              checked={settings.allowRegistration}
              onChange={() => handleSwitchChange('allowRegistration')}
            />
          </SwitchGroup>
          <FormGroup>
            <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
            <Input
              id="maxFileSize"
              name="maxFileSize"
              type="number"
              value={settings.maxFileSize}
              onChange={handleInputChange}
            />
          </FormGroup>
        </SettingsCard>
      </SettingsGrid>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default Settings;