import { useState } from 'react';

export const FormSection = ({ fields, onSubmit, submitLabel = 'Save', title }) => {
  const initialState = fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {});
  const [form, setForm] = useState(initialState);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {title && <div className="form-title">{title}</div>}
      {fields.map((field) => (
        <label key={field.name} className={field.full ? 'field full' : 'field'}>
          <span>{field.label}</span>
          {field.type === 'select' ? (
            <select value={form[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required}>
              <option value="">Select</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              rows="3"
              value={form[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={form[field.name]}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </label>
      ))}
      <button className="primary-button full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
};
