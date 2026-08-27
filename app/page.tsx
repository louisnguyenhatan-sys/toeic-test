"use client";

import { useState } from "react";
import Image from "next/image";

const questions = [
  {
    id: 1,
    text: "The manager will _____ the meeting until next Monday.",
    options: ["postpone", "postpones", "postponed", "postponing"],
    answer: "A",
  },
  {
    id: 2,
    text: "All employees must submit _____ reports by Friday.",
    options: ["they", "their", "them", "theirs"],
    answer: "B",
  },
  {
    id: 3,
    text: "The new branch _____ officially next month.",
    options: ["opens", "opened", "opening", "open"],
    answer: "A",
  },
  {
    id: 4,
    text: "Please contact Ms. Brown _____ you have any questions.",
    options: ["because", "if", "although", "despite"],
    answer: "B",
  },
  {
    id: 5,
    text: "The documents _____ before the deadline.",
    options: [
      "must submit",
      "must be submitted",
      "must submitting",
      "must submitted",
    ],
    answer: "B",
  },
];

function LouisLogo() {
  return (
    <Image
      src="/logo.png"
      alt="Louis The Instructor"
      width={229}
      height={138}
      priority
      className="h-auto w-[135px] md:w-[150px]"
    />
  );
}

export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const score = questions.filter(
    (question) => answers[question.id] === question.answer
  ).length;

  const percentage = Math.round((score / questions.length) * 100);

  const restartTest = () => {
    setStudentName("");
    setStarted(false);
    setAnswers({});
    setSubmitted(false);
  };

  if (!started) {
    return (
      <main className="min-h-screen bg-[#f7f8f6]">
        <header className="border-b border-[#dfe6e1] bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <LouisLogo />

            <div className="rounded-full border border-[#d4e0d8] bg-[#f4f8f5] px-4 py-2 text-sm font-semibold text-[#145c37]">
              TOEIC Online Testing
            </div>
          </div>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-150px)] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full bg-[#e8f1eb] px-4 py-2 text-sm font-semibold text-[#145c37]">
              TOEIC Practice Platform
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
              Practice TOEIC.
              <br />
              Track your score.
              <br />
              Improve faster.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Complete TOEIC practice tests directly online and receive your
              result immediately after submission.
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-slate-600">
              <span>✓ Instant scoring</span>
              <span>✓ TOEIC-style questions</span>
              <span>✓ Online practice</span>
            </div>
          </div>

          <div className="rounded-3xl border border-[#dfe6e1] bg-white p-8 shadow-xl shadow-slate-200/60">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#145c37]">
              Practice Test 01
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Ready to begin?
            </h2>

            <p className="mt-3 text-slate-500">
              Enter your full name before starting the test.
            </p>

            <label className="mb-2 mt-8 block text-sm font-bold text-slate-700">
              Full name
            </label>

            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && studentName.trim()) {
                  setStarted(true);
                }
              }}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-[#145c37] focus:ring-4 focus:ring-[#e4efe8]"
            />

            <button
              onClick={() => {
                if (studentName.trim()) {
                  setStarted(true);
                }
              }}
              disabled={!studentName.trim()}
              className="mt-5 w-full rounded-xl bg-[#145c37] py-4 text-base font-bold text-white transition hover:bg-[#0f4b2d] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Start Test
            </button>

            <p className="mt-5 text-center text-xs text-slate-400">
              Louis The Instructor · TOEIC Online Testing System
            </p>
          </div>
        </section>

        <footer className="border-t border-[#dfe6e1] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-5 text-center text-sm text-slate-400">
            © 2026 Louis The Instructor
          </div>
        </footer>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f7f8f6]">
        <header className="border-b border-[#dfe6e1] bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <LouisLogo />

            <p className="text-sm font-semibold text-slate-500">
              TOEIC Online Testing
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl border border-[#dfe6e1] bg-white p-8 shadow-sm">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#145c37]">
                Test Completed
              </p>

              <h1 className="mt-2 text-4xl font-black text-slate-950">
                Your Result
              </h1>

              <p className="mt-3 text-lg text-slate-500">{studentName}</p>
            </div>

            <div className="mx-auto my-10 max-w-sm rounded-3xl bg-[#16462f] p-8 text-center text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#c5d9cc]">
                Score
              </p>

              <div className="mt-3 text-6xl font-black">
                {score}/{questions.length}
              </div>

              <p className="mt-3 text-2xl font-bold text-[#d7eadf]">
                {percentage}%
              </p>

              <p className="mt-2 text-sm text-[#c5d9cc]">Correct answers</p>
            </div>

            <div className="space-y-4">
              {questions.map((question) => {
                const correct = answers[question.id] === question.answer;

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">
                          Question {question.id}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {question.text}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          correct
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="text-slate-600">
                        Your answer:{" "}
                        <span className="font-bold text-slate-900">
                          {answers[question.id] || "No answer"}
                        </span>
                      </p>

                      {!correct && (
                        <p className="mt-1 text-slate-600">
                          Correct answer:{" "}
                          <span className="font-bold text-green-700">
                            {question.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={restartTest}
              className="mt-8 w-full rounded-xl bg-[#145c37] py-4 font-bold text-white transition hover:bg-[#0f4b2d]"
            >
              Back to Home
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            © 2026 Louis The Instructor
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <header className="sticky top-0 z-20 border-b border-[#dfe6e1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <LouisLogo />

          <div className="text-right">
            <p className="text-xs font-medium text-slate-400">Student</p>
            <p className="font-bold text-slate-900">{studentName}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 rounded-3xl bg-[#16462f] p-7 text-white">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5d9cc]">
                TOEIC Practice Test 01
              </p>

              <h1 className="mt-2 text-3xl font-black">
                Part 5: Incomplete Sentences
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#dfece4]">
                Select the best answer to complete each sentence.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-wider text-[#dfece4]">
                Progress
              </p>

              <p className="mt-1 text-xl font-black">
                {Object.keys(answers).length}/{questions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {questions.map((question) => (
            <section
              key={question.id}
              className="rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm"
            >
              <p className="mb-5 text-lg font-bold leading-7 text-slate-900">
                {question.id}. {question.text}
              </p>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const letter = ["A", "B", "C", "D"][index];
                  const selected = answers[question.id] === letter;

                  return (
                    <label
                      key={letter}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                        selected
                          ? "border-[#145c37] bg-[#edf5f0]"
                          : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={selected}
                        onChange={() => handleAnswer(question.id, letter)}
                        className="h-4 w-4 accent-[#145c37]"
                      />

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                          selected
                            ? "bg-[#145c37] text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {letter}
                      </div>

                      <span className="text-slate-700">{option}</span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-[#dfe6e1] bg-white p-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="font-bold text-slate-900">Ready to submit?</p>

              <p className="mt-1 text-sm text-slate-500">
                You answered {Object.keys(answers).length} of {questions.length}{" "}
                questions.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="w-full rounded-xl bg-[#145c37] px-8 py-4 font-bold text-white transition hover:bg-[#0f4b2d] md:w-auto"
            >
              Submit Test
            </button>
          </div>
        </div>

        <footer className="py-10 text-center text-sm text-slate-400">
          © 2026 Louis The Instructor · TOEIC Online Testing System
        </footer>
      </div>
    </main>
  );
}