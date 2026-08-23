import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { useAuth } from "../auth.jsx";
import { useLanguage } from "../i18n.jsx";
import { PrimaryButton } from "./ui.jsx";

export default function BazaarChat({ onRequireAuth }) {
  const { t } = useLanguage();
  const { session, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [onlineCount, setOnlineCount] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    let active = true;

    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (active) {
          setMessages(data || []);
          setLoading(false);
        }
      });

    // A per-tab anonymous key so the "online" count reflects everyone
    // watching the chat, not just signed-in vendors -- more representative
    // of an actual live audience during a demo.
    const presenceKey = session?.user?.id || `guest-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel("bazaar-chat", { config: { presence: { key: presenceKey } } })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        // Dedupe against the optimistic insert in sendMessage() below --
        // if Realtime is working, this event still arrives (often before
        // the insert's own response resolves), so both paths can race.
        setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
      })
      .on("presence", { event: "sync" }, () => {
        setOnlineCount(Math.max(1, Object.keys(channel.presenceState()).length));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !session) return;
    const senderName = profile?.stall_name || session.user.email;
    const content = text.trim();
    setText("");

    // Don't rely solely on the Realtime echo to show the sender their own
    // message -- insert-and-select, then append locally. The Realtime
    // handler above dedupes by id, so this is safe if the echo also arrives.
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: session.user.id, sender_name: senderName, content })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-mesh-500 animate-pulse" />
        {t("chat_online_count", { n: onlineCount })}
      </div>

      <div className="border border-ink-200 rounded-lg h-64 overflow-y-auto p-3 space-y-2 bg-ink-25">
        {loading && <p className="text-xs text-ink-400">…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-sm text-ink-400">{t("chat_empty")}</p>
        )}
        {messages.map((m) => {
          const mine = session && m.sender_id === session.user.id;
          return (
            <div key={m.id} className={`text-sm max-w-[80%] ${mine ? "ml-auto text-right" : ""}`}>
              <p className={`inline-block px-3 py-1.5 rounded-lg ${mine ? "bg-saathi-500 text-white" : "bg-white border border-ink-200 text-ink-800"}`}>
                {m.content}
              </p>
              <p className="text-[10px] text-ink-400 mt-0.5">{m.sender_name}</p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {session ? (
        <form onSubmit={sendMessage} className="flex gap-2 mt-3">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("chat_placeholder")}
            maxLength={500}
            className="flex-1 text-sm border border-ink-300 rounded-[8px] px-3 py-2 focus:outline-none focus:shadow-focus"
          />
          <PrimaryButton type="submit" className="px-4">{t("chat_send")}</PrimaryButton>
        </form>
      ) : (
        <button
          onClick={onRequireAuth}
          className="w-full mt-3 text-sm font-medium text-saathi-700 bg-saathi-50 hover:bg-saathi-100 border border-saathi-200 rounded-[8px] py-2.5 transition-colors"
        >
          {t("chat_sign_in_prompt")}
        </button>
      )}
    </div>
  );
}
