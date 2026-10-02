"use client";

import React, { useState, useMemo } from "react";
import {
    Download,
    FileText,
    RotateCcw,
    Copy,
    Eye,
    X,
    Check,
    Filter,
    BookOpen,
} from "lucide-react";
import { CATEGORIES, QUESTIONS, type CategoryId } from "@/db/data";
import { CategoryNavigation } from "@/components/handbook/CategoryNavigation";
import { ProgressOverview } from "@/components/handbook/ProgressOverview";
import { QuestionList } from "@/components/handbook/QuestionList";

export default function App() {
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const [activeCategory, setActiveCategory] = useState<CategoryId>("work");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<
        "all" | "unanswered" | "answered"
    >("all");
    const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleAnswerChange = (id: number, text: string) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: text,
        }));
    };

    const totalQuestions = QUESTIONS.length;
    const answeredCount = useMemo(() => {
        return Object.values(answers).filter((val) => val && val.trim().length > 0)
            .length;
    }, [answers]);

    const overallProgressPercentage = Math.round(
        (answeredCount / totalQuestions) * 100,
    );

    const getCategoryProgress = (catId: CategoryId) => {
        const catQuestions = QUESTIONS.filter((q) => q.category === catId);
        if (catQuestions.length === 0)
            return { answered: 0, total: 0, percentage: 0 };
        const catAnswered = catQuestions.filter(
            (q) => answers[q.id] && answers[q.id].trim().length > 0,
        ).length;
        return {
            answered: catAnswered,
            total: catQuestions.length,
            percentage: Math.round((catAnswered / catQuestions.length) * 100),
        };
    };

    const filteredQuestions = useMemo(() => {
        return QUESTIONS.filter((q) => {
            // Category Filter
            if (q.category !== activeCategory) return false;

            // Status Filter
            const hasAnswer = answers[q.id] && answers[q.id].trim().length > 0;
            if (filterStatus === "answered" && !hasAnswer) return false;
            if (filterStatus === "unanswered" && hasAnswer) return false;

            // Search Query
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                const matchTitle = q.title.toLowerCase().includes(query);
                const matchHint = q.hint.toLowerCase().includes(query);
                const matchAnswer = (answers[q.id] || "").toLowerCase().includes(query);
                return matchTitle || matchHint || matchAnswer;
            }

            return true;
        });
    }, [activeCategory, filterStatus, searchQuery, answers]);

    // Load Demo Data for instant testing
    const loadDemoData = () => {
        const demo: Record<number, string> = {
            1: "1. เอกสารอนุมัติจ่ายเงินและสัญญาคู่ค้า 2. อีเมลจาก Board/C-Suite 3. เรื่องด่วนฉุกเฉิน",
            2: "สรุปวาระประชุมล่วงหน้าอย่างน้อย 3 ชม., ไม่จัดประชุมติดกันเกิน 2 ชั่วโมง ต้องมีพัก 15 นาที",
            3: "วันจันทร์และพุธ 09:00 - 11:00 น. เป็นช่วง Deep Work งดลงตารางนัดหมายทุกกรณี",
            4: "เวลางาน: Line / โทรศัพท์ | นอกเวลางานด่วนระดับ 1: โทรศัพท์เข้าเบอร์ส่วนตัวได้เลย",
            5: "เลขาเซ็นรับทราบหนังสือวนทั่วไปได้ เอกสารอนุมัติงบ > 10,000 บ. ต้องผ่านตาเท่านั้น",
            6: "อีเมลจาก Board และลูกค้ารายใหญ่ แจ้งทันที อีเมลขายของรวบรวมสรุปเย็นวันศุกร์",
            11: "1. คุณสมชาย (บริษัท A - คู่ค้าใหญ่) 2. คุณวิภา (บริษัท B) - ติดต่อมาให้แจ้งทันทีภายใน 15 นาที",
            26: "คุณภรรยา (เบอร์ 081-999-xxxx) และ คุณแม่ สามารถต่อสายตรงหรือแทรกคิวได้ตลอดเวลา",
            27: "วันเกิดภรรยา (15 มิ.ย.) เตือนล่วงหน้า 14 วัน / วันเกิดลูกค้า VIP เตือนล่วงหน้า 7 วัน",
            29: "ร้านอาหาร Fine Dining ญี่ปุ่น โซนสุขุมวิท / ร้านกาแฟเงียบสงบมีห้องส่วนตัว",
            30: "ผู้บริหารแพ้ถั่วและกุ้งสด / ไม่ทานเนื้อวัว / ภรรยาทานมังสวิรัติทุกวันพระ",
            51: "บริษัท A (Tech Startup - คุณสมชาย MD) และ บริษัท B (Property - คุณวิภา MD)",
            52: "ค่าน้ำ ค่าไฟ บัตรเครดิต ให้เลขาเตือนและสรุปยอดตัดจ่ายวันที่ 25 ของทุกเดือน",
            60: 'โฉนดตัวจริงเก็บตู้เซฟบ้าน สัญญา PDF เก็บ Google Drive Folder "Legal_Master"',
            76: "แพ้ยา Penicillin และแพ้อาหารทะเลเปลือกแข็ง (กุ้ง/ปู) มีโรคความดันโลหิตสูงเล็กน้อย",
            77: "โรงพยาบาลบำรุงราษฎร์ (นพ.สมชาย อายุรกรรม) ประกันสุขภาพ AIA VIP",
            81: "กาแฟ: อเมริกาโน่เย็นไม่หวานเลย (0% Sugar) / อาหารเน้นคลีน Low Carb High Protein",
        };
        setAnswers(demo);
    };

    const handleReset = () => {
        if (window.confirm("คุณต้องการล้างข้อมูลคำตอบทั้งหมดใช่หรือไม่?")) {
            setAnswers({});
        }
    };

    const generateMarkdown = () => {
        const dateStr = new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        let md = `# 📘 Executive Assistant Handbook\n`;
        md += `> **คู่มือและข้อมูลการบริหารจัดการสำหรับเลขาบริหาร (Executive Assistant)**\n`;
        md += `> **อัปเดตล่าสุด:** ${dateStr}\n`;
        md += `> **สถานะการตอบข้อมูล:** ${answeredCount} / ${totalQuestions} ข้อ (${overallProgressPercentage}% Completed)\n\n`;

        md += `---\n\n`;
        md += `## 📊 สรุปความคืบหน้าตามหมวดหมู่\n\n`;

        CATEGORIES.forEach((cat) => {
            const prog = getCategoryProgress(cat.id);
            md += `- **${cat.label}:** ${prog.answered}/${prog.total} ข้อ (${prog.percentage}%)\n`;
        });

        md += `\n---\n\n`;

        CATEGORIES.forEach((cat) => {
            const catQuestions = QUESTIONS.filter((q) => q.category === cat.id);
            md += `## ${cat.label}\n\n`;

            catQuestions.forEach((q) => {
                const ans = answers[q.id] ? answers[q.id].trim() : "";
                md += `### ${q.title}\n`;
                md += `*คำอธิบายเพิ่มเติม:* ${q.hint}\n\n`;
                if (ans) {
                    md += `**📌 ข้อมูลบันทึก:**\n${ans
                        .split("\n")
                        .map((line) => `> ${line}`)
                        .join("\n")}\n\n`;
                } else {
                    md += `*⚠️ ยังไม่ได้ระบุข้อมูล*\n\n`;
                }
                md += `---\n\n`;
            });
        });

        md += `\n*เอกสารนี้จัดทำผ่านระบบ Executive Assistant Checklist System*\n`;
        return md;
    };

    const handleDownloadMarkdown = () => {
        const mdText = generateMarkdown();
        const blob = new Blob([mdText], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            `Executive_Assistant_Handbook_${new Date().toISOString().slice(0, 10)}.md`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyMarkdown = () => {
        const mdText = generateMarkdown();
        navigator.clipboard.writeText(mdText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white pb-16">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                Executive Assistant Checklist & Handbook
                            </h1>
                            <p className="text-xs text-slate-400">
                                ระบบจัดทำคู่มือและรวบรวมข้อมูลสำหรับเลขาบริหาร
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center flex-wrap gap-2">
                        <button
                            onClick={loadDemoData}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition border border-slate-700 cursor-pointer"
                            title="เติมข้อมูลตัวอย่างเพื่อทดสอบระบบ"
                        >
                            ตัวอย่าง
                        </button>

                        <button
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition border border-slate-700 cursor-pointer"
                            title="ล้างข้อมูลทั้งหมด"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                            onClick={() => setShowPreviewModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white transition shadow-md shadow-indigo-600/20 cursor-pointer"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Markdown
                        </button>

                        <button
                            onClick={handleDownloadMarkdown}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/25 cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export .MD
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
                <ProgressOverview
                    answeredCount={answeredCount}
                    totalQuestions={totalQuestions}
                    overallProgressPercentage={overallProgressPercentage}
                    activeCategory={activeCategory}
                    getCategoryProgress={getCategoryProgress}
                    onSelectCategory={setActiveCategory}
                />

                {/* Category Navigation & Questions List */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar Category Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 sticky top-24 space-y-4">
                            <CategoryNavigation
                                activeCategory={activeCategory}
                                getCategoryProgress={getCategoryProgress}
                                onSelectCategory={setActiveCategory}
                            />

                            {/* Status Filter */}
                            <div className="pt-4 border-t border-slate-700/60">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-2 flex items-center gap-1.5">
                                    <Filter className="w-3 h-3" /> สถานะการตอบ
                                </h3>
                                <div className="space-y-1">
                                    {[
                                        { id: "all", label: "ทั้งหมด" },
                                        { id: "unanswered", label: "ยังไม่ได้ตอบ" },
                                        { id: "answered", label: "ตอบแล้ว" },
                                    ].map((status) => (
                                        <button
                                            key={status.id}
                                            onClick={() => setFilterStatus(status.id as typeof filterStatus)}
                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${filterStatus === status.id
                                                    ? "bg-slate-700 text-blue-400 font-semibold"
                                                    : "text-slate-400 hover:text-slate-200"
                                                }`}
                                        >
                                            • {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </aside>

                    {/* Right Question Cards List */}
                    <div className="flex-1 min-w-0">
                        <QuestionList
                            questions={filteredQuestions}
                            answers={answers}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onAnswerChange={handleAnswerChange}
                        />

                        {/* Bottom Actions Banner */}
                        <div className="mt-8 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl p-6 border border-blue-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-white">
                                    พร้อมนำข้อมูลไปใช้งานหรือยัง?
                                </h4>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    คุณสามารถสั่ง Export เป็นไฟล์ Markdown (.md)
                                    เพื่อส่งต่อให้เลขาหรือนำไปเก็บใน Notion/Obsidian ได้ทันที
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownloadMarkdown}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30 whitespace-nowrap cursor-pointer"
                                >
                                    <Download className="w-4 h-4" />
                                    ดาวน์โหลดไฟล์ .MD
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            { }
            {showPreviewModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                <h3 className="text-sm font-bold text-white">
                                    Markdown File Preview (.md)
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyMarkdown}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-xs transition border border-slate-700 cursor-pointer"
                                >
                                    {copied ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                    {copied ? "คัดลอกเรียบร้อย!" : "คัดลอกข้อความ"}
                                </button>
                                <button
                                    onClick={handleDownloadMarkdown}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs transition cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    ดาวน์โหลด .md
                                </button>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content - Code View */}
                        <div className="p-6 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/80 leading-relaxed whitespace-pre-wrap selection:bg-blue-500 selection:text-white">
                            {generateMarkdown()}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 text-right">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs transition cursor-pointer"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
