import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };

      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post('/expenses', payload);
      }

      setForm({ title: '', amount: '', category: 'Food', date: '' });
      await fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().slice(0, 10),
    });
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const [budget, setBudget] = useState(
    () => Number(localStorage.getItem('budget')) || 500
  );

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    setBudget(value);
    localStorage.setItem('budget', value);
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (!user) {
    return <h1 style={{ textAlign: 'center', marginTop: '3rem' }}>Please log in to view your dashboard.</h1>;
  }

  const categoryData = Object.values(
    expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) acc[exp.category] = { name: exp.category, value: 0 };
      acc[exp.category].value += exp.amount;
      return acc;
    }, {})
  );

  const percentUsed = budget > 0
    ? Math.min((total / budget) * 100, 100)
    : 0;

  const COLORS = ['#7F77DD', '#1D9E75', '#D85A30', '#E0B93D', '#4A90D9'];
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Dashboard</h1>
      <p><strong>Total spent:</strong> ${total}</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <h3>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Rent</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'Update' : 'Add'} Expense
        </button>
      </form>

      <h3>Your Expenses</h3>
      {expenses.length === 0 && <p>No expenses yet.</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Title</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Category</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Amount</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '0.5rem' }}>Date</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td style={{ padding: '0.5rem' }}>{exp.title}</td>
              <td style={{ padding: '0.5rem' }}>{exp.category}</td>
              <td style={{ padding: '0.5rem' }}>${exp.amount}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(exp.date).toISOString().slice(0, 10)}</td>
              <td style={{ padding: '0.5rem' }}>
                <button onClick={() => handleEdit(exp)} style={{ marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => handleDelete(exp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;