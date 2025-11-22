import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    uom: "",
    initialStock: 0,
    reorderLevel: 0,
    cpu:0
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    setCategories(await res.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    fetchProducts();

    setForm({
      name: "",
      sku: "",
      category: "",
      uom: "",
      initialStock: 0,
      reorderLevel: 0,
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const res = await fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategoryName }),
    });

    const newCategory = await res.json();

    setCategories([...categories, newCategory]);
    setForm({ ...form, category: newCategory.name });
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-3">
      <h1 className="text-4xl font-bold tracking-tight">Product Manager</h1>

      {/* PRODUCT FORM */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <Input
                placeholder="SKU"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />

              {/* CATEGORY */}
              {!showNewCategory ? (
                <div className="flex gap-2">
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm({ ...form, category: value })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    onClick={() => setShowNewCategory(true)}
                    variant="default"
                  >
                    +
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="New Category"
                    value={newCategoryName}
                    className="flex-1"
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />

                  <Button onClick={handleAddCategory} variant="default">
                    Save
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    variant="secondary"
                  >
                    X
                  </Button>
                </div>
              )}

              <Input
                placeholder="Unit of Measure (e.g., pcs, kg)"
                value={form.uom}
                onChange={(e) => setForm({ ...form, uom: e.target.value })}
                required
              />
                <text>
                    Intitial Stock
                </text>
              <Input
                type="number"
                placeholder="Initial Stock"
                value={form.initialStock}
                onChange={(e) =>
                  setForm({ ...form, initialStock: Number(e.target.value) })
                }
              />
                <text>
                    ReorderLevel
                </text>
              <Input
                type="number"
                placeholder="Reorder Level"
                value={form.reorderLevel}
                onChange={(e) =>
                  setForm({ ...form, reorderLevel: Number(e.target.value) })
                }
              />
              <text>
                Cost per unit
              </text>
              <Input
              type="number"
              placeholder="Cost per Unit"
              value = {form.cpu}
              onChange={(e)=>
                setForm({...form,cpu:Number(e.target.value)})
              }/>
            </div>
            {/* move action to footer for consistent spacing */}
            <CardFooter className="p-0">
              <div className="w-full flex justify-end pt-4">
                <Button type="submit">Create Product</Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      {/* PRODUCTS TABLE */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Cost per unit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.uom}</TableCell>
                  <TableCell>{p.initialStock}</TableCell>
                  <TableCell>{p.cpu}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
