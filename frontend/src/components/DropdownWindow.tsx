'use client';

import { useState } from "react";

type UseDropdownType = {
    windowIds: Record<string, boolean>
}

export function useDropdown(windowIds: UseDropdownType["windowIds"]) {
    const [dropdownState, setDropdownState] = useState<UseDropdownType["windowIds"]>(windowIds)

    function openDropdown(key: keyof UseDropdownType["windowIds"]) {
        setDropdownState(p => ({ ...p, [key]: true }) )
    }

    function closeDropdown(key: keyof UseDropdownType["windowIds"]) {
        setDropdownState(p => ({ ...p, [key]: false }) )
    }

    function switchDropdown(key: keyof UseDropdownType["windowIds"]) {
        setDropdownState(p => ({ ...p, [key]: !p[key] }) )
    }

    return {
        dropdownState,
        openDropdown,
        closeDropdown,
        switchDropdown,
        useDropdownStates: {
            closeDropdown,
        }
    }
}

type DropdownWindowProps = {
    dropdownId: keyof UseDropdownType["windowIds"]
    useDropdownStates: {
        closeDropdown: (key: keyof UseDropdownType["windowIds"]) => void,
    }
    buttonOptions: React.ReactNode[]
    className?: string
}

export default function DropdownWindow({ dropdownId, useDropdownStates, buttonOptions, className }: DropdownWindowProps) {
    const { closeDropdown } = useDropdownStates
    
    return (
        <>
            <div className="dropdown-slate w-full h-full fixed top-0 left-0 z-(--z-options)" 
                onClick={_ => closeDropdown(`${dropdownId}`)}
            />

            <div className={`${className ?? ""} dropdown-window 
                min-w-20 absolute right-0 z-(--z-options) 
                bg-foreground text-background
            `}>
                {buttonOptions.map((option, idx) => (
                    <button key={idx}
                        onClick={_ => {
                            closeDropdown(`${dropdownId}`)
                        }}
                        className="w-full p-1 block text-left hover:bg-(--red-clr) hover:text-foreground"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </>
    )
}