import Text from '../models/Text.js';

export const createText = async (req, res) => {
  try {
    const { text_content: textContent } = req.body;
    const newText = new Text({ text_content: textContent });
    await newText.save();
    res.status(201).json(newText);
  } catch (err) {
    res.status(500).json({ error: err.message });
    
  }
};

export const getAllTexts = async (req, res) => {
  try {
    const texts = await Text.find({ status: 'active' }).sort({
      added_date: -1,
    });
    return res.json(texts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const archiveText = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updated = await Text.findOneAndUpdate(
      { uuid },
      { status: 'archive' },
      { new: true },
    );
    if (!updated) return res.status(404).json({ error: 'Text not found' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteText = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedText = await Text.findByIdAndDelete(id);
    if (!deletedText) {
      return res.status(404).json({ error: 'Text not found' });
    }
    return res.json({ message: 'Text deleted successfully', deletedText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
