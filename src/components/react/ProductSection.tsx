import React, { useState } from "react"
import { Eraser, Gift, Heart, Lock, RefreshCw, Scissors, Star } from "lucide-react"

import { useCart } from "@/contexts/CartContext"
import type { PricingOption, Product } from "@/types"
import { Accordion } from "./Accordion"

interface ProductSectionProps {
  product: Product
}

function extractCountFromTitle(title: string): number {
  const match = title.match(/(\d+)\s*(Roll|roll)/)
  return match ? parseInt(match[1], 10) : 1
}

function transformVariantToPricingOption(
  variant: any,
  index: number,
  allVariants: any[],
): PricingOption {
  const count = extractCountFromTitle(variant.title)

  return {
    id: index + 1,
    label: variant.title,
    pricePerUnit: count > 0 ? variant.price / count : variant.price,
    totalPrice: variant.price,
    originalPrice: variant.compareAtPrice || variant.price * 2,
    count,
    shopifyVariantId: variant.id,
    isPopular: index === 1 && allVariants.length === 3,
    isBestValue: index === 2 && allVariants.length === 3,
  }
}

export const ProductSection: React.FC<ProductSectionProps> = ({ product }) => {
  const { addItem, openCart, loading } = useCart()

  const pricingOptions = product.variants.map((variant, index) =>
    transformVariantToPricingOption(variant, index, product.variants),
  )

  const [selectedOptionId, setSelectedOptionId] = useState<number>(
    pricingOptions.find((o) => o.isPopular)?.id || 1,
  )
  const [addingToCart, setAddingToCart] = useState(false)

  const selectedOption = pricingOptions.find((o) => o.id === selectedOptionId) || pricingOptions[0]

  const isSerumLocked = selectedOption.count < 3

  const productImage = product.images[0]?.url || "https://via.placeholder.com/400"
  const productImageAlt = product.images[0]?.altText || product.title

  const handleAddToCart = async () => {
    if (!selectedOption.shopifyVariantId) {
      console.error("No variant ID found for selected option")
      return
    }

    setAddingToCart(true)
    try {
      await addItem(selectedOption.shopifyVariantId, 1)
      openCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <section className="py-16 bg-surface-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Image */}
          <div className="lg:w-1/2">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 flex items-center justify-center aspect-square lg:aspect-[4/5] relative">
                <div className="absolute inset-0 bg-blue-50/50 rounded-xl transform -rotate-1 scale-95 opacity-50 z-0"></div>
                <img
                  src={productImage}
                  alt={productImageAlt}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Header Info */}
            <div>
              <h2 className="font-display text-4xl lg:text-5xl text-slate-900 mb-4 leading-tight">
                {product.title}
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Ratings */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">Rated 4.9 | 1,842 Reviews</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <Scissors size={14} />, text: "Customizable Size" },
                { icon: <Heart size={14} />, text: "Heals Skin" },
                { icon: <Eraser size={14} />, text: "Removes Acne" },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white flex items-center gap-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                >
                  {badge.icon} {badge.text}
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-200 my-2"></div>

            {/* Pricing Selector */}
            <div className="grid grid-cols-3 gap-3">
              {pricingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOptionId(option.id)}
                  className={`
                    relative rounded-xl p-4 text-center transition-all duration-200
                    ${
                      selectedOptionId === option.id
                        ? "border-2 border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border border-gray-200 bg-white hover:border-primary/50 hover:shadow-md"
                    }
                  `}
                >
                  {option.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  {option.isBestValue && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                      Best Value
                    </div>
                  )}
                  <div
                    className={`font-bold text-lg mb-1 ${selectedOptionId === option.id ? "text-primary" : "text-slate-900"}`}
                  >
                    {option.label}
                  </div>
                  <div
                    className={`text-sm ${selectedOptionId === option.id ? "text-slate-700 font-medium" : "text-slate-500"}`}
                  >
                    ${option.pricePerUnit.toFixed(2)}/ea
                  </div>
                </button>
              ))}
            </div>

            {/* Free Gifts */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-primary uppercase tracking-wide">
                <Gift size={18} />
                Free Gifts With Your Order
              </div>

              <div className="space-y-3">
                {/* Gift 1 */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-primary bg-white shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-orange-50 rounded-md flex-shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqK068dwPAIvJyJ6Ce5pDQODLZZ8xXiwfis9drBWr7Q4o0779bewhrF69tSVj17BT2eGZJdsqK8hqI257eXDz8n4WQza6mCdAhwbXjsVEaTUK0ZCy7-HoZFK9rm4If8u56f7b6PnHQcWbR-WJJKRj4SjxEwWknLlWed9RU9IhyneIn-VgzhP86yafqs-BDdD2xFZqaFjxXwcnWuvsnYynTmaVKvfxs0rpo937BkT9D9c0vm3xtd_IiSJGYTLdvJJm9bC40sM816A"
                        alt="Kit"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Acne Remover Kit</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Complete acne removal kit to enhance your skincare routine.
                      </div>
                    </div>
                  </div>
                  <div className="text-right pl-2">
                    <div className="text-xs line-through text-slate-400 mb-0.5">$24</div>
                    <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      FREE
                    </div>
                  </div>
                </div>

                {/* Gift 2 */}
                <div
                  className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all duration-300
                  ${
                    isSerumLocked
                      ? "border-gray-200 bg-gray-50 opacity-80"
                      : "border-primary bg-white shadow-sm relative overflow-hidden"
                  }
                `}
                >
                  {!isSerumLocked && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 bg-pink-50 rounded-md flex-shrink-0 overflow-hidden border border-gray-100 relative ${isSerumLocked ? "grayscale" : ""}`}
                    >
                      {isSerumLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10">
                          <Lock size={16} className="text-white" />
                        </div>
                      )}
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2t6aT_lETDjorA-9uREJCLkD6OSKjLI-gYtr_EEYC04UWIQJxeo0lrIWDus-TBtMG07xIkjBYND-ov6lF2iL-bSnPJH_3Av26GCL4aE94Dn3awpkxvFM_jMFF-ZNJpjS2W89uoY7QGLy5Kr8k5JYd0qc-6I-cDt0LgQxC1Z4APD62bYe_jqEW6B6fi62_ubB7jT7FF635bk0dL8-BCy3RKIAJzFygfOfJdGegVz6ATL7DcoA9pFGntkyS-JJO8QLN1CZfdoXFHA"
                        alt="Serum"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Niacinamide Serum</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Premium niacinamide serum for brighter, clearer skin.
                      </div>
                      {isSerumLocked && (
                        <div className="text-[10px] text-accent-red font-medium mt-1">
                          Select 3 Rolls to unlock
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right pl-2">
                    <div className="text-xs line-through text-slate-400 mb-0.5">$49</div>
                    <div
                      className={`text-xs font-bold px-2 py-0.5 rounded ${isSerumLocked ? "text-slate-500 bg-slate-200" : "text-primary bg-primary/10"}`}
                    >
                      {isSerumLocked ? "LOCKED" : "FREE"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total and CTA */}
            <div className="mt-4 pt-6 border-t border-gray-200">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold font-display text-slate-900">
                  ${selectedOption.totalPrice}
                </span>
                <span className="text-xl text-gray-400 line-through decoration-2">
                  ${selectedOption.originalPrice}
                </span>
                <span className="text-sm font-bold text-accent-red bg-red-50 px-2 py-1 rounded border border-red-100">
                  You Save (${selectedOption.originalPrice - selectedOption.totalPrice})
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || loading}
                className="w-full bg-primary hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-lg tracking-wide uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500 font-medium">
                <RefreshCw size={14} />
                $60 Refill ships in 30 Days
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 space-y-2 border-t border-gray-200 pt-6">
              <Accordion title="How Does It Work?">
                Our hydrocolloid patches absorb impurities and protect your skin, creating the
                perfect environment for faster healing. The patch draws out pus and fluids while
                preventing you from picking at the blemish.
              </Accordion>
              <Accordion title="What If It Doesn't Work?">
                We offer a 90-day money-back guarantee. If you don't see results, contact us for a
                full refund. We believe in our product and want you to be completely satisfied.
              </Accordion>
              <Accordion title="Does It Work For My Skin Type?">
                Yes! Our products are hypoallergenic and tested on all skin types, including
                sensitive skin. They are free from harsh chemicals and gentle enough for daily use.
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
