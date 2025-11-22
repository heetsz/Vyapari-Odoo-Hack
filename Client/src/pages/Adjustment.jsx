import { useState } from "react"
import { IconSearch, IconList, IconLayoutKanban, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Adjustment() {
  const [view, setView] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const adjustments = [
    {
      reference: "WH/ADJ/0001",
      product: "Product A",
      location: "WH/Stock1",
      quantity: "+50",
      reason: "Stock Count Correction",
      date: "2024-11-22",
      status: "Done",
    },
    {
      reference: "WH/ADJ/0002",
      product: "Product B",
      location: "WH/Stock1",
      quantity: "-10",
      reason: "Damaged Goods",
      date: "2024-11-22",
      status: "Done",
    },
  ]

  const filteredAdjustments = adjustments.filter((adjustment) =>
    adjustment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adjustment.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory Adjustments</h1>
        <Button className="gap-2">
          <IconPlus className="size-4" />
          NEW
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by reference or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 border rounded-md">
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            className="rounded-none"
          >
            <IconList className="size-4" />
          </Button>
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("kanban")}
            className="rounded-none"
          >
            <IconLayoutKanban className="size-4" />
          </Button>
        </div>
      </div>

      {/* Table View */}
      {view === "list" && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdjustments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No adjustments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdjustments.map((adjustment) => (
                  <TableRow key={adjustment.reference}>
                    <TableCell className="font-medium">{adjustment.reference}</TableCell>
                    <TableCell>{adjustment.product}</TableCell>
                    <TableCell>{adjustment.location}</TableCell>
                    <TableCell className={adjustment.quantity.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                      {adjustment.quantity}
                    </TableCell>
                    <TableCell>{adjustment.reason}</TableCell>
                    <TableCell>{adjustment.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        {adjustment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="flex gap-4">
          <div className="flex-1 border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Done</h3>
            {filteredAdjustments
              .filter((a) => a.status === "Done")
              .map((adjustment) => (
                <div key={adjustment.reference} className="border rounded-lg p-3 mb-2 bg-card">
                  <div className="font-medium">{adjustment.reference}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {adjustment.product} - {adjustment.location}
                  </div>
                  <div className={`text-sm mt-1 ${adjustment.quantity.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{adjustment.reason}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
