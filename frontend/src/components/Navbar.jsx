import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid #ccc'
      }}
    >
      <h2>Expense Tracker</h2>

      <div>
        <Link to="/" style={{ marginRight: '1rem' }}>
          Dashboard
        </Link>

        <Link to="/login" style={{ marginRight: '1rem' }}>
          Login
        </Link>

        <Link to="/signup">
          Signup
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;