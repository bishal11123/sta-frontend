import React, { useState, useEffect } from 'react';
import { getStudents, getMonthlySummary } from '../api/studentApi';
import { getCustomIncomes, addCustomIncome } from '../api/customIncomeApi';
import Dashboard from '../components/Dashboard';
import EditStudentForm from '../components/EditStudentForm';
import Modal from '../components/Modal';
import SettingsModal from '../components/SettingsModal';
import PaymentHistoryModal from '../components/PaymentHistoryModal';
import AddIncomeModal from '../components/AddIncomeModal';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

export default function MyIncome() {
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomIncomeModal, setShowCustomIncomeModal] = useState(false);
  const [customIncomes, setCustomIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all necessary data
  async function fetchData() {
    try {
      setLoading(true);
      const data = await getStudents();
      const custom = await getCustomIncomes();
      await fetchSummary();

      setStudents(data);
      setCustomIncomes(custom);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch monthly summary
  const fetchSummary = async () => {
    try {
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const summaryData = await getMonthlySummary(month, year, settings);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // Total extra income from manual entries
  const totalExtraIncome = customIncomes.reduce((sum, i) => sum + i.amount, 0);

  // Currency formatter (NPR)
  

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />

      <ToastContainer position="top-right" autoClose={3000} />

      <h1 style={headerStyle}>📊 My Income Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        summary && (
          <Dashboard
            summary={{
              ...summary,
              totalIncome: summary.totalIncome + totalExtraIncome,
              paymentDue:
                summary.totalIncome +
                totalExtraIncome -
                summary.totalPaymentsReceived,
            }}
          />
        )
      )}

      <div style={{ marginTop: '20px' }}>
        <AnimatedButton type="button" onClick={() => setShowPaymentModal(true)}>
          ➕ Record Payment
        </AnimatedButton>

        <AnimatedButton type="button" onClick={() => setShowCustomIncomeModal(true)}>
          ➕ Add Monthly Income
        </AnimatedButton>

        <AnimatedButton type="button" onClick={() => setShowPaymentHistory(true)}>
          📜 View Payment History
        </AnimatedButton>

        <AnimatedButton type="button" onClick={() => navigate('/calculation')}>
          🧮 Open Calculation Page
        </AnimatedButton>

        <AnimatedButton type="button" onClick={() => setShowSettings(true)}>
          ⚙️ Settings
        </AnimatedButton>
      </div>

      {/* Modals */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {showPaymentHistory && (
        <PaymentHistoryModal
          onClose={() => setShowPaymentHistory(false)}
          onSuccess={fetchSummary}
        />
      )}

      {showPaymentModal && (
        <AddIncomeModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            toast.success('Payment recorded!');
            fetchData();
            setShowPaymentModal(false);
          }}
        />
      )}

      {showCustomIncomeModal && (
        <Modal isOpen onClose={() => setShowCustomIncomeModal(false)}>
          <h3>Add Monthly Income</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const amount = parseFloat(e.target.amount.value);
              const remark = e.target.remark.value;

              if (!amount || amount <= 0) {
                toast.error('Amount must be greater than 0.');
                return;
              }

              try {
                await addCustomIncome({ amount, remark });
                toast.success('Custom income added!');
                fetchData();
                setShowCustomIncomeModal(false);
                e.target.reset();
              } catch (error) {
                toast.error('Failed to add custom income.');
              }
            }}
          >
            <input
              type="number"
              name="amount"
              placeholder="Amount (NPR)"
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="remark"
              placeholder="Remark (optional)"
              style={inputStyle}
            />
            <button type="submit" style={btnStyleGreen}>
              Add Income
            </button>
          </form>
        </Modal>
      )}

      {editingStudent && (
        <EditStudentForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onStudentUpdated={fetchData}
        />
      )}
    </div>
  );
}

// Reusable animated button component
function AnimatedButton({ children, onClick, type = 'button' }) {
  return (
    <motion.button
      type={type}
      style={{ ...btnStyleBlue, marginRight: '10px' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

// Styles
const inputStyle = {
  padding: '8px',
  width: '100%',
  marginBottom: '10px',
};

const btnStyleGreen = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const btnStyleBlue = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px',
};
