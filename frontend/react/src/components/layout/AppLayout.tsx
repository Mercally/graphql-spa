import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { SettingsBar } from './SettingsBar';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Work PoC - REST vs GraphQL</h1>
        <SettingsBar />
      </header>
      <NavBar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
