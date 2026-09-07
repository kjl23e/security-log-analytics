import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  PieChart as PieIcon, 
  RefreshCw, 
  Server,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, 
  AreaChart, Area
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export default function App() {
  const [topThreats, setTopThreats] = useState([]);
  const [actionDist, setActionDist] = useState([]);
  const [hourlySpikes, setHourlySpikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [threatsRes, actionRes, spikesRes] = await Promise.all([
        fetch('http://localhost:8080/api/analytics/top-threats'),
        fetch('http://localhost:8080/api/analytics/action-distribution'),
        fetch('http://localhost:8080/api/analytics/hourly-spikes')
      ]);

      if (!threatsRes.ok || !actionRes.ok || !spikesRes.ok) {
        throw new Error('Failed to fetch analytics from backend');
      }

      const threatsData = await threatsRes.json();
      const actionData = await actionRes.json();
      const spikesData = await spikesRes.json();

      setTopThreats(threatsData);
      setActionDist(actionData);
      setHourlySpikes(spikesData.map(item => ({
        ...item,
        formattedTime: new Date(item.attackHour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: '#38bdf8' }}>
            <ShieldAlert size={28} color="#ef4444" /> Autonomous Security Log Analytics Engine
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px', margin: 0 }}>
            Powered by Spring Boot 3 & DuckDB JDBC High-Speed In-Memory Queries
          </p>
        </div>
        <button 
          onClick={fetchData} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f8fafc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh Telemetry
        </button>
      </header>

      {error && (
        <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px', borderRadius: '6px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} />
          <span>Error connecting to backend API. Ensure Spring Boot application is running on port 8080.</span>
        </div>
      )}

      {/* Grid Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* Hourly Threat Spikes */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155', gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Activity size={20} color="#38bdf8" /> Hourly Threat Velocity & Attack Spikes
          </h2>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySpikes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="formattedTime" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#f8fafc' }} />
                <Area type="monotone" dataKey="eventCount" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.3} name="Flagged Events" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Threat IPs */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Server size={20} color="#ef4444" /> Top Flagged Source IPs
          </h2>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topThreats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="sourceIp" type="category" stroke="#94a3b8" width={110} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#f8fafc' }} />
                <Bar dataKey="flaggedCount" fill="#ef4444" name="Flagged Events" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Distribution */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <PieIcon size={20} color="#f59e0b" /> Firewall Action Breakdown
          </h2>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={actionDist} dataKey="total" nameKey="action" cx="50%" cy="50%" outerRadius={80} label={(entry) => entry.action}>
                  {actionDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
