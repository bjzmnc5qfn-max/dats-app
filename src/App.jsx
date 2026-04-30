import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, CalendarDays, CheckCircle2, ChevronDown, Flame, HeartPulse, Moon, Save, Shield, SunMedium } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const weeklyPlan = {
  Monday: {
    am: "Zone 2 Easy Run",
    pm: "Lower Body Alignment + Strength",
    green: "Full easy run + full PM lower body block.",
    yellow: "Keep it easy. Shorten run by 15–25%. Reduce PM strength volume.",
    red: "Walk or easy bike only. PM mobility + breathing.",
    why: "Monday builds aerobic base while the PM block keeps hips, glutes, ankles, and posture aligned for the week."
  },
  Tuesday: {
    am: "Swim Skill + Short Intervals",
    pm: "Upper Body Control",
    green: "Full swim technique + controlled intervals. Full PM upper body block.",
    yellow: "Technique only. Skip hard intervals. PM mobility + light control.",
    red: "Easy swim drills or rest. PM breathing + shoulder mobility.",
    why: "Swimming rewards efficiency. Technique saves energy before intensity is added."
  },
  Wednesday: {
    am: "Zone 2 Bike",
    pm: "Mobility + Core",
    green: "Full Zone 2 ride. Practice fueling if over 60 minutes.",
    yellow: "Shorten ride or keep very easy. PM mobility only if tired.",
    red: "Easy spin or walk. PM recovery reset.",
    why: "Bike base builds endurance with less impact than running, while core work protects your spine and posture."
  },
  Thursday: {
    am: "Run Intervals / Tempo",
    pm: "Lower Body Stability",
    green: "Complete planned intensity. PM controlled single-leg stability.",
    yellow: "Convert intervals to easy run. PM balance + mobility only.",
    red: "No running intensity. Walk, easy bike, or rest.",
    why: "Intensity teaches stress control, but only when your body is ready to absorb it."
  },
  Friday: {
    am: "Easy Swim",
    pm: "Upper Body Strength",
    green: "Easy base swim + full upper strength.",
    yellow: "Short easy swim. PM reduce volume.",
    red: "Recovery swim or rest. PM breathing + mobility.",
    why: "Friday keeps blood moving without beating up the legs before the weekend workload."
  },
  Saturday: {
    am: "Brick: Bike → Run",
    pm: "Coordination + Chaos Protection",
    green: "Full brick. Practice transitions and fueling.",
    yellow: "Shorten brick. Keep run easy. PM light flow only.",
    red: "No brick. Easy bike or walk. Mobility reset.",
    why: "Brick training teaches your legs and mind to handle the bike-to-run switch."
  },
  Sunday: {
    am: "Long Run",
    pm: "Full Recovery Reset",
    green: "Full long run. Practice relaxed form and fueling.",
    yellow: "Shorten long run by 20–40% or swap to bike.",
    red: "No long run. Walk, mobility, or full rest.",
    why: "The long run builds fatigue resistance, but recovery keeps the system sustainable."
  }
};

const lessons = [
  {
    title: "Zone 2 = Your Engine",
    text: "Zone 2 teaches your body to work longer without redlining. It should feel controlled, conversational, and almost boring. That boredom is the point: you are building efficiency."
  },
  {
    title: "Pain vs Fatigue",
    text: "Fatigue is general heaviness, burning, or effort. Pain is sharp, changing your movement, or getting worse. Fatigue can be managed. Pain changes the plan."
  },
  {
    title: "Control Before Intensity",
    text: "A hard workout only helps if your body can absorb it. If form breaks, you are no longer training performance; you are training compensation."
  },
  {
    title: "Fuel Before You Need It",
    text: "For sessions over 60–75 minutes, fueling is prevention. Waiting until you feel empty means you waited too long."
  }
];

