import { useState, useEffect } from "react"
import { IconPlus, IconTrash, IconEdit, IconRuler } from "@tabler/icons-react"
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
import axios from "axios"

const API_URL = "http://localhost:5000/api"

export default function UnitsOfMeasure() {
  const [units, setUnits] = useState([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    unit_name: "",
    abbreviation: ""
  })

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/units-of-measure`, { withCredentials: true })
      setUnits(response.data)
    } catch (error) {
      console.error("Failed to fetch units:", error)
      alert("Failed to load units of measure")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingId) {
        await axios.put(`${API_URL}/units-of-measure/${editingId}`, formData, { withCredentials: true })
        setEditingId(null)
      } else {
        await axios.post(`${API_URL}/units-of-measure`, formData, { withCredentials: true })
        setIsAddingNew(false)
      }
      
      setFormData({ unit_name: "", abbreviation: "" })
      await fetchUnits()
    } catch (error) {
      console.error("Failed to save unit:", error)
      alert(error.response?.data?.error || "Failed to save unit of measure")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (unit) => {
    setEditingId(unit._id)
    setFormData({
      unit_name: unit.unit_name,
      abbreviation: unit.abbreviation || ""
    })
    setIsAddingNew(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this unit of measure?")) return

    try {
      setLoading(true)
      await axios.delete(`${API_URL}/units-of-measure/${id}`, { withCredentials: true })
      await fetchUnits()
    } catch (error) {
      console.error("Failed to delete unit:", error)
      alert(error.response?.data?.error || "Failed to delete unit of measure")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    setFormData({ unit_name: "", abbreviation: "" })
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Units of Measure</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage measurement units for products
          </p>
        </div>
        {!isAddingNew && (
          <Button onClick={() => setIsAddingNew(true)} className="gap-2" disabled={loading}>
            <IconPlus className="size-4" />
            Add Unit
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Unit of Measure" : "New Unit of Measure"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.unit_name}
                  onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
                  placeholder="e.g., Pieces, Kilogram, Box"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation *</Label>
                <Input
                  id="abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                  disabled={loading}
                  placeholder="e.g., pcs, kg, box"
                  required
                />
              </div>

            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingId ? "Update Unit" : "Add Unit"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Units Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Abbreviation</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Loading units...
                </TableCell>
              </TableRow>
            ) : units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No units of measure found. Add your first unit to get started.
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <TableRow key={unit._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <IconRuler className="size-4 text-muted-foreground" />
                      {unit.unit_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-2 py-1 rounded text-sm">
                      {unit.abbreviation}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(unit)}
                        disabled={loading}
                      >
                        <IconEdit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(unit._id)}
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
        <h4 className="font-semibold mb-2">Common Units of Measure:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground grid grid-cols-2 gap-2">
          <li>• <strong>pcs</strong> - Pieces (individual items)</li>
          <li>• <strong>kg</strong> - Kilograms (weight)</li>
          <li>• <strong>g</strong> - Grams (weight)</li>
          <li>• <strong>L</strong> - Liters (volume)</li>
          <li>• <strong>m</strong> - Meters (length)</li>
          <li>• <strong>box</strong> - Box (packaging)</li>
          <li>• <strong>carton</strong> - Carton (packaging)</li>
          <li>• <strong>pallet</strong> - Pallet (bulk)</li>
        </ul>
      </div>
    </div>
  )
}
