import { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseEnabled } from "./lib/supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(supabaseEnabled);

  async function loadProfile(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    setProfile(data || null);
  }

  useEffect(() => {
    if (!supabaseEnabled) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) loadProfile(newSession.user.id);
      else setProfile(null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email, password, stallName, item) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.session) {
      await supabase.from("profiles").upsert({ id: data.user.id, stall_name: stallName, item });
      await loadProfile(data.user.id);
    }
    return data;
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateProfile(fields) {
    if (!session) return;
    await supabase.from("profiles").upsert({ id: session.user.id, ...fields });
    await loadProfile(session.user.id);
  }

  const value = { enabled: supabaseEnabled, session, profile, loading, signUp, signIn, signOut, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
