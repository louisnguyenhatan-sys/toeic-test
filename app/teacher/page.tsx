"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TeacherPage() {
  const [testName, setTestName] = useState("");

  const [listeningFile, setListeningFile] = useState<File | null>(null);
  const [questionsFile, setQuestionsFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);

  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [createdLink, setCreatedLink] = useState("");

  function createSlug(text: string) {
    return (
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now()
    );
  }

  async function handleCreateTest() {
    if (!testName.trim()) {
      setMessage("Please enter a test name.");
      return;
    }

    try {
      setCreating(true);
      setMessage("");
      setCreatedLink("");

      const slug = createSlug(testName);

      const { data, error } = await supabase
        .from("tests")
        .insert({
          title: testName.trim(),
          slug: slug,
          listening_audio_url: null,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        setMessage("Could not create the test. Please try again.");
        return;
      }

      const link = `${window.location.origin}/test/${data.slug}`;

      setCreatedLink(link);

      setMessage(
        "Test created successfully. The test is now saved in Supabase."
      );
    } catch (error) {
      console.error(error);

      setMessage("Something went wrong while creating the test.");
    } finally {
      setCreating(false);
    }
  }

  function resetForm() {
    setTestName("");
    setListeningFile(null);
    setQuestionsFile(null);
    setAnswerFile(null);
    setMessage("");
    setCreatedLink("");

    const audioInput = document.getElementById(
      "listening-file"
    ) as HTMLInputElement | null;

    const questionsInput = document.getElementById(
      "questions-file"
    ) as HTMLInputElement | null;

    const answerInput = document.getElementById(
      "answer-file"
    ) as HTMLInputElement | null;

    if (audioInput) audioInput.value = "";
    if (questionsInput) questionsInput.value = "";
    if (answerInput) answerInput.value = "";
  }

  async function copyLink() {
    if (!createdLink) return;

    await navigator.clipboard.writeText(createdLink);

    setMessage("Test link copied.");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      {/* HEADER */}

      <header className="border-b border-[#dfe6e1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Image
            src="/logo.png"
            alt="Louis The Instructor"
            width={229}
            height={138}
            priority
            className="h-auto w-[135px] md:w-[150px]"
          />

          <div className="rounded-full border border-[#d4e0d8] bg-[#f4f8f5] px-4 py-2 text-sm font-semibold text-[#145c37]">
            Teacher Dashboard
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#145c37]">
            TOEIC Test Management
          </p>

          <h1 className="mt-2 text-4xl font-black text-slate-950">
            Create a new test
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Upload your TOEIC materials and create an online test for your
            students.
          </p>
        </div>

        {/* CREATE TEST CARD */}

        <div className="rounded-3xl border border-[#dfe6e1] bg-white p-8 shadow-sm">
          <div className="space-y-7">
            {/* TEST NAME */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Test name
              </label>

              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Example: TOEIC Practice Test 01"
                className="w-full rounded-xl border border-slate-300 px-4 py-4 text-slate-900 outline-none transition focus:border-[#145c37] focus:ring-4 focus:ring-[#e4efe8]"
              />
            </div>

            {/* LISTENING AUDIO */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Listening audio
              </label>

              <p className="mb-3 text-sm text-slate-500">
                Upload the MP3 file used for the Listening section.
              </p>

              <input
                id="listening-file"
                type="file"
                accept=".mp3,audio/*"
                onChange={(e) =>
                  setListeningFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-700"
              />

              {listeningFile && (
                <div className="mt-3 rounded-xl bg-[#f4f8f5] px-4 py-3 text-sm text-[#145c37]">
                  ✓ {listeningFile.name}
                </div>
              )}
            </div>

            {/* QUESTIONS FILE */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Questions file
              </label>

              <p className="mb-3 text-sm text-slate-500">
                Upload the TOEIC questions as an Excel or CSV file.
              </p>

              <input
                id="questions-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) =>
                  setQuestionsFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-700"
              />

              {questionsFile && (
                <div className="mt-3 rounded-xl bg-[#f4f8f5] px-4 py-3 text-sm text-[#145c37]">
                  ✓ {questionsFile.name}
                </div>
              )}
            </div>

            {/* ANSWER KEY */}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Answer key
              </label>

              <p className="mb-3 text-sm text-slate-500">
                Upload the correct answers for automatic scoring.
              </p>

              <input
                id="answer-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) =>
                  setAnswerFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-700"
              />

              {answerFile && (
                <div className="mt-3 rounded-xl bg-[#f4f8f5] px-4 py-3 text-sm text-[#145c37]">
                  ✓ {answerFile.name}
                </div>
              )}
            </div>

            {/* MATERIAL STATUS */}

            <div className="rounded-2xl bg-[#f4f8f5] p-5">
              <p className="font-bold text-[#145c37]">Test materials</p>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div
                  className={
                    testName.trim()
                      ? "font-semibold text-[#145c37]"
                      : "text-slate-400"
                  }
                >
                  {testName.trim() ? "✓" : "○"} Test information
                </div>

                <div
                  className={
                    listeningFile
                      ? "font-semibold text-[#145c37]"
                      : "text-slate-400"
                  }
                >
                  {listeningFile ? "✓" : "○"} Listening MP3
                </div>

                <div
                  className={
                    questionsFile
                      ? "font-semibold text-[#145c37]"
                      : "text-slate-400"
                  }
                >
                  {questionsFile ? "✓" : "○"} Questions
                </div>

                <div
                  className={
                    answerFile
                      ? "font-semibold text-[#145c37]"
                      : "text-slate-400"
                  }
                >
                  {answerFile ? "✓" : "○"} Answer key
                </div>
              </div>
            </div>

            {/* MESSAGE */}

            {message && (
              <div className="rounded-2xl border border-[#d7e6dc] bg-[#f4f8f5] p-4 text-sm font-medium text-[#145c37]">
                {message}
              </div>
            )}

            {/* CREATED LINK */}

            {createdLink && (
              <div className="rounded-2xl border border-[#d7e6dc] bg-white p-5">
                <p className="text-sm font-bold text-slate-900">
                  Student test link
                </p>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={createdLink}
                    readOnly
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  />

                  <button
                    type="button"
                    onClick={copyLink}
                    className="rounded-xl border border-[#145c37] px-5 py-3 text-sm font-bold text-[#145c37] transition hover:bg-[#f4f8f5]"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* BUTTONS */}

            <button
              type="button"
              onClick={handleCreateTest}
              disabled={!testName.trim() || creating}
              className="w-full rounded-xl bg-[#145c37] py-4 text-base font-bold text-white transition hover:bg-[#0f4b2d] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {creating ? "Creating Test..." : "Create Test"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="w-full rounded-xl border border-slate-300 bg-white py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Form
            </button>

            <p className="text-center text-xs text-slate-400">
              Louis The Instructor · TOEIC Online Testing System
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}