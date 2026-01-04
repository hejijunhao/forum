"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Terminal } from "./terminal";
import { type ProductColor } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  color: ProductColor;
}

interface AppShellProps {
  children: ReactNode;
  products: Product[];
  user?: { name: string; avatar?: string };
  onNewProduct?: () => void;
}

export function AppShell({ children, products, user, onNewProduct }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          products={products}
          user={user}
          onNewProduct={onNewProduct}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Terminal />
    </div>
  );
}
