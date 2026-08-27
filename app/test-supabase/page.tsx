"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Testing...");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("tests")
          .select("id, title")
          .limit(1);

        if (error) {
          setStatus("Supabase returned an error");
          setDetail(error.message);
          return;
        }

        setStatus("Connected successfully");
        setDetail(JSON.stringify(data));
      } catch (err) {
        setStatus("Connection failed");

        if (err instanceof Error) {
          setDetail(err.message);
        } else {
          setDetail(String(err));
        }
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-white p-10">
      <h1 className="text-3xl font-bold">Supabase Connection Test</h1>

      <p className="mt-6 text-xl">{status}</p>

      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-100 p-4">
        {detail}
      </pre>
    </main>
  );
}