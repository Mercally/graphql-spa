import { useSettings } from '../../config/SettingsContext';
import { BACKEND_OPTIONS } from '../../config/env';
import type { DataMode } from '../../config/env';

const MODES: { key: DataMode; label: string }[] = [
  { key: 'rest', label: 'REST' },
  { key: 'graphql', label: 'GraphQL' },
];

/** The always-visible toggle for which backend + which API paradigm drives the whole app. */
export function SettingsBar() {
  const { backend, mode, setBackend, setMode } = useSettings();

  return (
    <div className="settings-bar">
      <div className="settings-group">
        <span className="settings-label">Backend</span>
        <div className="segmented">
          {BACKEND_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={opt.key === backend ? 'segmented-btn active' : 'segmented-btn'}
              onClick={() => setBackend(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-group">
        <span className="settings-label">Mode</span>
        <div className="segmented">
          {MODES.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={opt.key === mode ? 'segmented-btn active' : 'segmented-btn'}
              onClick={() => setMode(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
