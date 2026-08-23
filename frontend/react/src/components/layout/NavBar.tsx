import { NavLink } from 'react-router-dom';

const LINKS: { to: string; label: string }[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/customers', label: 'Customers' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/tags', label: 'Tags' },
  { to: '/comments', label: 'Comments' },
];

export function NavBar() {
  return (
    <nav className="nav-bar">
      {LINKS.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
