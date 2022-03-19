import {
  array,
  node,
  number,
  oneOfType,
  string,
  object,
  bool,
} from 'prop-types';
import React from 'react';

export default function Text({
  bold,
  size = 16,
  style,
  children,
  italic,
  underline,
  color,
}) {
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: bold ? 'bold' : 'normal',
        ...style,
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
        color,
      }}
    >
      {children}
    </div>
  );
}

Text.propTypes = {
  bold: bool,
  size: number,
  style: oneOfType([object, array]),
  children: node.isRequired,
  italic: bool,
  underline: bool,
  color: string,
};
Text.defaultProps = {
  bold: false,
  size: 16,
  style: {},
  italic: false,
  underline: false,
  color: '#000',
};
