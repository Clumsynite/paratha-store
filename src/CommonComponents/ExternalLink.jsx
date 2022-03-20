import { string } from 'prop-types';
import React from 'react';

export default function ExternalLink({ to, name, title }) {
  return (
    <a href={to} target="_blank" rel="noreferrer" title={title}>
      {name}
    </a>
  );
}
ExternalLink.propTypes = {
  to: string.isRequired,
  name: string.isRequired,
  title: string.isRequired,
};
