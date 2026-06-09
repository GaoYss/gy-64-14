import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

function initialValue(field) {
  if (field.type === "number") return 0;
  if (field.type === "select") return field.options[0];
  if (field.type === "date") return new Date().toISOString().slice(0, 10);
  if (field.type === "datetime-local") return new Date().toISOString().slice(0, 16);
  return "";
}

function normalize(fields, values) {
  return fields.reduce((payload, field) => {
    const value = values[field.name];
    payload[field.name] = field.type === "number" ? Number(value) : value;
    return payload;
  }, {});
}

export function RecordForm({ title, fields, onSubmit, validate, initialValues, onCancel }) {
  const isEdit = !!initialValues;
  const [expanded, setExpanded] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(() =>
    isEdit
      ? fields.reduce((next, field) => ({ ...next, [field.name]: initialValues[field.name] ?? initialValue(field) }), {})
      : fields.reduce((next, field) => ({ ...next, [field.name]: initialValue(field) }), {}),
  );
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setValues(
        fields.reduce((next, field) => ({ ...next, [field.name]: initialValues[field.name] ?? initialValue(field) }), {}),
      );
      setExpanded(true);
      setValidationError("");
    }
  }, [initialValues, isEdit, fields]);

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");
    const payload = normalize(fields, values);
    if (validate) {
      const error = validate(payload);
      if (error) {
        setValidationError(error);
        return;
      }
    }
    setSaving(true);
    try {
      await onSubmit(payload);
      if (isEdit) {
        onCancel?.();
      } else {
        setExpanded(false);
        setValues(fields.reduce((next, field) => ({ ...next, [field.name]: initialValue(field) }), {}));
      }
    } catch (err) {
      setValidationError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  }

  function handleCancel() {
    setValidationError("");
    onCancel?.();
  }

  return (
    <section className="form-panel">
      {!isEdit && (
        <button className="primary-action" type="button" onClick={() => setExpanded((current) => !current)}>
          <Plus size={16} />
          <span>{title}</span>
        </button>
      )}
      {expanded ? (
        <form className="record-form" onSubmit={handleSubmit}>
          {validationError && <div className="validation-error">{validationError}</div>}
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "field span-2" : "field"}>
              <span>{field.label}</span>
              {field.type === "select" ? (
                <select
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  value={values[field.name]}
                  onChange={(event) => handleChange(field.name, event.target.value)}
                  required
                />
              )}
            </label>
          ))}
          <div className="form-actions">
            <button className="submit-button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            {isEdit && (
              <button className="cancel-button" type="button" onClick={handleCancel}>
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </form>
      ) : null}
    </section>
  );
}
