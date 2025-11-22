import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

export default function Receipt() {
  const navigate = useNavigate()
  const [view, setView] = useState("list") // list or kanban
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data - replace with actual API data
  const receipts = [
    {
      reference: "WH/IN/0001",
      from: "vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "",
      status: "Ready",
    },
    {
      reference: "WH/IN/0002",
      from: "vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "",
      status: "Ready",
    },
  ]

  const filteredReceipts = receipts.filter((receipt) =>
    receipt.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    receipt.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Receipts</h1>
        <Button className="gap-2" onClick={() => navigate("/operations/receipt/new")}>
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
              {filteredReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No receipts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceipts.map((receipt) => (
                  <TableRow 
                    key={receipt.reference}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/operations/receipt/${receipt.reference}`)}
                  >
                    <TableCell className="font-medium">{receipt.reference}</TableCell>
                    <TableCell>{receipt.from}</TableCell>
                    <TableCell>{receipt.to}</TableCell>
                    <TableCell className="text-blue-600">{receipt.contact}</TableCell>
                    <TableCell>{receipt.scheduleDate || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        {receipt.status}
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
            {filteredReceipts
              .filter((r) => r.status === "Ready")
              .map((receipt) => (
                <div key={receipt.reference} className="border rounded-lg p-3 mb-2 bg-card">
                  <div className="font-medium">{receipt.reference}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {receipt.from} → {receipt.to}
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{receipt.contact}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
