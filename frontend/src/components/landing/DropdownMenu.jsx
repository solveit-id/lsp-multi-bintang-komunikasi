import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ icon, placeholder, options }) {

const [selected,setSelected] = useState(placeholder)
const [open,setOpen] = useState(false)

return (

    <div className="relative w-full" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>

        {/* Trigger */}
        <div className="flex items-center gap-3 border border-gray-200 bg-white/80 px-4 py-3 rounded-xl text-sm text-gray-700 cursor-pointer hover:border-yellow-400 transition">

            {icon}

            <span className="flex-1">{selected}</span>

            <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180":""}`}/>

        </div>

        {/* Dropdown */}
        <div className={`absolute left-0 top-full w-full bg-white rounded-xl shadow-lg border overflow-hidden z-50 transition-all duration-200
        ${open ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}`}>

            {options.map((item,i)=>(
                <div key={i} onClick={()=>{ setSelected(item)
                    setOpen(false)
                    }} className="px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer transition">

                    {item}

                </div>
            ))}

        </div>

    </div>

)}