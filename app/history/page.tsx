"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const { data } = await supabase
        .from("gift_results")
        .select("*")
        .order("created_at", { ascending: false });

      setData(data || []);
    }

    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Gift History
        </h1>

        <div className="flex flex-col gap-6">

          {data.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{
                scale: 1.02,
                borderColor: "#ffffff",
                boxShadow: "0 0 40px rgba(255,255,255,0.08)",
              }}
            className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition duration-300 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {item.recipient_name}
              </h2>

              <div className="mb-6">
             <p className="text-zinc-400">
               {item.relationship}
            </p>

             <p className="text-sm text-zinc-500 mt-1">
              {new Date(item.created_at).toLocaleString()}
             </p>
             </div>
              <p className="whitespace-pre-wrap">
                {item.result}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </main>
  );
}