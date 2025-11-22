import Location from "../models/Location.js";

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create location
export const createLocation = async (req, res) => {
  try {
    const { name, parent_location_id, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Location name is required" });
    }

    const location = new Location({
      name,
      parent_location_id: parent_location_id || null,
      description
    });

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  try {
    const { name, parent_location_id, description } = req.body;
    
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, parent_location_id, description },
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
