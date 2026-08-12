import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
          Expense Tracker
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
          {user ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">
                Hi, {user.name || 'User'}
              </span>
              <Link to="/" className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900">
                Login
              </Link>
              <Link to="/signup" className="rounded-md bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-700">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;