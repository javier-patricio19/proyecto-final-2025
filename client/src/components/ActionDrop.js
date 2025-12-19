import React, { useState, useEffect, useRef } from "react";

const ActionDrop = ({ item, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="action-drop-container" ref={dropdownRef} style={{position: 'relative'}}>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>⋮</button>
            {isOpen && (
                <ul className="dropdown-menu" style={{position: 'absolute', right: 0, zIndex: 100, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', listStyle: 'none', padding: '5px'}}>
                    <li onClick={(e) => { e.stopPropagation(); onEdit(item); setIsOpen(false); }} style={{cursor: 'pointer', padding: '5px'}}>Editar</li>
                    <li onClick={(e) => { e.stopPropagation(); onDelete(item.id); setIsOpen(false); }} style={{cursor: 'pointer', padding: '5px', color: 'red'}}>Eliminar</li>
                </ul>
            )}
        </div>
    );
};

export default ActionDrop;
