import "./Button.css"
function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button button-${variant}`}
    >
      {children}
    </button>
  );
}

export default Button;
