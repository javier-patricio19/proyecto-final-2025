import React, { useState, useEffect, useRef } from "react";
import styles from '../../styles/stylesObservacion/ActionDrop.module.css';

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

    const handleAction = (action, e) => {
        e.stopPropagation();
        if (action === 'edit') onEdit(item);
        if (action === 'delete') onDelete(item.id);
        setIsOpen(false);
    }

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
                className={styles.actionDropBtn} 
                title="Opciones"
            >
                ⋮
            </button>
            
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    <li className={styles.dropdownItem} onClick={(e) => handleAction('edit', e)}>
                        <span className={styles.icon}>✏️</span> Editar
                    </li>
                    <li className={`${styles.dropdownItem} ${styles.delete}`} onClick={(e) => handleAction('delete', e)}>
                        <span className={styles.icon}>🗑️</span> Eliminar
                    </li>
                </ul>
            )}
        </div>
    );
};

export default ActionDrop;