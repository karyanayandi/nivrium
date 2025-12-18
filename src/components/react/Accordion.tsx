import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

interface AccordionProps {
  title: string
  children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 pb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-2 text-left group"
      >
        <span className="font-medium text-slate-800 group-hover:text-primary transition-colors text-sm">
          {title}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown size={18} className="text-slate-400 group-hover:text-primary" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm text-slate-600 leading-relaxed pb-4">{children}</div>
      </div>
    </div>
  )
}
