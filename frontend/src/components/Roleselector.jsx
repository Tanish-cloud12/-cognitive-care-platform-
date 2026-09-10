import "./Roleselector.css"
function RoleSelector({ role, setRole }) {
  return (
    <div className="role-selector">
      <p className="role-title">I am using Cognitive Care as:</p>

      <div className="role-options" role="radiogroup" aria-label="Account Role">
        <button
          type="button"
          role="radio"
          aria-checked={role === "patient"}
          className={role === "patient" ? "role-option active" : "role-option"}
          onClick={() => setRole("patient")}
        >
          <span className="role-icon" aria-hidden="true">👤</span>
          <span>
            <strong>Patient</strong>
            <small>I need care</small>
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={role === "caregiver"}
          className={
            role === "caregiver" ? "role-option active" : "role-option"
          }
          onClick={() => setRole("caregiver")}
        >
          <span className="role-icon" aria-hidden="true">🤝</span>
          <span>
            <strong>Caregiver</strong>
            <small>I provide care</small>
          </span>
        </button>
      </div>
    </div>
  );
}

export default RoleSelector;
