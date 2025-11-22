import UnitOfMeasure from "../models/UnitOfMeasure.js";

export const getUnitsOfMeasure = async (req, res) => {
  try {
    const units = await UnitOfMeasure.find().sort({ createdAt: -1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnitOfMeasureById = async (req, res) => {
  try {
    const unit = await UnitOfMeasure.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ error: "Unit of measure not found" });
    }
    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createUnitOfMeasure = async (req, res) => {
  try {
    const { unit_name, abbreviation } = req.body;
    
    if (!unit_name) {
      return res.status(400).json({ error: "Unit name is required" });
    }

    const unit = new UnitOfMeasure({ unit_name, abbreviation });
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUnitOfMeasure = async (req, res) => {
  try {
    const { unit_name, abbreviation } = req.body;
    
    const unit = await UnitOfMeasure.findByIdAndUpdate(
      req.params.id,
      { unit_name, abbreviation },
      { new: true, runValidators: true }
    );

    if (!unit) {
      return res.status(404).json({ error: "Unit of measure not found" });
    }

    res.json(unit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUnitOfMeasure = async (req, res) => {
  try {
    const unit = await UnitOfMeasure.findByIdAndDelete(req.params.id);
    
    if (!unit) {
      return res.status(404).json({ error: "Unit of measure not found" });
    }

    res.json({ message: "Unit of measure deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
