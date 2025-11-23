/**
 * Status color mapping utility
 * Maps different statuses to colors for leads, deals, and tasks
 */

export const getStatusColor = (status, type = 'lead') => {
  if (!status) return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };

  // Lead statuses
  if (type === 'lead') {
    const leadColors = {
      'New': { bg: '#eff6ff', text: '#0369a1', border: '#bae6fd' },
      'Contacted': { bg: '#fef3c7', text: '#a16207', border: '#fde68a' },
      'Qualified': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
      'Unqualified': { bg: '#fecdd3', text: '#991b1b', border: '#fda29b' },
      'Lost': { bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },
    };
    return leadColors[status] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
  }

  // Deal statuses/stages
  if (type === 'deal') {
    const dealColors = {
      'Prospecting': { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' },
      'Qualification': { bg: '#f3e8ff', text: '#581c87', border: '#e9d5ff' },
      'Proposal': { bg: '#fef08a', text: '#713f12', border: '#fef3c7' },
      'Negotiation': { bg: '#fcd34d', text: '#78350f', border: '#fbbf24' },
      'Closed Won': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
      'Closed Lost': { bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },
    };
    return dealColors[status] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
  }

  // Task statuses
  if (type === 'task') {
    const taskColors = {
      'Open': { bg: '#eff6ff', text: '#0369a1', border: '#bae6fd' },
      'In Progress': { bg: '#fef3c7', text: '#a16207', border: '#fde68a' },
      'Completed': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
      'Cancelled': { bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },
    };
    return taskColors[status] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
  }

  return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
};

export const getPriorityColor = (priority) => {
  if (!priority) return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };

  const priorityColors = {
    'Low': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
    'Medium': { bg: '#fef3c7', text: '#a16207', border: '#fde68a' },
    'High': { bg: '#fed7aa', text: '#9a3412', border: '#fdba74' },
    'Urgent': { bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },
  };

  return priorityColors[priority] || { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' };
};

/**
 * StatusChip Component
 * Displays a colored chip for status
 */
export const StatusChip = ({ status, type = 'lead', className = '' }) => {
  const colors = getStatusColor(status, type);
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '12px',
        paddingRight: '12px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};

/**
 * PriorityChip Component
 * Displays a colored chip for priority
 */
export const PriorityChip = ({ priority, className = '' }) => {
  const colors = getPriorityColor(priority);
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '12px',
        paddingRight: '12px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }}
    >
      {priority}
    </span>
  );
};
