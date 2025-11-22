import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IconPlus, IconTrash, IconPrinter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function ReceiptDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === "new"

  // Form state
  const [receipt, setReceipt] = useState({
    reference: "",
    receiveFrom: "",
    responsible: "Current User", // Auto-filled with logged-in user
    scheduleDate: "",
    status: "Draft",
    products: []
  })

  const [newProduct, setNewProduct] = useState({
    product: "",
    quantity: 0
  })

  const [loading, setLoading] = useState(!isNew)

  // Fetch existing receipt data or initialize new one
  useEffect(() => {
    const initializeReceipt = async () => {
      if (isNew) {
        // Generate new reference number
        // TODO: Fetch next available reference from API
        const newRef = `WH/IN/${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`
        setReceipt(prev => ({ ...prev, reference: newRef }))
      } else {
        // Fetch existing receipt data
        try {
          // TODO: Replace with actual API call
          // const response = await fetch(`/api/receipts/${id}`)
          // const data = await response.json()
          
          // Mock data for demonstration
          const mockData = {
            reference: id,
            receiveFrom: "Azure Interior",
            responsible: "Current User",
            scheduleDate: "2024-11-25",
            status: "Ready", // Can be Draft, Ready, or Done
            products: [
              { id: 1, product: "desk", quantity: 6 }
            ]
          }
          setReceipt(mockData)
        } catch (error) {
          console.error("Error fetching receipt:", error)
          alert("Error loading receipt")
          navigate("/operations/receipt")
        } finally {
          setLoading(false)
        }
      }
    }

    initializeReceipt()
  }, [id, isNew, navigate])

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/receipts/${receipt.reference}`, {
      //   method: isNew ? 'POST' : 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(receipt)
      // })
      // await response.json()
      
      console.log("Saving receipt:", receipt)
      alert("Receipt saved successfully")
      
      // If it was a new receipt, navigate to the edit page
      if (isNew) {
        navigate(`/operations/receipt/${receipt.reference}`)
      }
    } catch (error) {
      console.error("Error saving receipt:", error)
      alert("Error saving receipt")
    }
  }

  // Status workflow: Draft -> Ready -> Done
  const handleValidate = async () => {
    if (receipt.status === "Draft") {
      // Validate required fields
      if (!receipt.receiveFrom || !receipt.scheduleDate || receipt.products.length === 0) {
        alert("Please fill in all required fields and add at least one product")
        return
      }
      
      // Save and move to Ready
      const updatedReceipt = { ...receipt, status: "Ready" }
      setReceipt(updatedReceipt)
      
      // TODO: Save to API
      console.log("Moving to Ready:", updatedReceipt)
      alert("Receipt validated and moved to Ready status")
      
    } else if (receipt.status === "Ready") {
      // Move to Done (validate the receipt)
      const updatedReceipt = { ...receipt, status: "Done" }
      setReceipt(updatedReceipt)
      
      // TODO: Save to API
      console.log("Moving to Done:", updatedReceipt)
      alert("Receipt marked as Done")
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.product || newProduct.quantity <= 0) {
      alert("Please select a product and enter quantity")
      return
    }

    setReceipt({
      ...receipt,
      products: [...receipt.products, { ...newProduct, id: Date.now() }]
    })
    
    setNewProduct({ product: "", quantity: 0 })
  }

  const handleRemoveProduct = (productId) => {
    setReceipt({
      ...receipt,
      products: receipt.products.filter(p => p.id !== productId)
    })
  }

  const handlePrint = () => {
    if (receipt.status !== "Done") {
      alert("Receipt must be in Done status to print")
      return
    }
    window.print()
  }

  const handleCancel = () => {
    navigate("/operations/receipt")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700"
      case "Ready":
        return "bg-blue-100 text-blue-700"
      case "Done":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const isEditable = receipt.status !== "Done"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading receipt...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{isNew ? "New Receipt" : "Receipt"}</h1>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(receipt.status)}>
            {receipt.status === "Draft" && "Draft > Ready > Done"}
            {receipt.status === "Ready" && "Draft > Ready > Done"}
            {receipt.status === "Done" && "Draft > Ready > Done"}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isEditable && (
          <Button 
            onClick={handleSave}
            variant="secondary"
          >
            Save
          </Button>
        )}
        <Button 
          onClick={handleValidate}
          disabled={receipt.status === "Done"}
          variant={receipt.status === "Draft" ? "default" : "secondary"}
        >
          {receipt.status === "Draft" ? "Validate" : receipt.status === "Ready" ? "Mark as Done" : "Validated"}
        </Button>
        <Button 
          variant="outline" 
          onClick={handlePrint}
          disabled={receipt.status !== "Done"}
          className="gap-2"
        >
          <IconPrinter className="size-4" />
          Print
        </Button>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      {/* Receipt Form */}
      <div className="border rounded-lg p-6 bg-card">
        {/* Reference Number */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{receipt.reference}</h2>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="receiveFrom">Receive From</Label>
            <Input
              id="receiveFrom"
              value={receipt.receiveFrom}
              onChange={(e) => setReceipt({ ...receipt, receiveFrom: e.target.value })}
              placeholder="Enter vendor/supplier name"
              disabled={!isEditable}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduleDate">Schedule Date</Label>
            <Input
              id="scheduleDate"
              type="date"
              value={receipt.scheduleDate}
              onChange={(e) => setReceipt({ ...receipt, scheduleDate: e.target.value })}
              disabled={!isEditable}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsible</Label>
            <Input
              id="responsible"
              value={receipt.responsible}
              disabled
              placeholder="Auto-filled with current user"
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Products</h3>
          
          {/* Products Table */}
          {receipt.products.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        [{product.product.toUpperCase()}] {product.product}
                      </TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell>
                        {isEditable && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProduct(product.id)}
                          >
                            <IconTrash className="size-4 text-red-600" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Add New Product */}
          {isEditable && (
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="newProduct">Product</Label>
                <Select
                  value={newProduct.product}
                  onValueChange={(value) => setNewProduct({ ...newProduct, product: value })}
                >
                  <SelectTrigger id="newProduct">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desk">Desk</SelectItem>
                    <SelectItem value="chair">Chair</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32 space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleAddProduct} className="gap-2">
                <IconPlus className="size-4" />
                Add
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Status Info Box */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="font-semibold mb-2">Receipt Workflow:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>Draft:</strong> Initial stage - fully editable. Click "Validate" when ready.</li>
          <li>• <strong>Ready:</strong> Validated and ready to receive - still editable. Click "Mark as Done" when received.</li>
          <li>• <strong>Done:</strong> Received and finalized - read-only. Can print receipt.</li>
        </ul>
        <div className="mt-3 text-sm">
          <strong>Current Status:</strong> <span className={`font-semibold ${receipt.status === 'Draft' ? 'text-gray-700' : receipt.status === 'Ready' ? 'text-blue-700' : 'text-green-700'}`}>{receipt.status}</span>
          {isEditable && <span className="ml-2 text-muted-foreground">(Editable)</span>}
          {!isEditable && <span className="ml-2 text-muted-foreground">(Read-only)</span>}
        </div>
      </div>
    </div>
  )
}
