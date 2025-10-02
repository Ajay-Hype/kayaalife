'use client';

import { useState, useEffect } from 'react';

export interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  showInMenu: boolean;
  menuOrder: number;
  menuLevel: number;
  parentId?: string;
  children?: MenuItem[];
  productCount?: number;
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu items from categories API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${API_BASE_URL}/menu-management/menu-items`);
      
      if (!response.ok) {
        // If categories API fails, use fallback data
        console.warn('Categories API not available, using fallback menu items');
        setMenuItems([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Menu management API already returns hierarchical data
        setMenuItems(data.data);
      } else {
        setMenuItems([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch menu items:', err);
      setError(null); // Don't show error, just use empty menu
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize menu items with delay to avoid blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuItems();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Refresh menu items (useful after admin changes)
  const refreshMenuItems = () => {
    fetchMenuItems();
  };

  return {
    menuItems,
    loading,
    error,
    refreshMenuItems
  };
}
