import { useEffect, useState } from "react";

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
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch products and categories on load
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

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await res.json();
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

    setCategories([...categories, newCategory]); // update UI
    setForm({ ...form, category: newCategory.name }); // auto-select
    setShowNewCategory(false);
    setNewCategoryName("");
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product Manager</h1>

      {/* PRODUCT FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-xl space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="SKU"
            className="border p-2 rounded"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />

          {/* CATEGORY DROPDOWN */}
          {!showNewCategory ? (
            <div className="flex gap-2">
              <select
                className="border p-2 rounded flex-1"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="bg-blue-500 text-white px-3 rounded"
              >
                +
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Category"
                className="border p-2 rounded flex-1"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />

              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-green-600 text-white px-3 rounded"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => setShowNewCategory(false)}
                className="bg-gray-400 text-white px-3 rounded"
              >
                X
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Unit of Measure (e.g., pcs, kg)"
            className="border p-2 rounded"
            value={form.uom}
            onChange={(e) => setForm({ ...form, uom: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Initial Stock"
            className="border p-2 rounded"
            value={form.initialStock}
            onChange={(e) =>
              setForm({ ...form, initialStock: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="Reorder Level"
            className="border p-2 rounded"
            value={form.reorderLevel}
            onChange={(e) =>
              setForm({ ...form, reorderLevel: Number(e.target.value) })
            }
          />
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Create Product
        </button>
      </form>

      {/* PRODUCTS TABLE */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Products List</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">SKU</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">UOM</th>
            <th className="p-3 border">Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">{p.sku}</td>
              <td className="p-3 border">{p.category}</td>
              <td className="p-3 border">{p.uom}</td>
              <td className="p-3 border">{p.initialStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
