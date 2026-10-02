"use client";

import { CATEGORIES, type CategoryId, type CategoryProgress } from "@/db/data";

interface CategoryNavigationProps {
    activeCategory: CategoryId;
    getCategoryProgress: (categoryId: CategoryId) => CategoryProgress;
    onSelectCategory: (categoryId: CategoryId) => void;
}

export function CategoryNavigation({
    activeCategory,
    getCategoryProgress,
    onSelectCategory,
}: CategoryNavigationProps) {
    return (
        <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
                หมวดหมู่คำถาม
            </h3>
            <nav aria-label="หมวดหมู่คำถาม" className="space-y-1">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    const progress = getCategoryProgress(category.id);

                    return (
                        <button
                            key={category.id}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => onSelectCategory(category.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-2.5 min-w-0">
                                <Icon
                                    className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                                />
                                <span className="truncate">{category.label}</span>
                            </span>
                            <span
                                className={`ml-2 shrink-0 text-[10px] px-2 py-0.5 rounded-full font-mono ${isActive
                                    ? "bg-blue-700 text-blue-100"
                                    : "bg-slate-700 text-slate-400"
                                    }`}
                            >
                                {progress.answered}/{progress.total}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}