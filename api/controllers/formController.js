const Form = require('../models/Form');

const submitForm = async (req, res) => {
  try {
    const { name, email, subject, message ,createdAt } = req.body;
    const formData = new Form({
      name,
      email,
      subject,
      message,
      createdAt
    });
    await formData.save();
    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    await Form.findByIdAndDelete(id);
    res.status(200).json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitForm,
  getForms,
  deleteForm
};
