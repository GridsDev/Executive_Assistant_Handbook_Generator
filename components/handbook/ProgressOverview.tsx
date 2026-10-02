"use client";

import { ShieldCheck } from "lucide-react";
import {
    CATEGORIES,
    type CategoryId,
    type CategoryProgress,
} from "@/db/data";

interface ProgressOverviewProps {
    answeredCount: number;
    totalQuestions: number;
    overallProgressPercentage: number;
    activeCategory: CategoryId;
    getCategoryProgress: (categoryId: CategoryId) => CategoryProgress;
    onSelectCategory: (categoryId: CategoryId) => void;
}

export function ProgressOverview({
    answeredCount,
    totalQuestions,
    overallProgressPercentage,
    activeCategory,
    getCategoryProgress,
    onSelectCategory,
}: ProgressOverviewProps) {
    return (
        <section className="mb-8 bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-base font-semibold text-slate-100">
                            ความคืบหน้าภาพรวม (Overall Progress)
                        </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        กรอกข้อมูลเรียบร้อยแล้ว{" "}
                        <span className="text-blue-400 font-semibold">
                            {answeredCount}
                        </span>{" "}
                        จากทั้งหมด <span className="text-slate-300">{totalQuestions}</span> ข้อ
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-blue-400">
                            {overallProgressPercentage}%
                        </span>
                        <span className="text-xs text-slate-400">เสร็จสมบูรณ์</span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-slate-700/60 h-3 rounded-full overflow-hidden p-0.5 border border-slate-600/40">
                <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${overallProgressPercentage}%` }}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                {CATEGORIES.map((category) => {
                    const progress = getCategoryProgress(category.id);
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            aria-pressed={activeCategory === category.id}
                            onClick={() => onSelectCategory(category.id)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${activeCategory === category.id
                                ? "bg-slate-700/80 border-blue-500/80 ring-2 ring-blue-500/20"
                                : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className={`p-1.5 rounded-lg ${category.color} text-white`}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </span>
                                    <span className="text-xs font-medium text-slate-200 truncate">
                                        {category.label.split(".")[1]?.trim() ?? category.label}
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-slate-300">
                                    {progress.percentage}%
                                </span>
                            </div>
                            <span className="block w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <span
                                    className="block bg-blue-400 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1 text-right">
                                {progress.answered}/{progress.total} ข้อ
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}