import React from 'react';
import { Spin } from 'antd';

function Loading() {
  return (
    <div
      style={{
        padding: 100,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin />
    </div>
  );
}

export default Loading;
