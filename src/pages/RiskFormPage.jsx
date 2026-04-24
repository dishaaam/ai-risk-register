import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRiskById, createRisk, updateRisk } from "../services/riskService";
import validateRisk from "../services/validateRisk";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";

const CATEGORIES = ["Security", "AI Risk", "Compliance", "Operational", "Financial", "Reputational"];
const STATUSES = ["Open", "In Progress", "Resolved"];
const PRIORITIES = ["High", "Medium", "Low"];

const emptyForm = {
  title: "",
  category: "",
  status: "",
  priority: "",
  owner: "",
  score: "",
  description: "",
};

const RiskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // If editing, load existing data
  useEffect(() => {
    if (isEditing) {
      getRiskById(id).then((data) => {
        if (data) {
          setFormData({
            title: data.title,
            category: data.category,
            status: data.status,
            priority: data.priority,
            owner: data.owner,
            score: data.score,
            description: data.description || "",
          });
        }
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for that field as user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Validate
    const validationErrors = validateRisk(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await updateRisk(id, formData);
      } else {
        await createRisk(formData);
      }
      navigate("/risks");
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/risks")}
          className="text-blue-900 hover:underline text-sm"
        >
          ← Back to List
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Risk" : "Create New Risk"}
        </h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Title */}
          <FormInput
            label="Risk Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. Unencrypted data in transit"
          />

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              options={CATEGORIES}
            />
            <FormSelect
              label="Status *"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={errors.status}
              options={STATUSES}
            />
          </div>

          {/* Priority and Score */}
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Priority *"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              error={errors.priority}
              options={PRIORITIES}
            />
            <FormInput
              label="Risk Score (1–100) *"
              name="score"
              type="number"
              value={formData.score}
              onChange={handleChange}
              error={errors.score}
              placeholder="e.g. 75"
            />
          </div>

          {/* Owner */}
          <FormInput
            label="Risk Owner *"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            error={errors.owner}
            placeholder="e.g. Alice Johnson"
          />

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the risk in detail..."
              className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? "Saving..." : isEditing ? "Update Risk" : "Create Risk"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/risks")}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RiskFormPage;