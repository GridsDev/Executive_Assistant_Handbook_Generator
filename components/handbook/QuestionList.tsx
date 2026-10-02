"use client";

import {
    CheckCircle2,
    Circle,
    HelpCircle,
    Search,
} from "lucide-react";
import type { Question } from "@/db/data";

interface QuestionListProps {
    questions: Question[];
    answers: Record<number, string>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAnswerChange: (questionId: number, answer: string) => void;
}

export function QuestionList({
    questions,
    answers,
    searchQuery,
    onSearchChange,
    onAnswerChange,
}: QuestionListProps) {
    return (
        <>
            <div className="mb-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    aria-label="ค้นหาคำถาม"
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="ค้นหาคำถาม ตัวอย่างคำตอบ หรือเนื้อหาที่ตอบไว้..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-700 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                        ล้าง
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs text-slate-400 font-medium">
                    พบ {questions.length} คำถาม
                </span>
                <span className="text-xs text-slate-500">
                    คำตอบอยู่ชั่วคราวในหน้านี้ และจะหายเมื่อปิดหรือรีเฟรชหน้า
                </span>
            </div>

            {questions.length === 0 ? (
                <div className="bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-800">
                    <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-300">
                        ไม่พบคำถามที่ตรงกับเงื่อนไขการค้นหา
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {questions.map((question) => {
                        const answer = answers[question.id] || "";
                        const isFilled = answer.trim().length > 0;
                        return (
                            <div
                                key={question.id}
                                className={`group rounded-2xl p-5 border transition-all duration-200 ${isFilled
                                    ? "bg-slate-800/80 border-slate-700/80"
                                    : "bg-slate-800/30 border-slate-800 hover:border-slate-700/60"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span
                                            className={`inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full text-xs font-bold ${isFilled
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : "bg-slate-700 text-slate-400"
                                                }`}
                                        >
                                            {question.id}
                                        </span>
                                        <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                                            {question.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {isFilled ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" /> ตอบแล้ว
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700/50">
                                                <Circle className="w-3 h-3" /> รอกรอก
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 mb-3 pl-8">
                                    {question.hint}
                                </p>

                                <div className="pl-8">
                                    <textarea
                                        rows={2}
                                        aria-label={question.title}
                                        value={answer}
                                        onChange={(event) => onAnswerChange(question.id, event.target.value)}
                                        placeholder={question.placeholder}
                                        className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition resize-y min-h-[70px]"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}