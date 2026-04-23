const validateRisk = (formData) => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required.";
  } else if (formData.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters.";
  }

  if (!formData.category) {
    errors.category = "Please select a category.";
  }

  if (!formData.status) {
    errors.status = "Please select a status.";
  }

  if (!formData.priority) {
    errors.priority = "Please select a priority.";
  }

  if (!formData.owner.trim()) {
    errors.owner = "Owner name is required.";
  }

  if (!formData.score) {
    errors.score = "Score is required.";
  } else if (formData.score < 1 || formData.score > 100) {
    errors.score = "Score must be between 1 and 100.";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required.";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return errors;
};

export default validateRisk;