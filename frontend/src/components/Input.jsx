import "./Input.css";
function Input({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default Input;
