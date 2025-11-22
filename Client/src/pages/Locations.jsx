import { useState, useEffect } from "react"
import { IconPlus, IconTrash, IconEdit, IconMapPin } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

const API_URL = "http://localhost:5000/api"

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    parent_location_id: "",
    description: ""
  })

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/locations`, { withCredentials: true })
      setLocations(response.data)
    } catch (error) {
      console.error("Failed to fetch locations:", error)
      alert("Failed to load locations")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const payload = {
        name: formData.name,
        parent_location_id: formData.parent_location_id || null,
        description: formData.description
      }

      if (editingId) {
        // Update existing location
        await axios.put(`${API_URL}/locations/${editingId}`, payload, { withCredentials: true })
        setEditingId(null)
      } else {
        // Add new location
        await axios.post(`${API_URL}/locations`, payload, { withCredentials: true })
        setIsAddingNew(false)
      }
      
      setFormData({ name: "", parent_location_id: "", description: "" })
      await fetchLocations()
    } catch (error) {
      console.error("Failed to save location:", error)
      alert(error.response?.data?.error || "Failed to save location")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (location) => {
    setEditingId(location._id)
    setFormData({
      name: location.name,
      parent_location_id: location.parent_location_id?._id || "",
      description: location.description || ""
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return

    try {
      setLoading(true)
      await axios.delete(`${API_URL}/locations/${id}`, { withCredentials: true })
      await fetchLocations()
    } catch (error) {
      console.error("Failed to delete location:", error)
      alert(error.response?.data?.error || "Failed to delete location")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({ name: "", parent_location_id: "", description: "" })
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Warehouse Locations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage warehouse zones, racks, shelves, and bins
          </p>
        </div>
        {!isAddingNew && (
          <Button onClick={() => setIsAddingNew(true)} className="gap-2" disabled={loading}>
            <IconPlus className="size-4" />
            Add Location
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Location" : "New Location"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., WH/Stock1, Zone A, Rack B1"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Parent Location</Label>
                <Select
                  value={formData.parent_location_id}
                  onValueChange={(value) => setFormData({ ...formData, parent_location_id: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select parent (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {locations
                      .filter(loc => loc._id !== editingId)
                      .map(loc => (
                        <SelectItem key={loc._id} value={loc._id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Location" : "Add Location"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Locations Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Loading locations...
                </TableCell>
              </TableRow>
            ) : locations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No locations configured. Add your first location to get started.
                </TableCell>
              </TableRow>
            ) : (
              locations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconMapPin className="size-4 text-muted-foreground" />
                      {location.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {location.parent_location_id?.name || "-"}
                  </TableCell>
                  <TableCell>{location.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(location)}
                        disabled={loading}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(location._id)}
                        disabled={loading}
                      >
                        <IconTrash className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info Box */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="font-semibold mb-2">Location Hierarchy:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>Warehouse:</strong> Top-level location (e.g., Main Warehouse)</li>
          <li>• <strong>Zone:</strong> Area within warehouse (e.g., Zone A, Zone B)</li>
          <li>• <strong>Rack:</strong> Storage rack within zone (e.g., Rack A1)</li>
          <li>• <strong>Shelf:</strong> Shelf on a rack (e.g., Shelf A1-1)</li>
          <li>• <strong>Bin:</strong> Specific storage bin (e.g., Bin A1-1-A)</li>
        </ul>
      </div>
    </div>
  )
}
