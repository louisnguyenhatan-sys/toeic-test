"use client";

import Image from "next/image";
import { useState } from "react";

type Question = { id: number; text: string; options: string[]; answer: string; explanation: string };

const emptyQuestion = (id: number): Question => ({ id, text: "", options: ["", "", "", ""], answer: "A", explanation: "" });

export default function TeacherPage() {
  const [title, setTitle] = useState("Present Simple – Practice 01");
  const [className, setClassName] = useState("TOEIC Foundation");
  const [duration, setDuration] = useState("20");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: "The manager _____ the weekly report every Friday.", options: ["review", "reviews", "reviewing", "reviewed"], answer: "B", explanation: "A singular third-person subject takes a verb ending in -s in the present simple." },
    { id: 2, text: "Our employees _____ their ID cards when entering the building.", options: ["wear", "wears", "wearing", "wore"], answer: "A", explanation: "The plural subject employees takes the base form of the verb." },
  ]);

  const updateQuestion = (id: number, patch: Partial<Question>) => setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...patch } : q));
  const updateOption = (id: number, index: number, value: string) => setQuestions(qs => qs.map(q => q.id === id ? { ...q, options: q.options.map((o, i) => i === index ? value : o) } : q));
  const addQuestion = () => setQuestions(qs => [...qs, emptyQuestion(Date.now())]);
  const removeQuestion = (id: number) => setQuestions(qs => qs.length > 1 ? qs.filter(q => q.id !== id) : qs);

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <header className="border-b border-[#dfe6e1] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Image src="/logo.png" alt="Louis The Instructor" width={229} height={138} priority className="h-auto w-[145px]" />
          <div className="flex items-center gap-3"><span className="hidden text-sm text-slate-500 sm:block">Teacher workspace</span><div className="rounded-full bg-[#edf6f0] px-4 py-2 text-sm font-bold text-[#145c37]">Draft</div></div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-9 md:px-6">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#145c37]">Assignment Builder</p><h1 className="mt-2 text-3xl font-black md:text-4xl">Create grammar practice</h1><p className="mt-2 text-slate-500">Build the test, check the questions, then publish one link to your students.</p></div>
          <div className="flex gap-3"><button className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700">Save draft</button><button className="rounded-xl bg-[#145c37] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#0f4b2d]">Publish test</button></div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_310px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-lg font-black">Test information</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2"><span className="mb-2 block text-sm font-bold">Test title</span><input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#145c37]" /></label>
                <label><span className="mb-2 block text-sm font-bold">Class / group</span><input value={className} onChange={e=>setClassName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-[#145c37]" /></label>
                <label><span className="mb-2 block text-sm font-bold">Time limit</span><div className="relative"><input type="number" min="1" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-20 outline-none focus:border-[#145c37]"/><span className="absolute right-4 top-3.5 text-sm text-slate-400">minutes</span></div></label>
              </div>
            </div>

            <div className="flex items-center justify-between"><div><h2 className="text-xl font-black">Questions</h2><p className="text-sm text-slate-500">{questions.length} multiple-choice questions</p></div><button onClick={addQuestion} className="rounded-xl border border-[#145c37] bg-white px-4 py-2.5 text-sm font-bold text-[#145c37]">+ Add question</button></div>

            {questions.map((q, qi) => <article key={q.id} className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm md:p-7">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#145c37] text-sm font-black text-white">{qi+1}</span><h3 className="font-black">Question {qi+1}</h3></div><button onClick={()=>removeQuestion(q.id)} className="text-sm font-bold text-slate-400 hover:text-red-600">Remove</button></div>
              <textarea value={q.text} onChange={e=>updateQuestion(q.id,{text:e.target.value})} rows={2} placeholder="Type your question here..." className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3.5 font-medium outline-none focus:border-[#145c37]" />
              <div className="mt-4 grid gap-3 md:grid-cols-2">{q.options.map((option, oi) => { const letter=String.fromCharCode(65+oi); return <label key={letter} className={`flex items-center gap-3 rounded-xl border p-3 ${q.answer===letter?'border-[#87b99a] bg-[#f2f8f4]':'border-slate-200'}`}><input type="radio" name={`answer-${q.id}`} checked={q.answer===letter} onChange={()=>updateQuestion(q.id,{answer:letter})} className="accent-[#145c37]"/><span className="font-black text-[#145c37]">{letter}</span><input value={option} onChange={e=>updateOption(q.id,oi,e.target.value)} placeholder={`Option ${letter}`} className="min-w-0 flex-1 bg-transparent outline-none"/></label>})}</div>
              <label className="mt-4 block"><span className="mb-2 block text-sm font-bold text-slate-600">Explanation <span className="font-normal text-slate-400">(optional)</span></span><input value={q.explanation} onChange={e=>updateQuestion(q.id,{explanation:e.target.value})} placeholder="Explain why the answer is correct..." className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#145c37]"/></label>
            </article>)}
            <button onClick={addQuestion} className="w-full rounded-2xl border-2 border-dashed border-[#b9d2c2] bg-[#f8fbf9] py-5 font-bold text-[#145c37] hover:bg-[#f0f7f2]">+ Add another question</button>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#145c37]">Test summary</p><h3 className="mt-3 text-lg font-black">{title || "Untitled test"}</h3><p className="mt-1 text-sm text-slate-500">{className || "No class selected"}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><div className="text-2xl font-black">{questions.length}</div><div className="text-xs text-slate-500">Questions</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-2xl font-black">{duration || "—"}</div><div className="text-xs text-slate-500">Minutes</div></div></div></div>
            <div className="rounded-3xl border border-[#d7e6dc] bg-[#edf6f0] p-6"><h3 className="font-black text-[#145c37]">Student experience</h3><p className="mt-2 text-sm leading-6 text-slate-600">Students open one link, enter their full name, answer the questions and submit. No student account required.</p></div>
            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6"><h3 className="font-black">Import questions</h3><p className="mt-2 text-sm leading-6 text-slate-500">Excel / CSV import will be connected after the builder format is approved.</p><button className="mt-4 w-full rounded-xl border border-slate-300 py-3 text-sm font-bold text-slate-700">Upload Excel / CSV</button></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
