import React from "react"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"

import { useCart } from "@/contexts/CartContext"

export const CartSidebar: React.FC = () => {
  const { cart, loading, isOpen, closeCart, removeItem, updateQuantity } = useCart()

  const cartLines = cart?.lines.edges || []
  const totalAmount = cart?.cost.totalAmount.amount || "0"
  const currencyCode = cart?.cost.totalAmount.currencyCode || "USD"

  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl
    }
  }

  const handleUpdateQuantity = async (lineId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta
    if (newQuantity <= 0) {
      await removeItem(lineId)
    } else {
      await updateQuantity(lineId, newQuantity)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={closeCart} />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {cartLines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-sm text-slate-500 mb-6">Add some products to get started!</p>
            <button
              onClick={closeCart}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartLines.map(({ node: line }) => {
                const image = line.merchandise.image?.url || ""
                const productTitle = line.merchandise.product.title
                const variantTitle = line.merchandise.title
                const price = parseFloat(line.cost.totalAmount.amount)

                return (
                  <div key={line.id} className="flex gap-4 bg-gray-50 rounded-lg p-3 relative">
                    {image && (
                      <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        <img
                          src={image}
                          alt={productTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 mb-1">{productTitle}</h3>
                      <p className="text-xs text-slate-500 mb-2">{variantTitle}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-white rounded-md border border-gray-200">
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, -1)}
                            disabled={loading}
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium min-w-[20px] text-center">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(line.id, line.quantity, 1)}
                            disabled={loading}
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">
                            ${price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                      className="absolute top-2 right-2 p-1.5 hover:bg-red-50 rounded-full transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 p-4 space-y-4 bg-white">
              <div className="flex items-center justify-between text-lg font-bold">
                <span className="text-slate-700">Subtotal</span>
                <span className="text-slate-900">
                  ${parseFloat(totalAmount).toFixed(2)} {currencyCode}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cartLines.length === 0}
                className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              <p className="text-xs text-center text-slate-500">
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
