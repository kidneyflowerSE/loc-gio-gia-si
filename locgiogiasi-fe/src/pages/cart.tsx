import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/components/ProductCard";

interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Lọc Gió Động Cơ Toyota Camry Vios 2019",
      slug: "loc-gio-dong-co-toyota-vios-2019",
      image: "/loc-gio-dieu-hoa.jpg",
      price: 450000,
      quantity: 2,
    },
  ]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Helpers to update quantity
  const increaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.quantity - 1;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      })
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartItems.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, customer }),
      });
      if (res.ok) {
        setStatus("success");
        setCartItems([]);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {status === "success" && (
          <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">Order submitted successfully! We'll contact you soon.</p>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">Error submitting order. Please try again.</p>
              </div>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some items to get started</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-secondary-200 rounded-xl shadow-soft">
                {/* Header */}
                <div className="px-6 py-4 border-b border-secondary-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-secondary-900">Sản phẩm</h2>
                  <span className="hidden md:block text-xs text-secondary-500 w-32 text-right">Thành tiền</span>
                </div>

                <ul className="divide-y divide-secondary-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="px-6 py-4 flex items-center gap-4 md:gap-6">
                      {/* Image */}
                      <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-secondary-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-secondary-500 mt-0.5">Mã: {item.slug}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                          {/* Quantity controls */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => decreaseQty(item.id)}
                              className="w-8 h-8 flex items-center justify-center border border-secondary-300 text-secondary-700 rounded disabled:opacity-50"
                              disabled={item.quantity === 1}
                            >
                              −
                            </button>
                            <input
                              readOnly
                              value={item.quantity}
                              className="w-10 text-center border border-secondary-200 rounded bg-secondary-50 text-secondary-800"
                            />
                            <button
                              type="button"
                              onClick={() => increaseQty(item.id)}
                              className="w-8 h-8 flex items-center justify-center border border-secondary-300 text-secondary-700 rounded"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-secondary-600">Đơn giá: <strong>{item.price.toLocaleString("vi-VN")} ₫</strong></span>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="w-28 text-right hidden md:block">
                        <p className="font-semibold text-secondary-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              

              {/* Customer Information Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={customer.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={customer.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      name="note"
                      rows={3}
                      value={customer.note}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || !cartItems.length}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}