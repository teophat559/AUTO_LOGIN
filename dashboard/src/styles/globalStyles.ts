import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.default};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: ${theme.typography.lineHeight.tight};
    margin-bottom: ${theme.spacing.md};
  }

  h1 {
    font-size: ${theme.typography.fontSize.xxl};
  }

  h2 {
    font-size: ${theme.typography.fontSize.xl};
  }

  h3 {
    font-size: ${theme.typography.fontSize.lg};
  }

  h4 {
    font-size: ${theme.typography.fontSize.md};
  }

  h5 {
    font-size: ${theme.typography.fontSize.sm};
  }

  h6 {
    font-size: ${theme.typography.fontSize.xs};
  }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  ul, ol {
    margin-bottom: ${theme.spacing.md};
    padding-left: ${theme.spacing.lg};
  }

  li {
    margin-bottom: ${theme.spacing.xs};
  }

  img {
    max-width: 100%;
    height: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${theme.spacing.md};
  }

  th, td {
    padding: ${theme.spacing.sm};
    border-bottom: 1px solid ${theme.colors.border};
    text-align: left;
  }

  th {
    font-weight: ${theme.typography.fontWeight.bold};
    background: ${theme.colors.background.paper};
  }

  tr:hover {
    background: ${theme.colors.background.default};
  }

  code {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    background: ${theme.colors.background.paper};
    border-radius: ${theme.borderRadius.sm};
  }

  pre {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.9em;
    padding: ${theme.spacing.md};
    background: ${theme.colors.background.paper};
    border-radius: ${theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${theme.spacing.md};
  }

  blockquote {
    border-left: 4px solid ${theme.colors.primary};
    padding-left: ${theme.spacing.md};
    margin-left: 0;
    margin-bottom: ${theme.spacing.md};
    color: ${theme.colors.text.secondary};
  }

  hr {
    border: none;
    border-top: 1px solid ${theme.colors.border};
    margin: ${theme.spacing.lg} 0;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid ${theme.colors.primary};
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.secondary};
  }

  /* Selection styles */
  ::selection {
    background: ${theme.colors.primary};
    color: ${theme.colors.white};
  }

  /* Focus styles */
  :focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary};
  }

  /* Disabled styles */
  :disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;