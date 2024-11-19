import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

export default function ProductsPage() {
  const [refresh, setRefresh] = useState(false);

  const handleProductCreated = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Product Management
        </h1>
        <ProductForm onProductCreated={handleProductCreated} />
        <ProductList key={refresh.toString()} />
      </div>
    </div>
  );
}
