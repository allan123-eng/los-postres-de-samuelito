"use client";
import React, { useState } from 'react';

const PRODUCTOS = [
  { id: 1, categoria: "postres", nombre: "Cheesecake de Fresa", precio: 15.00, img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500" },
  { id: 2, categoria: "postres", nombre: "Brownie Melcochudo", precio: 8.50, img: "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=500" },
  { id: 3, categoria: "pasteles", nombre: "Torta de Chocolate", precio: 20.00, img: "https://images.unsplash.com/photo-1578985543219-10ac14b39535?q=80&w=500" },
  { id: 4, categoria: "pizza", nombre: "Pizza Pepperoni", precio: 12.00, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
];

export default function Home() {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  // NUEVA LÓGICA: Agregar o sumar cantidad
  const agregarAlCarrito = (prod: any) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === prod.id);
      if (existe) {
        return prev.map(item => 
          item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  // NUEVA LÓGICA: Restar cantidad o eliminar
  const restarDelCarrito = (id: number) => {
    setCarrito(prev => {
      const producto = prev.find(item => item.id === id);
      if (producto.cantidad > 1) {
        return prev.map(item => 
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const productosFiltrados = categoriaActiva === "todos" 
    ? PRODUCTOS 
    : PRODUCTOS.filter(p => p.categoria === categoriaActiva);

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const enviarPedido = () => {
    const lista = carrito.map(p => `- ${p.cantidad}x ${p.nombre} ($${(p.precio * p.cantidad).toFixed(2)})`).join('%0A');
    const mensaje = `Hola Samuelito! Pedido nuevo:%0A${lista}%0A*Total: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/50512345678?text=${mensaje}`, '_blank');
    setCarrito([]);
    setIsCartOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#FFF9F5] p-6 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-8 bg-purple-50 p-6 rounded-3xl border border-purple-100">
        <div>
          <h1 className="text-4xl font-black text-purple-600 uppercase tracking-tighter">Samuelito Mix 🚀</h1>
          <p className="text-gray-600 text-sm italic">Dulzura actualizada en tiempo real ✨</p>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-white rounded-full shadow-md border border-purple-100">
          <span className="text-2xl">🛍️</span>
          {carrito.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          )}
        </button>
      </header>

      {/* CATEGORÍAS */}
      <div className="flex gap-4 max-w-6xl mx-auto mb-10 overflow-x-auto pb-2">
        {["todos", "postres", "pasteles", "pizza"].map((cat) => (
          <button key={cat} onClick={() => setCategoriaActiva(cat)}
            className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${
              categoriaActiva === cat ? "bg-purple-500 text-white shadow-lg" : "bg-white text-gray-400 border border-purple-50"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* GRID PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.map((prod) => (
          <div key={prod.id} className="bg-white rounded-[2rem] shadow-sm border border-purple-50 overflow-hidden group">
            <div className="h-48 overflow-hidden"><img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-duration-500" /></div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">{prod.nombre}</h2>
              <div className="flex justify-between items-center">
                <p className="text-2xl text-purple-500 font-black">${prod.precio.toFixed(2)}</p>
                <button onClick={() => agregarAlCarrito(prod)} className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARRITO (DRAWER) */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsCartOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl p-8 flex flex-col">
            <h2 className="text-2xl font-black mb-8 text-gray-800">Tu Carrito 🛒</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-purple-50 pb-4">
                  <div>
                    <p className="font-bold text-gray-800">{item.nombre}</p>
                    <p className="text-purple-500 text-sm font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => restarDelCarrito(item.id)} className="w-8 h-8 bg-gray-100 rounded-lg font-bold text-gray-600">-</button>
                    <span className="font-bold">{item.cantidad}</span>
                    <button onClick={() => agregarAlCarrito(item)} className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
            {carrito.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex justify-between mb-6"><span className="font-bold">Total:</span><span className="text-3xl font-black text-purple-600">${total.toFixed(2)}</span></div>
                <button onClick={enviarPedido} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 shadow-xl shadow-green-100">Enviar WhatsApp 💬</button>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}