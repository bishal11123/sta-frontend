import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Add this
import { FaUsers, FaMoneyBillWave, FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

export default function Dashboard({ summary }) {
  const navigate = useNavigate(); // 👈 Hook to navigate

  const cards = [
    {
      label: 'Total Students',
      value: summary.totalStudents,
      icon: <FaUsers />,
      bg: '#4caf50',
      onClick: () => navigate('/students'), // 👈 Add this
    },
    {
      label: 'Total Income',
      value: `NPR ${summary.totalIncome?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave />,
      bg: '#2196f3',
      onClick: () => navigate('/income-breakdown')

    },
    {
      label: 'Payments Received',
      value: `NPR ${summary.totalPaymentsReceived?.toLocaleString() || 0}`,
      icon: <FaCheckCircle />,
      bg: '#673ab7',
      onClick: () => navigate('/payment-history')

    },
    {
      label: 'Payments Due',
      value: `NPR ${summary.paymentDue?.toLocaleString() || 0}`,
      icon: <FaClock />,
      bg: '#f44336',
    },
    {
      label: 'Pending Applications',
      value: summary.pendingCOEs,
      icon: <FaFileAlt />,
      bg: '#ff9800',
    },
  ];

  return (
    <div style={dashboardStyle}>
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={card.onClick} // 👈 Attach click only if defined
          style={{
            ...cardStyle,
            backgroundColor: card.bg,
            ...(card.onClick ? { cursor: 'pointer' } : {})
          }}
        >
          <div style={{ fontSize: '22px', marginBottom: '5px', color: 'white' }}>
            {card.icon}
          </div>
          <h3 style={{ margin: 0, fontSize: '15px', color: 'white', fontWeight: 500 }}>
            {card.label}
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

const dashboardStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  marginBottom: '20px',
};

const cardStyle = {
  padding: '16px 20px',
  borderRadius: '12px',
  minWidth: '180px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  flex: '1 1 180px',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};
