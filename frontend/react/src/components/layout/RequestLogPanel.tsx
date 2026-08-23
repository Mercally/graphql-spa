import { useRequestLog, clearRequestLog } from '../../lib/requestLog';
import { useSettings } from '../../config/SettingsContext';

/**
 * The "N requests made" panel from Requirements.md section 19: shows the
 * live count of real network calls the current screen has made, sourced
 * from requestLog (populated by the axios interceptor and the Apollo
 * logging link) - not a hardcoded number.
 */
export function RequestLogPanel() {
  const { mode } = useSettings();
  const entries = useRequestLog();

  return (
    <div className="request-log-panel">
      <div className="request-log-header">
        <strong>{mode === 'rest' ? 'REST' : 'GraphQL'}</strong>
        <span className="request-log-count">Requests: {entries.length}</span>
        <button type="button" className="btn-link" onClick={clearRequestLog}>
          Reset
        </button>
      </div>
      {entries.length > 0 && (
        <ol className="request-log-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span className="request-log-method">{entry.method}</span> {entry.target}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
