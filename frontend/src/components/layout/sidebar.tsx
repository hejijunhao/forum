"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { cn, PRODUCT_COLORS, type ProductColor } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  color: ProductColor;
}

interface SidebarProps {
  products: Product[];
  user?: { name: string; avatar?: string };
  onNewProduct?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  products,
  user,
  onNewProduct,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-surface transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Forum
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto text-lg font-semibold">
            F
          </Link>
        )}
        {onToggleCollapse && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Dashboard link */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-background text-text-primary"
              : "text-text-secondary hover:bg-background hover:text-text-primary"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Products section */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Products
            </h2>
          </div>
        )}

        <div className="mt-2 space-y-1">
          {products.map((product) => {
            const isActive = pathname.startsWith(`/products/${product.id}`);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-background text-text-primary"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
                )}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PRODUCT_COLORS[product.color] }}
                />
                {!collapsed && (
                  <span className="truncate">{product.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* New product button */}
        <button
          onClick={onNewProduct}
          className={cn(
            "mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary",
            collapsed && "justify-center"
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New Product</span>}
        </button>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname.startsWith("/settings")
              ? "bg-background text-text-primary"
              : "text-text-secondary hover:bg-background hover:text-text-primary"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        {user && (
          <div
            className={cn(
              "mt-1 flex items-center gap-3 rounded-md px-3 py-2",
              collapsed && "justify-center"
            )}
          >
            <Avatar src={user.avatar} fallback={user.name} size="sm" />
            {!collapsed && (
              <span className="truncate text-sm font-medium">{user.name}</span>
            )}
          </div>
        )}

        {collapsed && onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="mt-2 h-8 w-full"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
