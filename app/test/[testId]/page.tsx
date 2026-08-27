"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type AnswerLetter = "A" | "B" | "C" | "D";

type TestInfo = {
  id: string;
  title: string;
  slug: string;
};

const AUDIO_URL =
  "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-audio/Test%201%20-%20Part%201.mp3";

const questions = [
  {
    number: 1,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q1.png",
    answer: "D" as AnswerLetter,
  },
  {
    number: 2,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q2.png",
    answer: "C" as AnswerLetter,
  },
  {
    number: 3,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q3.png",
    answer: "B" as AnswerLetter,
  },
  {
    number: 4,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q4.png",
    answer: "C" as AnswerLetter,
  },
  {
    number: 5,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q5.png",
    answer: "D" as AnswerLetter,
  },
  {
    number: 6,
    image:
      "https://vmbomagswjxhdywogxnv.supabase.co/storage/v1/object/public/test-images/q6.png",
    answer: "A" as AnswerLetter,
  },
];

export default function StudentTestPage() {
  const params = useParams();

  const testSlug = Array.isArray(params.testId)
    ? params.testId[0]
    : params.testId;

  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [studentName, setStudentName] = useState("");

  const [answers, setAnswers] = useState<
    Record<number, AnswerLetter | undefined>
  >({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTest() {
      if (!testSlug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("tests")
        .select("id, title, slug")
        .eq("slug", testSlug)
        .single();

      if (error) {
        setMessage(`Could not load test: ${error.message}`);
        setLoading(false);
        return;
      }

      setTestInfo(data);
      setLoading(false);
    }

    loadTest();
  }, [testSlug]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(Boolean).length;
  }, [answers]);

  function chooseAnswer(
    questionNumber: number,
    answer: AnswerLetter
  ) {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  }

  async function handleSubmit() {
    if (!testInfo) return;

    if (!studentName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (answeredCount !== questions.length) {
      setMessage(
        `Please answer all questions. You have answered ${answeredCount}/${questions.length}.`
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    let correctAnswers = 0;

    questions.forEach((question) => {
      if (answers[question.number] === question.answer) {
        correctAnswers += 1;
      }
    });

    const { error } = await supabase
      .from("submissions")
      .insert({
        test_id: testInfo.id,
        student_name: studentName.trim(),
        score: correctAnswers,
        total_questions: questions.length,
      });

    if (error) {
      setMessage(`Could not submit test: ${error.message}`);
      setSubmitting(false);
      return;
    }

    setScore(correctAnswers);
    setSubmitted(true);
    setSubmitting(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6]">
        <p className="text-slate-500">
          Loading test...
        </p>
      </main>
    );
  }

  if (!testInfo) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6] px-6">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-slate-900">
            Test not found
          </h1>

          <p className="mt-3 text-red-600">
            {message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b border-[#dfe6e1] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Image
            src="/logo.png"
            alt="Louis The Instructor"
            width={229}
            height={138}
            priority
            className="h-auto w-[120px] md:w-[145px]"
          />

          <div className="rounded-full border border-[#d4e0d8] bg-[#f4f8f5] px-4 py-2 text-xs font-bold text-[#145c37] md:text-sm">
            TOEIC Online Testing
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {submitted && (
          <div className="mb-8 rounded-3xl border border-[#cfe2d5] bg-white p-7 text-center shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#145c37]">
              Test completed
            </p>

            <h1 className="mt-3 text-3xl font-black text-slate-950">
              {studentName}
            </h1>

            <div className="mt-6 text-6xl font-black text-[#145c37]">
              {score}/{questions.length}
            </div>

            <p className="mt-3 text-slate-500">
              Your result has been submitted successfully.
            </p>
          </div>
        )}

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#145c37]">
            Listening Test
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
            {testInfo.title}
          </h1>

          <p className="mt-3 text-slate-500">
            Part 1 — Photographs · Questions 1–6
          </p>
        </div>

        {!submitted && (
          <div className="mb-7 rounded-2xl border border-[#dfe6e1] bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Full name
            </label>

            <input
              value={studentName}
              onChange={(event) =>
                setStudentName(event.target.value)
              }
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-4 text-base text-slate-900 outline-none focus:border-[#145c37] focus:ring-4 focus:ring-[#e4efe8]"
            />
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-[#dfe6e1] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#145c37]">
            Listening Audio
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Listen to the recording and select the best answer for each photograph.
          </p>

          <audio
            controls
            preload="metadata"
            className="mt-4 w-full"
          >
            <source
              src={AUDIO_URL}
              type="audio/mpeg"
            />
            Your browser does not support audio playback.
          </audio>
        </div>

        {!submitted && (
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">
              Progress
            </span>

            <span className="font-bold text-[#145c37]">
              {answeredCount}/{questions.length} answered
            </span>
          </div>
        )}

        <div className="space-y-7">
          {questions.map((question) => {
            const selectedAnswer =
              answers[question.number];

            return (
              <article
                key={question.number}
                className="rounded-3xl border border-[#dfe6e1] bg-white p-5 shadow-sm md:p-7"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-950">
                    Question {question.number}
                  </h2>

                  {selectedAnswer && !submitted && (
                    <span className="rounded-full bg-[#f0f7f2] px-3 py-1 text-xs font-bold text-[#145c37]">
                      Answered
                    </span>
                  )}
                </div>

                <div className="flex justify-center overflow-hidden rounded-2xl bg-slate-100 p-2">
                  <img
                    src={question.image}
                    alt={`TOEIC Question ${question.number}`}
                    className="max-h-[650px] w-auto max-w-full object-contain"
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(
                    ["A", "B", "C", "D"] as AnswerLetter[]
                  ).map((option) => {
                    const selected =
                      selectedAnswer === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          chooseAnswer(
                            question.number,
                            option
                          )
                        }
                        className={`rounded-xl border py-4 text-base font-black transition ${
                          selected
                            ? "border-[#145c37] bg-[#145c37] text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-[#145c37] hover:bg-[#f4f8f5]"
                        } disabled:cursor-default`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
                    <span className="font-semibold text-slate-600">
                      Your answer:
                    </span>{" "}
                    <span
                      className={
                        selectedAnswer === question.answer
                          ? "font-black text-[#145c37]"
                          : "font-black text-red-600"
                      }
                    >
                      {selectedAnswer}
                    </span>

                    {selectedAnswer !==
                      question.answer && (
                      <>
                        {" · "}
                        <span className="font-semibold text-slate-600">
                          Correct answer:
                        </span>{" "}
                        <span className="font-black text-[#145c37]">
                          {question.answer}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {message && !submitted && (
          <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            {message}
          </div>
        )}

        {!submitted && (
          <div className="mt-8 rounded-3xl border border-[#dfe6e1] bg-white p-6 shadow-sm">
            <p className="font-black text-slate-950">
              Ready to submit?
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You answered {answeredCount} of{" "}
              {questions.length} questions.
            </p>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="mt-5 w-full rounded-xl bg-[#145c37] py-4 text-base font-bold text-white transition hover:bg-[#0f4b2d] disabled:bg-slate-300"
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          </div>
        )}

        <footer className="py-10 text-center text-xs text-slate-400">
          Louis The Instructor · TOEIC Online Testing System
        </footer>
      </section>
    </main>
  );
}