import Text from '../models/Text.js';

export const createText = async (req, res) => {
  try {
    const { text_content } = req.body;
    const newText = new Text({ text_content });
    await newText.save();
    res.status(201).json(newText);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTexts = async (req, res) => {
  try {
    const texts = await Text.find().sort({ addedAt: -1 });
    res.json(texts);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
