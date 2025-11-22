import { useEffect, useState } from "react";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Stock() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [createProductForm, setCreateProductForm] = useState({
    name: "",
    cpu: 0,
    onHand: 0,
    freeToUse: 0
  });

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      // Fetch products with their stock information
      const productsRes = await axios.get(`${API_URL}/products`, { withCredentials: true });
      const products = productsRes.data;

      // For each product, get stock data from Stock collection
      const stockPromises = products.map(async (product) => {
        try {
          const stockRes = await axios.get(`${API_URL}/stock?product_id=${product._id}`, { withCredentials: true });
          const totalQuantity = stockRes.data.reduce((sum, stock) => sum + stock.quantity, 0);
          const totalFreeToUse = stockRes.data.reduce((sum, stock) => sum + (stock.freeToUse || 0), 0);
          return {
            _id: product._id,
            name: product.name || product.product_name,
            cpu: product.cpu || 0,
            onHand: totalQuantity,
            freeToUse: totalFreeToUse,
          };
        } catch {
          // If no stock found, default to 0
          return {
            _id: product._id,
            name: product.name || product.product_name,
            cpu: product.cpu || 0,
            onHand: 0,
            freeToUse: 0,
          };
        }
      });

      const stockData = await Promise.all(stockPromises);
      setStockData(stockData);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (productId, newQuantity, newFreeToUse) => {
    try {
      setLoading(true);
      
      // Update or create stock record
      await axios.put(`${API_URL}/stock`, 
        { 
          product_id: productId,
          quantity: newQuantity,
          freeToUse: newFreeToUse !== undefined ? newFreeToUse : newQuantity
        }, 
        { withCredentials: true }
      );
      
      await fetchStockData();
    } catch (error) {
      console.error("Failed to update stock:", error);
      alert(error.response?.data?.error || "Failed to update stock");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!createProductForm.name) {
      alert("Product name is required");
      return;
    }

    try {
      setLoading(true);
      
      // Create product with required fields
      const productData = {
        name: createProductForm.name,
        sku: `SKU-${Date.now()}`, // Auto-generate SKU
        cpu: createProductForm.cpu,
        uom: "pcs", // Default unit
        initialStock: createProductForm.onHand,
        reorderLevel: 0
      };
      
      const productRes = await axios.post(`${API_URL}/products`, productData, { withCredentials: true });
      const newProduct = productRes.data;
      
      // Create stock record if onHand > 0
      if (createProductForm.onHand > 0) {
        await axios.put(`${API_URL}/stock`, {
          product_id: newProduct._id,
          quantity: createProductForm.onHand,
          freeToUse: createProductForm.freeToUse || createProductForm.onHand
        }, { withCredentials: true });
      }
      
      setShowCreateProduct(false);
      setCreateProductForm({ name: "", cpu: 0, onHand: 0, freeToUse: 0 });
      await fetchStockData();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert(error.response?.data?.error || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id, item) => {
    setEditingRow(id);
    setEditValues({
      name: item.name,
      cpu: item.cpu,
      onHand: item.onHand,
      freeToUse: item.freeToUse
    });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditValues({});
  };

  const saveEdit = async (productId) => {
    try {
      setLoading(true);
      
      // Update product details
      await axios.put(`${API_URL}/products/${productId}`, {
        cpu: editValues.cpu
      }, { withCredentials: true });
      
      // Update stock quantity and freeToUse
      await handleStockUpdate(productId, editValues.onHand, editValues.freeToUse);
      
      setEditingRow(null);
      setEditValues({});
    } catch (error) {
      console.error("Failed to update:", error);
      alert(error.response?.data?.error || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stockData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Stock</h1>
        
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Create Product Button */}
          <Button 
            onClick={() => setShowCreateProduct(!showCreateProduct)} 
            className="gap-2"
            disabled={loading}
          >
            <IconPlus className="size-4" />
            Create Product
          </Button>
        </div>
      </div>

      {/* Create Product Form */}
      {showCreateProduct && (
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold mb-4">Create New Product</h3>
          <form onSubmit={handleCreateProduct}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  type="text"
                  value={createProductForm.name}
                  onChange={(e) => setCreateProductForm({ ...createProductForm, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpu">Per Unit Cost (Rs) *</Label>
                <Input
                  id="cpu"
                  type="number"
                  value={createProductForm.cpu}
                  onChange={(e) => setCreateProductForm({ ...createProductForm, cpu: Number(e.target.value) })}
                  placeholder="0"
                  required
                  disabled={loading}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onHand">On Hand</Label>
                <Input
                  id="onHand"
                  type="number"
                  value={createProductForm.onHand}
                  onChange={(e) => setCreateProductForm({ ...createProductForm, onHand: Number(e.target.value) })}
                  placeholder="0"
                  disabled={loading}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="freeToUse">Free to Use</Label>
                <Input
                  id="freeToUse"
                  type="number"
                  value={createProductForm.freeToUse}
                  onChange={(e) => setCreateProductForm({ ...createProductForm, freeToUse: Number(e.target.value) })}
                  placeholder="0"
                  disabled={loading}
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCreateProduct(false);
                  setCreateProductForm({ name: "", cpu: 0, onHand: 0, freeToUse: 0 });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Stock Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>per unit cost</TableHead>
              <TableHead>On hand</TableHead>
              <TableHead>free to Use</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && filteredStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  Loading stock data...
                </TableCell>
              </TableRow>
            ) : filteredStock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  {searchTerm ? "No products found" : "No products available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredStock.map((item) => (
                <TableRow key={item._id}>
                  {editingRow === item._id ? (
                    <>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editValues.cpu}
                          onChange={(e) => setEditValues({ ...editValues, cpu: Number(e.target.value) })}
                          className="w-24"
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editValues.onHand}
                          onChange={(e) => setEditValues({ ...editValues, onHand: Number(e.target.value) })}
                          className="w-24"
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editValues.freeToUse}
                          onChange={(e) => setEditValues({ ...editValues, freeToUse: Number(e.target.value) })}
                          className="w-24"
                          min="0"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => saveEdit(item._id)}
                            disabled={loading}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.cpu} Rs</TableCell>
                      <TableCell>{item.onHand}</TableCell>
                      <TableCell>{item.freeToUse}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(item._id, item)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Info message */}
      <div className="text-center text-sm text-muted-foreground mt-4">
        User must be able to update the stock from here.
      </div>
    </div>
  );
}
