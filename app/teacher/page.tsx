"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Stage = "upload" | "review";
type Question = { id: number; text: string; options: string[]; answer: string };

export default function TeacherPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [answerKey, setAnswerKey] = useState("");
  const [stage, setStage] = useState<Stage>("upload");
  const [questions, setQuestions] = useState<Question[]>([]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((old) => [...old, ...Array.from(list)]);
  }

  function previewExtraction() {
    if (!files.length || !answerKey.trim()) return;
    const answers = answerKey.toUpperCase().match(/[A-D]/g) || [];
    setQuestions(answers.map((answer, i) => ({ id: i + 1, text: `Question ${i + 1} will be extracted from the uploaded image.`, options: ["Option A", "Option B", "Option C", "Option D"], answer })));
    setStage("review");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <header className="border-b border-[#dfe6e1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
          <Image src="/logo.png" alt="Louis The Instructor" width={229} height={138} priority className="h-auto w-[140px]" />
          <div className="rounded-full bg-[#edf6f0] px-4 py-2 text-sm font-bold text-[#145c37]">Teacher Dashboard</div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-9 md:px-6 md:py-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#145c37]">Create New Test</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">Turn exercise images into an online test.</h1>
        <p className="mt-3 max-w-2xl text-slate-500">Upload photos or screenshots of your grammar exercises, add the answer key, review the extracted questions, then publish one link to your students.</p>

        <div className="mt-8 flex items-center gap-2 text-sm font-bold">
          {["1  Upload", "2  Review", "3  Publish"].map((label, i) => <div key={label} className={`rounded-full px-4 py-2 ${i === (stage === "upload" ? 0 : 1) ? "bg-[#145c37] text-white" : "bg-white text-slate-400"}`}>{label}</div>)}
        </div>

        {stage === "upload" ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm md:p-8">
              <label className="block"><span className="mb-2 block text-sm font-black">Test title</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Present Simple – Practice 01" className="w-full rounded-xl border border-slate-300 px-4 py-4 outline-none focus:border-[#145c37]" /></label>
            </div>

            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf6f0] text-2xl">▧</div>
              <h2 className="mt-4 text-xl font-black">Upload exercise images</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Upload clear JPG, PNG or WEBP images. You can select several pages at once and keep them in question order.</p>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              <button onClick={() => inputRef.current?.click()} className="mt-5 w-full rounded-2xl border-2 border-dashed border-[#9fc3ab] bg-[#f7fbf8] px-5 py-9 font-black text-[#145c37] hover:bg-[#edf6f0]">+ Choose exercise images</button>
              {files.length > 0 && <div className="mt-4 space-y-2">{files.map((file, i) => <div key={`${file.name}-${i}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="truncate font-semibold">{i + 1}. {file.name}</span><button onClick={() => setFiles(files.filter((_, x) => x !== i))} className="ml-3 font-bold text-slate-400 hover:text-red-600">Remove</button></div>)}</div>}
            </div>

            <div className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-xl font-black">Answer key</h2>
              <p className="mt-2 text-sm text-slate-500">Paste the answers in any simple format, for example: 1B 2A 3D 4C or B, A, D, C.</p>
              <textarea value={answerKey} onChange={(e) => setAnswerKey(e.target.value)} rows={4} placeholder="1B 2A 3D 4C 5A ..." className="mt-4 w-full resize-none rounded-xl border border-slate-300 px-4 py-4 font-medium outline-none focus:border-[#145c37]" />
            </div>

            <div className="rounded-3xl border border-[#cfe2d5] bg-[#edf6f0] p-6">
              <h3 className="font-black text-[#145c37]">What happens next?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">The system will read the uploaded images, identify each question and its A–D choices, match your answer key, and create editable online questions. You review everything before publishing.</p>
            </div>

            <button disabled={!files.length || !answerKey.trim()} onClick={previewExtraction} className="w-full rounded-xl bg-[#145c37] py-4 text-base font-black text-white hover:bg-[#0f4b2d] disabled:cursor-not-allowed disabled:bg-slate-300">Read images & create questions →</button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-black">Review extracted questions</h2><p className="mt-1 text-sm text-slate-500">{questions.length} answers detected. Image-reading API will populate the exact question text here.</p></div><button onClick={() => setStage("upload")} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold">← Back to upload</button></div>
            <div className="space-y-4">{questions.map((q) => <div key={q.id} className="rounded-2xl border border-[#dfe6e1] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="font-black">Question {q.id}</span><span className="rounded-full bg-[#edf6f0] px-3 py-1 text-sm font-black text-[#145c37]">Answer {q.answer}</span></div><input value={q.text} onChange={(e) => setQuestions((old) => old.map((x) => x.id === q.id ? {...x, text:e.target.value} : x))} className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#145c37]" /><div className="mt-3 grid gap-2 sm:grid-cols-2">{q.options.map((option, i) => <input key={i} value={option} onChange={(e) => setQuestions((old) => old.map((x) => x.id === q.id ? {...x, options:x.options.map((o,j)=>j===i?e.target.value:o)} : x))} className={`rounded-xl border px-4 py-3 outline-none ${q.answer === String.fromCharCode(65+i) ? "border-[#87b99a] bg-[#f2f8f4]" : "border-slate-200"}`} />)}</div></div>)}</div>
            <button className="mt-6 w-full rounded-xl bg-[#145c37] py-4 font-black text-white">Publish test & create student link →</button>
          </div>
        )}
      </section>
    </main>
  );
}