function getTodayName() {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

function numberValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function DATSApp() {
  const [form, setForm] = useState({
    sleepHours: "",
    sleepQuality: "3",
    fatigue: "3",
    soreness: "3",
    pain: "None",
    hrv: "Normal",
    restingHr: "",
    trainingLoad: "Optimal",
    stress: "3",
    motivation: "3",
    notes: ""
  });
  const [day, setDay] = useState(getTodayName());
  const [saved, setSaved] = useState([]);
  const [showDecisionTree, setShowDecisionTree] = useState(false);

  const score = useMemo(() => {
    let s = 100;
    s -= numberValue(form.fatigue) * 10;
    s -= numberValue(form.soreness) * 5;
    s -= numberValue(form.stress) * 5;
    if (numberValue(form.sleepHours) < 6) s -= 15;
    if (form.hrv === "Low") s -= 15;
    if (form.trainingLoad === "High") s -= 10;
    if (form.pain === "Mild") s -= 8;
    if (form.pain === "Moderate") s -= 20;
    if (form.pain === "Sharp") s -= 40;
    return Math.max(0, Math.min(100, s));
  }, [form]);

  const dayType = score >= 75 ? "Green" : score >= 50 ? "Yellow" : "Red";
  const plan = weeklyPlan[day] || weeklyPlan.Monday;
  const recommendation = dayType === "Green" ? plan.green : dayType === "Yellow" ? plan.yellow : plan.red;

  const dayStyle = {
    Green: "bg-emerald-500/15 border-emerald-500/40 text-emerald-200",
    Yellow: "bg-yellow-500/15 border-yellow-500/40 text-yellow-100",
    Red: "bg-red-500/15 border-red-500/40 text-red-100"
  }[dayType];

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveLog = () => {
    const entry = {
      date: new Date().toLocaleString(),
      day,
      score,
      dayType,
      form: { ...form },
      recommendation
    };
    setSaved((prev) => [entry, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="pt-2">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Activity className="w-4 h-4" /> DATS Mobile
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Daily Adaptive Training System</h1>
          <p className="text-neutral-400 mt-2 text-sm">Answer the check-in. Get your day type, training adjustment, and the reason behind it.</p>
        </motion.div>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl shadow-lg">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-400">Today</p>
                <select value={day} onChange={(e) => setDay(e.target.value)} className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 mt-1 text-sm">
                  {Object.keys(weeklyPlan).map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className={`border rounded-2xl px-4 py-3 text-center ${dayStyle}`}>
                <p className="text-xs uppercase tracking-wide">{dayType}</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><Moon className="w-4 h-4" /> Morning Check-In</div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sleep Hours" value={form.sleepHours} onChange={(v) => update("sleepHours", v)} type="number" />
              <Select label="Sleep Quality" value={form.sleepQuality} onChange={(v) => update("sleepQuality", v)} options={["1", "2", "3", "4", "5"]} />
              <Select label="Fatigue" value={form.fatigue} onChange={(v) => update("fatigue", v)} options={["1", "2", "3", "4", "5"]} />
              <Select label="Soreness" value={form.soreness} onChange={(v) => update("soreness", v)} options={["1", "2", "3", "4", "5"]} />
              <Select label="Pain" value={form.pain} onChange={(v) => update("pain", v)} options={["None", "Mild", "Moderate", "Sharp"]} />
              <Select label="HRV Status" value={form.hrv} onChange={(v) => update("hrv", v)} options={["Low", "Normal", "High"]} />
              <Input label="Resting HR" value={form.restingHr} onChange={(v) => update("restingHr", v)} type="number" />
              <Select label="Training Load" value={form.trainingLoad} onChange={(v) => update("trainingLoad", v)} options={["Low", "Optimal", "High"]} />
              <Select label="Stress" value={form.stress} onChange={(v) => update("stress", v)} options={["1", "2", "3", "4", "5"]} />
              <Select label="Motivation" value={form.motivation} onChange={(v) => update("motivation", v)} options={["1", "2", "3", "4", "5"]} />
            </div>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Notes: hip, back, mood, Garmin context..." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm min-h-20" />
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><SunMedium className="w-4 h-4" /> Today’s Training Output</div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
              <p className="text-xs text-neutral-500">AM</p>
              <p className="font-semibold">{plan.am}</p>
            </div>
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
              <p className="text-xs text-neutral-500">PM</p>
              <p className="font-semibold">{plan.pm}</p>
            </div>
            <div className={`border rounded-xl p-3 ${dayStyle}`}>
              <p className="text-xs uppercase tracking-wide mb-1">Coach Adjustment</p>
              <p className="text-sm">{recommendation}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><Brain className="w-4 h-4" /> Learn Why</div>
            <p className="text-sm text-neutral-300">{plan.why}</p>
            <div className="grid gap-2">
              {lessons.map((lesson) => (
                <div key={lesson.title} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <p className="font-semibold text-sm">{lesson.title}</p>
                  <p className="text-xs text-neutral-400 mt-1">{lesson.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <button onClick={() => setShowDecisionTree(!showDecisionTree)} className="w-full flex items-center justify-between font-semibold">
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Coach Decision Tree</span>
              <ChevronDown className={`w-4 h-4 transition ${showDecisionTree ? "rotate-180" : ""}`} />
            </button>
            {showDecisionTree && (
              <div className="space-y-2 text-sm text-neutral-300">
                <Rule ifText="Sharp pain, limping, or pain increasing" thenText="Stop. Replace with walk, easy bike, or mobility." />
                <Rule ifText="HRV Low + poor sleep + fatigue 4–5" thenText="Red day. No intensity. Recovery only." />
                <Rule ifText="Yellow day" thenText="Keep consistency, reduce intensity." />
                <Rule ifText="Green day" thenText="Execute full plan without ego extras." />
                <Rule ifText="Session is over 60–75 min" thenText="Practice carbs + electrolytes." />
              </div>
            )}
          </CardContent>
        </Card>

        <Button onClick={saveLog} className="w-full rounded-2xl py-6 text-base bg-white text-black hover:bg-neutral-200">
          <Save className="w-4 h-4 mr-2" /> Save Today’s Log
        </Button>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl mb-10">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold"><CalendarDays className="w-4 h-4" /> Recent Logs</div>
            {saved.length === 0 ? <p className="text-sm text-neutral-500">No logs saved yet.</p> : saved.map((log, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm">
                <div className="flex justify-between"><span>{log.date}</span><span>{log.dayType} {log.score}</span></div>
                <p className="text-neutral-400 mt-1">{log.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="space-y-1">
      <p className="text-xs text-neutral-500">{label}</p>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm" />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="space-y-1">
      <p className="text-xs text-neutral-500">{label}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm">
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </label>
  );
}

function Rule({ ifText, thenText }) {
  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
      <p><span className="text-neutral-500">IF:</span> {ifText}</p>
      <p className="mt-1"><span className="text-neutral-500">THEN:</span> {thenText}</p>
    </div>
  );
}
