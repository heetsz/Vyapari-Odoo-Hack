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

export default function Delivery() {
  const [view, setView] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const deliveries = [
    {
      reference: "WH/OUT/0001",
      from: "WH/Stock1",
      to: "Customer",
      contact: "Tech Solutions Inc",
      scheduleDate: "2024-11-25",
      status: "Ready",
    },
    {
      reference: "WH/OUT/0002",
      from: "WH/Stock1",
      to: "Customer",
      contact: "Global Traders",
      scheduleDate: "2024-11-26",
      status: "In Progress",
    },
  ]

  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    delivery.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Delivery Orders</h1>
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
            placeholder="Search by reference or contact..."
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
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Schedule date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No delivery orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.reference}>
                    <TableCell className="font-medium">{delivery.reference}</TableCell>
                    <TableCell>{delivery.from}</TableCell>
                    <TableCell>{delivery.to}</TableCell>
                    <TableCell className="text-blue-600">{delivery.contact}</TableCell>
                    <TableCell>{delivery.scheduleDate || "-"}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={
                          delivery.status === "Ready" 
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                        }
                      >
                        {delivery.status}
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
            <h3 className="font-semibold mb-4">Ready</h3>
            {filteredDeliveries
              .filter((d) => d.status === "Ready")
              .map((delivery) => (
                <div key={delivery.reference} className="border rounded-lg p-3 mb-2 bg-card">
                  <div className="font-medium">{delivery.reference}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {delivery.from} → {delivery.to}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{delivery.contact}</div>
                </div>
              ))}
          </div>
          <div className="flex-1 border rounded-lg p-4">
            <h3 className="font-semibold mb-4">In Progress</h3>
            {filteredDeliveries
              .filter((d) => d.status === "In Progress")
              .map((delivery) => (
                <div key={delivery.reference} className="border rounded-lg p-3 mb-2 bg-card">
                  <div className="font-medium">{delivery.reference}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {delivery.from} → {delivery.to}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{delivery.contact}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
