import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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

  const [budget, setBudget] = useState(() => Number(localStorage.getItem('budget')) || 500);

  const handleBudgetChange = (e) => {
    const value = Number(e.target.value);
    setBudget(value);
    localStorage.setItem('budget', value);
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (!user) {
    return (
      <div className="mt-16 text-center text-xl font-semibold text-slate-700">
        Please log in to view your dashboard.
      </div>
    );
  }

  const percentUsed = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name}</h1>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Total spent</p>
          <p className="mt-3 text-3xl font-bold">${total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label htmlFor="budget" className="mb-2 block text-sm font-medium text-slate-700">
            Monthly budget
          </label>
          <input
            id="budget"
            type="number"
            min="0"
            value={budget}
            onChange={handleBudgetChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600">{Math.round(percentUsed)}% used</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          {editingId ? 'Edit Expense' : 'Add Expense'}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 md:col-span-2"
          />
        </div>

        <button
          type="submit"
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500"
        >
          {editingId ? 'Update' : 'Add'} Expense
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-slate-900">Your Expenses</h3>

        {expenses.length === 0 ? (
          <p className="text-slate-500">No expenses yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-3 py-2 font-medium">Title</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id} className="rounded-lg bg-slate-50 text-sm text-slate-700">
                    <td className="rounded-l-lg px-3 py-3">{exp.title}</td>
                    <td className="px-3 py-3">{exp.category}</td>
                    <td className="px-3 py-3">${exp.amount}</td>
                    <td className="px-3 py-3">{new Date(exp.date).toISOString().slice(0, 10)}</td>
                    <td className="rounded-r-lg px-3 py-3 text-right">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="mr-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;