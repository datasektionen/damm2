import { Components } from 'react-markdown';

// Replaces react-markdown's removed linkTarget="_blank" prop
export const newTabLinks: Components = {
  a: ({ href, title, children }) => (
    <a href={href} title={title} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};
