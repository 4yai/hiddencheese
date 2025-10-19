import React, { useEffect, useState } from 'react'
import { LogOut, PhoneIncoming, PhoneOutgoing, Voicemail, Clock, ShieldCheck } from 'lucide-react'
import Logo from './Logo'

type Props = { onLogout: () => void }

type Summary = {
  callsToday: number
  transfers: number
  missed: number
  voicemail: number
  avgHandleTime: string
  uptime: string
}

export default function Dashboard({ onLogout }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch('/api/dashboard/summary', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('lp_jwt') } })
      if (res.ok) setSummary(await res.json())
    }
    fetchSummary()
  }, [])

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Logo className="w-7 h-7 text-brand-500" />
          <div className="font-semibold">LinePilot Console</div>
        </div>
        <button className="btn-ghost" onClick={onLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<PhoneIncoming />} label="Calls Today" value={summary?.callsToday ?? 0} />
          <StatCard icon={<PhoneOutgoing />} label="Transfers" value={summary?.transfers ?? 0} />
          <StatCard icon={<Clock />} label="Avg Handle Time" text valueText={summary?.avgHandleTime ?? '--:--'} />
          <StatCard icon={<Voicemail />} label="Voicemail" value={summary?.voicemail ?? 0} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="title">Recent Activity</div>
              <div className="subtitle">From Twilio / Notion</div>
            </div>
            <div className="space-y-3">
              <div className="glass rounded-xl p-4 flex justify-between">
                <div>
                  <div className="font-medium">+1 (609) 364-9259 → Transferred</div>
                  <div className="subtitle">Press 9 transfer • 2m ago</div>
                </div>
                <div className="subtitle">CallSid: CAXXX…</div>
              </div>
              <div className="glass rounded-xl p-4 flex justify-between">
                <div>
                  <div className="font-medium">+1 (555) 201-9988 → Voicemail</div>
                  <div className="subtitle">No input • 15m ago</div>
                </div>
                <div className="subtitle">CallSid: CAYYY…</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-brand-500" />
              <div className="title">System Health</div>
            </div>
            <ul className="space-y-2 text-sm">
              <li>n8n Webhook: <span className="text-green-400">Healthy</span></li>
              <li>Twilio Number: <span className="text-green-400">Active</span></li>
              <li>Notion API: <span className="text-green-400">OK</span></li>
              <li>Uptime (24h): <span className="text-white/80">{summary?.uptime ?? '99.98%'}</span></li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, text=false, valueText='' }: { icon: React.ReactNode, label: string, value?: number, text?: boolean, valueText?: string }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">{icon}</div>
        <div>
          <div className="subtitle">{label}</div>
          {text ? <div className="text-xl font-semibold">{valueText}</div> : <div className="text-xl font-semibold">{value ?? 0}</div>}
        </div>
      </div>
    </div>
  )
}
