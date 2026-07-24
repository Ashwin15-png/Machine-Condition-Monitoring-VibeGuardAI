import React from 'react';
import Badge from '../ui/Badge';

export const StatusBadge = ({ status }) => {
  return <Badge status={status} dot />;
};

export default StatusBadge;
