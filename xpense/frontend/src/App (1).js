import { useState, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, Upload, Tag, CreditCard, Sparkles,
  TrendingUp, TrendingDown, ChevronRight, FileText,
  CheckCircle, AlertCircle, AlertTriangle, Info, Download
} from "lucide-react";

/* ─── FONT INJECTION ──────────────────────────────────────── */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

/* ─── CATEGORY CONFIG ─────────────────────────────────────── */
const CAT = {
  Food:          { color:"#FF6B6B", emoji:"🍔", bg:"rgba(255,107,107,0.13)", kw:["zomato","swiggy","blinkit","zepto","dunzo","restaurant","cafe","dominos","pizza","burger","kfc","mcdonald","starbucks","food","eat","meal","kitchen","biryani","dine"] },
  Travel:        { color:"#4ECDC4", emoji:"🚗", bg:"rgba(78,205,196,0.13)",  kw:["uber","ola","rapido","bus","train","metro","flight","irctc","makemytrip","yatra","taxi","auto","redbus","travel","cab"] },
  Shopping:      { color:"#A78BFA", emoji:"🛍️", bg:"rgba(167,139,250,0.13)",kw:["amazon","flipkart","myntra","ajio","meesho","nykaa","bigbasket","shop","store","mart","purchase","grofers"] },
  Entertainment: { color:"#F59E0B", emoji:"🎬", bg:"rgba(245,158,11,0.13)",  kw:["netflix","hotstar","spotify","prime","bookmyshow","pvr","inox","youtube","gaming","game","movie"] },
  Utilities:     { color:"#6EE7B7", emoji:"⚡", bg:"rgba(110,231,183,0.13)", kw:["electricity","water","gas","broadband","mobile","recharge","jio","airtel","vi","bsnl","wifi","internet","bill"] },
  Health:        { color:"#FB7185", emoji:"💊", bg:"rgba(251,113,133,0.13)", kw:["pharmacy","apollo","medplus","gym","fitness","doctor","hospital","clinic","medicine","health"] },
  Other:         { color:"#94A3B8", emoji:"📦", bg:"rgba(148,163,184,0.13)", kw:[] },
};

const PAY_COLOR = {
  GPay:"#4285F4", PhonePe:"#7C3AED", Cash:"#10B981",
  Card:"#F59E0B", Paytm:"#00BAF2", NEFT:"#94A3B8",
};

/* ─── SAMPLE DATA ─────────────────────────────────────────── */
const RAW = [
  {date:"2025-03-01",description:"Zomato Order",amount:285,payment_mode:"GPay"},
  {date:"2025-03-01",description:"Uber Ride",amount:145,payment_mode:"PhonePe"},
  {date:"2025-03-02",description:"Amazon Purchase",amount:1890,payment_mode:"Card"},
  {date:"2025-03-02",description:"Swiggy Delivery",amount:340,payment_mode:"GPay"},
  {date:"2025-03-03",description:"Netflix Subscription",amount:649,payment_mode:"Card"},
  {date:"2025-03-03",description:"Rapido Bike Ride",amount:65,payment_mode:"GPay"},
  {date:"2025-03-04",description:"BigBasket Groceries",amount:2340,payment_mode:"PhonePe"},
  {date:"2025-03-04",description:"Cafe Coffee Day",amount:380,payment_mode:"GPay"},
  {date:"2025-03-05",description:"Jio Recharge",amount:299,payment_mode:"GPay"},
  {date:"2025-03-05",description:"Gym Membership",amount:1200,payment_mode:"Cash"},
  {date:"2025-03-06",description:"Zomato Order",amount:420,payment_mode:"GPay"},
  {date:"2025-03-06",description:"IRCTC Train Ticket",amount:1150,payment_mode:"PhonePe"},
  {date:"2025-03-07",description:"Myntra Shopping",amount:1499,payment_mode:"Card"},
  {date:"2025-03-07",description:"Spotify Premium",amount:119,payment_mode:"Card"},
  {date:"2025-03-08",description:"Swiggy Order",amount:290,payment_mode:"GPay"},
  {date:"2025-03-08",description:"Metro Card Recharge",amount:200,payment_mode:"Cash"},
  {date:"2025-03-09",description:"Amazon Prime Order",amount:3200,payment_mode:"Card"},
  {date:"2025-03-09",description:"Ola Cab",amount:220,payment_mode:"PhonePe"},
  {date:"2025-03-10",description:"Dominos Pizza",amount:567,payment_mode:"GPay"},
  {date:"2025-03-10",description:"Apollo Pharmacy",amount:456,payment_mode:"PhonePe"},
  {date:"2025-03-11",description:"Electricity Bill",amount:1800,payment_mode:"GPay"},
  {date:"2025-03-11",description:"BookMyShow Movie",amount:598,payment_mode:"Card"},
  {date:"2025-03-12",description:"Zomato Order",amount:315,payment_mode:"GPay"},
  {date:"2025-03-12",description:"Flipkart Purchase",amount:2100,payment_mode:"PhonePe"},
  {date:"2025-03-13",description:"Uber Ride",amount:189,payment_mode:"GPay"},
  {date:"2025-03-13",description:"Vegetable Market",amount:340,payment_mode:"Cash"},
  {date:"2025-03-14",description:"Swiggy Delivery",amount:410,payment_mode:"GPay"},
  {date:"2025-03-14",description:"MakeMyTrip Flight",amount:4500,payment_mode:"Card"},
  {date:"2025-03-15",description:"Starbucks Coffee",amount:450,payment_mode:"GPay"},
  {date:"2025-03-15",description:"Amazon Purchase",amount:899,payment_mode:"Card"},
  {date:"2025-02-03",description:"Zomato Order",amount:245,payment_mode:"GPay"},
  {date:"2025-02-05",description:"Uber Ride",amount:178,payment_mode:"PhonePe"},
  {date:"2025-02-08",description:"Netflix Subscription",amount:649,payment_mode:"Card"},
  {date:"2025-02-10",description:"BigBasket Order",amount:1900,payment_mode:"PhonePe"},
  {date:"2025-02-12",description:"Amazon Purchase",amount:2890,payment_mode:"Card"},
  {date:"2025-02-15",description:"Swiggy Order",amount:380,payment_mode:"GPay"},
  {date:"2025-02-16",description:"Gym Membership",amount:1200,payment_mode:"Cash"},
  {date:"2025-02-18",description:"Ola Cab",amount:210,payment_mode:"PhonePe"},
  {date:"2025-02-20",description:"Electricity Bill",amount:1650,payment_mode:"GPay"},
  {date:"2025-02-22",description:"Myntra Shopping",amount:1200,payment_mode:"Card"},
  {date:"2025-02-24",description:"Jio Recharge",amount:299,payment_mode:"GPay"},
  {date:"2025-02-26",description:"Zomato Order",amount:310,payment_mode:"GPay"},
  {date:"2025-02-28",description:"Flipkart Purchase",amount:1800,payment_mode:"PhonePe"},
  {date:"2025-01-04",description:"Zomato Order",amount:310,payment_mode:"GPay"},
  {date:"2025-01-07",description:"Uber Ride",amount:210,payment_mode:"PhonePe"},
  {date:"2025-01-09",description:"Netflix Subscription",amount:649,payment_mode:"Card"},
  {date:"2025-01-12",description:"Amazon Order",amount:4500,payment_mode:"Card"},
  {date:"2025-01-15",description:"Swiggy Order",amount:280,payment_mode:"GPay"},
  {date:"2025-01-18",description:"Electricity Bill",amount:1900,payment_mode:"GPay"},
  {date:"2025-01-20",description:"BookMyShow",amount:798,payment_mode:"Card"},
  {date:"2025-01-22",description:"Gym Membership",amount:1200,payment_mode:"Cash"},
  {date:"2025-01-25",description:"Flipkart Sale",amount:3200,payment_mode:"Card"},
  {date:"2025-01-28",description:"Jio Recharge",amount:299,payment_mode:"GPay"},
  {date:"2025-01-30",description:"Ola Cab",amount:165,payment_mode:"PhonePe"},
];

/* ─── HELPERS ─────────────────────────────────────────────── */
const classify = desc => {
  const d = desc.toLowerCase();
  for (const [cat, cfg] of Object.entries(CAT)) {
    if (cat === "Other") continue;
    if (cfg.kw.some(k => d.includes(k))) return cat;
  }
  return "Other";
};

const process = arr => arr.map(t => ({
  ...t, amount: parseFloat(t.amount),
  category: t.category || classify(t.description)
}));

const fmt = n => {
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`;
  if (n >= 1000)   return `₹${(n/1000).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short"});

const parseCSV = text => {
  const lines = text.trim().split("\n");
  const hdrs = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/"/g,""));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/"/g,""));
    const obj = {};
    hdrs.forEach((h,i) => obj[h] = vals[i]);
    return obj;
  }).filter(t => t.date && t.description && t.amount);
};

const buildInsights = txns => {
  if (!txns.length) return [];
  const total = txns.reduce((s,t)=>s+t.amount,0);
  const cats={}, pays={}, days={};
  txns.forEach(t=>{
    cats[t.category]=(cats[t.category]||0)+t.amount;
    pays[t.payment_mode]=(pays[t.payment_mode]||0)+t.amount;
    const d=new Date(t.date).getDay();
    days[d]=(days[d]||0)+t.amount;
  });
  const topCat=Object.entries(cats).sort((a,b)=>b[1]-a[1])[0];
  const topPay=Object.entries(pays).sort((a,b)=>b[1]-a[1])[0];
  const wknd=(days[0]||0)+(days[6]||0);
  const wkndPct=Math.round((wknd/total)*100);
  const foodPct=Math.round(((cats.Food||0)/total)*100);
  return [
    topCat && {type:"warning",icon:"🔥",title:`${topCat[0]} dominates your spending`,body:`You've spent ${fmt(topCat[1])} on ${topCat[0]} — that's ${Math.round((topCat[1]/total)*100)}% of your total budget this month.`,cta:`Cut 20% → save ${fmt(topCat[1]*0.2)}`},
    wkndPct>35 && {type:"info",icon:"📅",title:"Weekend spending spike detected",body:`${wkndPct}% of your spending happens on weekends. Planning ahead could reduce impulse buys significantly.`,cta:"Set a weekend spending limit"},
    foodPct>25 && {type:"warning",icon:"🍔",title:"Food bill is above average",body:`Food & dining accounts for ${foodPct}% of expenses. Cooking at home just 3 extra times a week could make a big difference.`,cta:`Potential savings: ${fmt((cats.Food||0)*0.3)}/month`},
    topPay && {type:"success",icon:"📱",title:`${topPay[0]} is your primary payment mode`,body:`You use ${topPay[0]} for ${Math.round((topPay[1]/total)*100)}% of spending. Digital payments give you full transaction traceability.`,cta:"Enable cashback & rewards"},
    {type:"success",icon:"💡",title:"Smart saving opportunity found",body:`Based on spending patterns, reducing food delivery by 2 orders/week and one shopping trip could free up ${fmt(total*0.09)} monthly.`,cta:"View savings plan"},
  ].filter(Boolean);
};

/* ─── TOOLTIP ─────────────────────────────────────────────── */
const CT = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:"#0D0D22",border:"1px solid #1E1E40",borderRadius:10,padding:"10px 14px",fontFamily:"Outfit,sans-serif",fontSize:13}}>
      {label && <div style={{color:"#6B6890",marginBottom:5,fontSize:11}}>{label}</div>}
      {payload.map((p,i)=>(
        <div key={i} style={{color:"#EEF0FF",fontWeight:600}}>
          <span style={{color:p.color||"#A78BFA"}}>■ </span>
          ₹{typeof p.value==="number" ? p.value.toLocaleString("en-IN") : p.value}
        </div>
      ))}
    </div>
  );
};

/* ─── STAT CARD ───────────────────────────────────────────── */
const StatCard = ({label,value,delta,deltaUp,icon,accentColor="#7B5CF6"}) => (
  <div style={{background:"#0F0F26",border:"1px solid #181836",borderRadius:16,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <div style={{fontSize:11,color:"#45436A",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</div>
      <div style={{width:34,height:34,borderRadius:10,background:accentColor+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{icon}</div>
    </div>
    <div style={{fontFamily:"Syne,sans-serif",fontSize:27,fontWeight:700,color:"#EEF0FF",lineHeight:1,marginBottom:7}}>{value}</div>
    {delta && (
      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:600,color:deltaUp?"#EF4444":"#10B981"}}>
        {deltaUp ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {delta}
      </div>
    )}
    <div style={{position:"absolute",right:-8,bottom:-8,fontSize:52,opacity:0.04,pointerEvents:"none"}}>{icon}</div>
  </div>
);

/* ─── MAIN APP ────────────────────────────────────────────── */
export default function ExpenseAI() {
  const [tab, setTab]       = useState("dashboard");
  const [txns, setTxns]     = useState(() => process(RAW));
  const [drag, setDrag]     = useState(false);
  const [status, setStatus] = useState(null);
  const fileRef             = useRef();

  /* Derived — current month (March 2025) */
  const cur  = txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===2&&d.getFullYear()===2025;});
  const prev = txns.filter(t=>{const d=new Date(t.date);return d.getMonth()===1&&d.getFullYear()===2025;});
  const total     = cur.reduce((s,t)=>s+t.amount,0);
  const prevTotal = prev.reduce((s,t)=>s+t.amount,0);
  const pctChange = prevTotal ? Math.round(((total-prevTotal)/prevTotal)*100) : 0;

  /* Category totals */
  const catMap={};
  cur.forEach(t=>{catMap[t.category]=(catMap[t.category]||0)+t.amount;});
  const catData=Object.entries(catMap).map(([n,v])=>({name:n,value:v,color:CAT[n]?.color||"#94A3B8"})).sort((a,b)=>b.value-a.value);

  /* Payment totals */
  const payMap={};
  cur.forEach(t=>{payMap[t.payment_mode]=(payMap[t.payment_mode]||0)+t.amount;});
  const payData=Object.entries(payMap).map(([n,v])=>({name:n,value:v,color:PAY_COLOR[n]||"#94A3B8"})).sort((a,b)=>b.value-a.value);

  /* Monthly trend */
  const mMap={};
  txns.forEach(t=>{
    const d=new Date(t.date);
    const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label=d.toLocaleString("default",{month:"short"});
    mMap[k]={month:label,amount:(mMap[k]?.amount||0)+t.amount};
  });
  const monthData=Object.entries(mMap).sort((a,b)=>a[0]>b[0]?1:-1).map(([,v])=>v);

  /* Daily this month */
  const dMap={};
  cur.forEach(t=>{dMap[t.date]=(dMap[t.date]||0)+t.amount;});
  const dayData=Object.entries(dMap).sort((a,b)=>a[0]>b[0]?1:-1).map(([d,v])=>({date:fmtDate(d),amount:v}));

  const insights = buildInsights(cur);
  const topCatName = catData[0]?.name||"None";

  /* Upload handler */
  const handleFile = file => {
    if (!file) return;
    const r = new FileReader();
    r.onload = e => {
      try {
        const rows = parseCSV(e.target.result);
        const processed = process(rows);
        if (!processed.length) throw new Error();
        setTxns(processed);
        setStatus({ok:true,n:processed.length});
        setTimeout(()=>setTab("dashboard"),1200);
      } catch { setStatus({ok:false}); }
    };
    r.readAsText(file);
  };

  /* Sample CSV download */
  const downloadSample = () => {
    const csv = "date,description,amount,payment_mode\n2025-03-01,Zomato Order,285,GPay\n2025-03-02,Uber Ride,145,PhonePe\n2025-03-03,Amazon Purchase,1890,Card\n2025-03-04,Gym Membership,1200,Cash\n2025-03-05,Netflix Subscription,649,Card";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = "sample_transactions.csv";
    a.click();
  };

  /* NAV */
  const NAV = [
    {id:"dashboard",icon:<LayoutDashboard size={15}/>,label:"Dashboard"},
    {id:"upload",   icon:<Upload size={15}/>,          label:"Upload Data"},
    {id:"categories",icon:<Tag size={15}/>,            label:"Categories"},
    {id:"payments",  icon:<CreditCard size={15}/>,     label:"Payments"},
    {id:"insights",  icon:<Sparkles size={15}/>,       label:"AI Insights"},
  ];

  const S = {
    root:  {display:"flex",minHeight:"100vh",background:"#06060F",fontFamily:"Outfit,sans-serif",color:"#EEF0FF"},
    side:  {width:215,minHeight:"100vh",background:"#0A0A1E",borderRight:"1px solid #151530",display:"flex",flexDirection:"column",padding:"18px 12px",position:"sticky",top:0,height:"100vh",flexShrink:0},
    main:  {flex:1,overflowY:"auto"},
    pad:   {padding:28},
    card:  {background:"#0F0F26",border:"1px solid #181836",borderRadius:16},
    h1:    {fontFamily:"Syne,sans-serif",fontSize:21,fontWeight:700,color:"#EEF0FF"},
    sub:   {fontSize:12,color:"#45436A",marginTop:3},
    sec:   {fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:600,color:"#EEF0FF"},
    muted: {fontSize:11,color:"#45436A"},
    mono:  {fontFamily:"JetBrains Mono,monospace"},
  };

  const NavItem = ({item}) => (
    <div onClick={()=>setTab(item.id)} style={{
      display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:9,cursor:"pointer",marginBottom:2,
      background:tab===item.id?"rgba(123,92,246,0.13)":"transparent",
      color:tab===item.id?"#A78BFA":"#6B6890",
      border:`1px solid ${tab===item.id?"rgba(123,92,246,0.22)":"transparent"}`,
      fontSize:13,fontWeight:500,transition:"all 0.15s"
    }}>
      {item.icon}<span>{item.label}</span>
    </div>
  );

  return (
    <>
      <style>{FONT_CSS}</style>
      <div style={S.root}>

        {/* ── SIDEBAR ──────────────────────────────────── */}
        <div style={S.side}>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"6px 10px 18px",borderBottom:"1px solid #151530",marginBottom:18}}>
            <div style={{width:32,height:32,background:"linear-gradient(135deg,#6D28D9,#A78BFA)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>💸</div>
            <div>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:15,color:"#EEF0FF",lineHeight:1}}>SpendAI</div>
              <div style={{fontSize:9,color:"#45436A",fontWeight:600,marginTop:2,letterSpacing:"0.05em"}}>INTELLIGENCE LAYER</div>
            </div>
          </div>

          <div style={{fontSize:9,color:"#45436A",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 10px 7px",marginBottom:3}}>Navigation</div>
          {NAV.map(item=><NavItem key={item.id} item={item}/>)}

          <div style={{marginTop:"auto",padding:"14px 10px",borderTop:"1px solid #151530"}}>
            <div style={{fontSize:10,color:"#45436A",marginBottom:3,fontWeight:600}}>Active Period</div>
            <div style={{fontSize:13,color:"#9B97C5",fontWeight:600}}>March 2025</div>
            <div style={{fontSize:11,color:"#45436A",marginTop:2}}>{cur.length} transactions</div>
          </div>
        </div>

        {/* ── MAIN ─────────────────────────────────────── */}
        <div style={S.main}>

          {/* ══ DASHBOARD ══════════════════════════════════════ */}
          {tab==="dashboard" && (
            <div style={S.pad}>
              <div style={{marginBottom:24}}>
                <div style={S.h1}>Financial Overview</div>
                <div style={S.sub}>March 2025 · {cur.length} transactions · ML categorized</div>
              </div>

              {/* STAT CARDS */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
                <StatCard label="Total Spend" value={fmt(total)} delta={`${Math.abs(pctChange)}% vs Feb`} deltaUp={pctChange>0} icon="💰"/>
                <StatCard label="Transactions" value={cur.length} delta="this month" icon="📊" accentColor="#4ECDC4"/>
                <StatCard label="Avg per Txn" value={fmt(total/Math.max(cur.length,1))} icon="📈" accentColor="#F59E0B"/>
                <StatCard label="Top Category" value={topCatName} icon={CAT[topCatName]?.emoji||"📦"} accentColor="#FB7185"/>
              </div>

              {/* ROW 1 — Trend + Donut */}
              <div style={{display:"grid",gridTemplateColumns:"1.65fr 1fr",gap:14,marginBottom:14}}>

                {/* Monthly Area Chart */}
                <div style={{...S.card,padding:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <div>
                      <div style={S.sec}>Monthly Spending</div>
                      <div style={S.muted}>3-month trend</div>
                    </div>
                    <span style={{fontSize:11,color:"#A78BFA",fontWeight:700,background:"rgba(123,92,246,0.12)",padding:"3px 11px",borderRadius:20}}>2025</span>
                  </div>
                  <ResponsiveContainer width="100%" height={170}>
                    <AreaChart data={monthData} margin={{top:0,right:4,left:0,bottom:0}}>
                      <defs>
                        <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{fill:"#45436A",fontSize:12,fontFamily:"Outfit,sans-serif"}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:"#45436A",fontSize:11,fontFamily:"JetBrains Mono,monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`}/>
                      <Tooltip content={<CT/>}/>
                      <Area type="monotone" dataKey="amount" stroke="#A78BFA" strokeWidth={2} fill="url(#gPurple)" dot={{fill:"#A78BFA",r:4,strokeWidth:0}} activeDot={{r:6}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Donut */}
                <div style={{...S.card,padding:22}}>
                  <div style={S.sec}>Category Split</div>
                  <div style={{...S.muted,marginBottom:12}}>This month</div>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={catData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3} strokeWidth={0}>
                        {catData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                      </Pie>
                      <Tooltip content={<CT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",flexWrap:"wrap",gap:"5px 10px",marginTop:6}}>
                    {catData.slice(0,4).map(d=>(
                      <div key={d.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#9B97C5"}}>
                        <span style={{width:7,height:7,borderRadius:"50%",background:d.color,display:"inline-block"}}/>
                        {d.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ROW 2 — Category bars + Transactions */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1.45fr",gap:14}}>

                {/* Category breakdown bars */}
                <div style={{...S.card,padding:22}}>
                  <div style={{...S.sec,marginBottom:18}}>Spending Breakdown</div>
                  {catData.map(d=>(
                    <div key={d.name} style={{marginBottom:13}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13,marginBottom:5}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,color:"#EEF0FF"}}>
                          <span style={{fontSize:14}}>{CAT[d.name]?.emoji}</span>{d.name}
                        </div>
                        <div style={{...S.mono,fontSize:12,color:"#9B97C5"}}>{fmt(d.value)}</div>
                      </div>
                      <div style={{height:5,background:"#181836",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${(d.value/total)*100}%`,background:d.color,borderRadius:3,transition:"width 0.8s"}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent transactions */}
                <div style={{...S.card,padding:22}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
                    <div style={S.sec}>Recent Transactions</div>
                    <div onClick={()=>setTab("categories")} style={{fontSize:12,color:"#A78BFA",cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontWeight:600}}>
                      View all <ChevronRight size={12}/>
                    </div>
                  </div>
                  <div style={{maxHeight:290,overflowY:"auto"}}>
                    {cur.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,9).map((t,i,arr)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 0",borderBottom:i<arr.length-1?"1px solid #181836":"none"}}>
                        <div style={{width:36,height:36,borderRadius:9,background:CAT[t.category]?.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{CAT[t.category]?.emoji}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:500,color:"#EEF0FF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.description}</div>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginTop:2}}>
                            <span style={{fontSize:11,color:"#45436A"}}>{fmtDate(t.date)}</span>
                            <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:5,background:(PAY_COLOR[t.payment_mode]||"#94A3B8")+"22",color:PAY_COLOR[t.payment_mode]||"#94A3B8"}}>{t.payment_mode}</span>
                          </div>
                        </div>
                        <div style={{...S.mono,fontSize:13,color:"#EEF0FF",fontWeight:600,flexShrink:0}}>−{fmt(t.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ UPLOAD ══════════════════════════════════════ */}
          {tab==="upload" && (
            <div style={{...S.pad,maxWidth:700}}>
              <div style={{marginBottom:24}}>
                <div style={S.h1}>Upload Transactions</div>
                <div style={S.sub}>Import from GPay, PhonePe, or any bank statement</div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e=>{e.preventDefault();setDrag(true)}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0])}}
                onClick={()=>fileRef.current?.click()}
                style={{
                  border:`2px dashed ${drag?"#A78BFA":"#242450"}`,
                  borderRadius:20,padding:"56px 40px",textAlign:"center",cursor:"pointer",
                  background:drag?"rgba(123,92,246,0.07)":"transparent",
                  transition:"all 0.25s",marginBottom:20
                }}
              >
                <div style={{fontSize:44,marginBottom:14}}>📤</div>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:18,fontWeight:700,color:"#EEF0FF",marginBottom:7}}>
                  {drag?"Drop it here!":"Drag & drop your CSV file"}
                </div>
                <div style={{fontSize:13,color:"#45436A",marginBottom:22}}>or click to browse — supports GPay / PhonePe / bank exports</div>
                <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(123,92,246,0.13)",border:"1px solid rgba(123,92,246,0.3)",color:"#A78BFA",padding:"10px 24px",borderRadius:10,fontSize:14,fontWeight:600}}>
                  <Upload size={15}/> Select CSV File
                </div>
                <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              </div>

              {/* Status banner */}
              {status && (
                <div style={{
                  background:status.ok?"rgba(16,185,129,0.09)":"rgba(239,68,68,0.09)",
                  border:`1px solid ${status.ok?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}`,
                  borderRadius:12,padding:"13px 18px",marginBottom:20,
                  display:"flex",alignItems:"center",gap:11,
                  color:status.ok?"#10B981":"#EF4444",fontSize:14,fontWeight:500
                }}>
                  {status.ok?<CheckCircle size={17}/>:<AlertCircle size={17}/>}
                  {status.ok?`✅ ${status.n} transactions imported & ML-categorized! Redirecting to dashboard…`:"❌ Invalid format. Check the required format below."}
                </div>
              )}

              {/* Format guide */}
              <div style={{...S.card,padding:22}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,...S.sec}}>
                    <FileText size={15} color="#A78BFA"/> Required CSV Format
                  </div>
                  <div onClick={downloadSample} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#A78BFA",cursor:"pointer",fontWeight:600,padding:"5px 12px",border:"1px solid rgba(123,92,246,0.25)",borderRadius:8}}>
                    <Download size={13}/> Sample CSV
                  </div>
                </div>
                <div style={{background:"#06060F",border:"1px solid #181836",borderRadius:10,padding:16,...S.mono,fontSize:12,color:"#9B97C5",marginBottom:16}}>
                  <div style={{color:"#A78BFA",marginBottom:5}}>date,description,amount,payment_mode</div>
                  {["2025-03-01,Zomato Order,285,GPay","2025-03-02,Uber Ride,145,PhonePe","2025-03-03,Amazon Purchase,1890,Card","2025-03-04,Grocery Store,340,Cash"].map((r,i)=>(
                    <div key={i}>{r}</div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    ["date","YYYY-MM-DD format","#4285F4"],
                    ["description","Merchant or transaction name","#10B981"],
                    ["amount","Number without ₹ symbol","#F59E0B"],
                    ["payment_mode","GPay / PhonePe / Cash / Card","#A78BFA"],
                  ].map(([f,d,c])=>(
                    <div key={f} style={{background:"#06060F",border:"1px solid #181836",borderRadius:10,padding:12}}>
                      <div style={{...S.mono,fontSize:12,color:c,fontWeight:600,marginBottom:3}}>{f}</div>
                      <div style={{fontSize:12,color:"#45436A"}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ CATEGORIES ══════════════════════════════════════ */}
          {tab==="categories" && (
            <div style={S.pad}>
              <div style={{marginBottom:24}}>
                <div style={S.h1}>Category Analysis</div>
                <div style={S.sub}>ML-classified breakdown · March 2025</div>
              </div>

              {/* Category cards */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
                {catData.map(d=>(
                  <div key={d.name} style={{...S.card,padding:20,borderTop:`3px solid ${d.color}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{fontSize:30}}>{CAT[d.name]?.emoji}</div>
                      <div style={{...S.mono,fontSize:19,fontWeight:700,color:"#EEF0FF"}}>{fmt(d.value)}</div>
                    </div>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:600,color:"#EEF0FF",marginBottom:3}}>{d.name}</div>
                    <div style={{fontSize:11,color:"#45436A",marginBottom:11}}>
                      {cur.filter(t=>t.category===d.name).length} transactions · {Math.round((d.value/total)*100)}% of spend
                    </div>
                    <div style={{height:4,background:"#181836",borderRadius:2}}>
                      <div style={{height:"100%",width:`${(d.value/total)*100}%`,background:d.color,borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* All transactions */}
              <div style={{...S.card,padding:22}}>
                <div style={{...S.sec,marginBottom:18}}>All Transactions</div>
                {cur.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map((t,i,arr)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"10px 0",borderBottom:i<arr.length-1?"1px solid #181836":"none"}}>
                    <div style={{width:36,height:36,borderRadius:9,background:CAT[t.category]?.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{CAT[t.category]?.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500,color:"#EEF0FF"}}>{t.description}</div>
                      <div style={{fontSize:11,color:"#45436A",marginTop:2}}>{fmtDate(t.date)}</div>
                    </div>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:20,background:CAT[t.category]?.bg,color:CAT[t.category]?.color}}>{t.category}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 10px",borderRadius:6,background:(PAY_COLOR[t.payment_mode]||"#94A3B8")+"22",color:PAY_COLOR[t.payment_mode]||"#94A3B8"}}>{t.payment_mode}</span>
                    <div style={{...S.mono,fontSize:13,fontWeight:600,color:"#EEF0FF",marginLeft:6}}>−{fmt(t.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PAYMENTS ══════════════════════════════════════ */}
          {tab==="payments" && (
            <div style={S.pad}>
              <div style={{marginBottom:24}}>
                <div style={S.h1}>Payment Analysis</div>
                <div style={S.sub}>GPay · PhonePe · Cash · Card breakdown</div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>

                {/* Pie */}
                <div style={{...S.card,padding:22}}>
                  <div style={S.sec}>Payment Mode Distribution</div>
                  <div style={{...S.muted,marginBottom:14}}>By transaction value · March 2025</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={payData} cx="50%" cy="50%" outerRadius={82} dataKey="value" paddingAngle={4} strokeWidth={0}
                        label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={{stroke:"#45436A",strokeWidth:0.8}}>
                        {payData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                      </Pie>
                      <Tooltip content={<CT/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment mode list */}
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  {payData.map(d=>(
                    <div key={d.name} style={{...S.card,padding:"15px 18px",display:"flex",alignItems:"center",gap:14,borderLeft:`4px solid ${d.color}`}}>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:600,color:"#EEF0FF",marginBottom:2}}>{d.name}</div>
                        <div style={{fontSize:11,color:"#45436A"}}>{cur.filter(t=>t.payment_mode===d.name).length} transactions</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{...S.mono,fontSize:16,fontWeight:700,color:"#EEF0FF"}}>{fmt(d.value)}</div>
                        <div style={{fontSize:11,color:"#45436A",marginTop:2}}>{Math.round((d.value/total)*100)}% of total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily bar chart */}
              <div style={{...S.card,padding:22}}>
                <div style={S.sec}>Daily Spend Pattern</div>
                <div style={{...S.muted,marginBottom:18}}>March 2025</div>
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={dayData} margin={{top:0,right:4,left:0,bottom:0}} barSize={16}>
                    <XAxis dataKey="date" tick={{fill:"#45436A",fontSize:11,fontFamily:"Outfit,sans-serif"}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#45436A",fontSize:11,fontFamily:"JetBrains Mono,monospace"}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}K`}/>
                    <Tooltip content={<CT/>}/>
                    <Bar dataKey="amount" fill="#7C3AED" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ══ INSIGHTS ══════════════════════════════════════ */}
          {tab==="insights" && (
            <div style={{...S.pad,maxWidth:750}}>
              <div style={{marginBottom:24}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <div style={{width:30,height:30,background:"linear-gradient(135deg,#6D28D9,#A78BFA)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Sparkles size={15} color="white"/>
                  </div>
                  <div style={S.h1}>AI Insights</div>
                </div>
                <div style={S.sub}>Machine learning patterns from your spending data</div>
              </div>

              {/* Summary tags */}
              <div style={{display:"flex",gap:9,marginBottom:22,flexWrap:"wrap"}}>
                {[
                  [fmt(total)+" spent","#7C3AED"],
                  [cur.length+" transactions","#4ECDC4"],
                  [catData.length+" categories","#F59E0B"],
                  [payData.length+" payment methods","#10B981"],
                ].map(([l,c])=>(
                  <span key={l} style={{background:c+"16",border:`1px solid ${c}30`,color:c,padding:"5px 13px",borderRadius:20,fontSize:12,fontWeight:600}}>{l}</span>
                ))}
              </div>

              {/* Insight cards */}
              {insights.map((ins,i)=>(
                <div key={i} style={{
                  background:ins.type==="warning"?"rgba(245,158,11,0.06)":ins.type==="success"?"rgba(16,185,129,0.06)":"rgba(123,92,246,0.06)",
                  border:`1px solid ${ins.type==="warning"?"rgba(245,158,11,0.2)":ins.type==="success"?"rgba(16,185,129,0.2)":"rgba(123,92,246,0.2)"}`,
                  borderRadius:16,padding:"18px 20px",marginBottom:13,display:"flex",gap:15
                }}>
                  <div style={{fontSize:28,flexShrink:0,lineHeight:1,marginTop:2}}>{ins.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#EEF0FF",marginBottom:5}}>{ins.title}</div>
                    <div style={{fontSize:13,color:"#9B97C5",lineHeight:1.65,marginBottom:11}}>{ins.body}</div>
                    <div style={{
                      display:"inline-flex",alignItems:"center",gap:5,cursor:"pointer",
                      background:ins.type==="warning"?"rgba(245,158,11,0.12)":ins.type==="success"?"rgba(16,185,129,0.12)":"rgba(123,92,246,0.12)",
                      color:ins.type==="warning"?"#F59E0B":ins.type==="success"?"#10B981":"#A78BFA",
                      padding:"5px 14px",borderRadius:20,fontSize:12,fontWeight:700
                    }}>
                      {ins.cta} <ChevronRight size={12}/>
                    </div>
                  </div>
                </div>
              ))}

              {/* Forecast card */}
              <div style={{background:"linear-gradient(135deg,rgba(109,40,217,0.16),rgba(167,139,250,0.05))",border:"1px solid rgba(123,92,246,0.22)",borderRadius:16,padding:22,marginTop:6}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
                  <TrendingUp size={18} color="#A78BFA"/>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:"#EEF0FF"}}>Month-End Forecast</div>
                  <span style={{fontSize:10,fontWeight:700,background:"rgba(123,92,246,0.2)",color:"#A78BFA",padding:"2px 9px",borderRadius:20,letterSpacing:"0.07em"}}>AI PREDICTION</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                  {[
                    {label:"Projected Total",value:fmt(total*(31/15)),color:"#A78BFA"},
                    {label:"vs Last Month",value:`${pctChange>0?"+":""}${pctChange}%`,color:pctChange>0?"#EF4444":"#10B981"},
                    {label:"Daily Average",value:fmt(total/15),color:"#F59E0B"},
                  ].map(s=>(
                    <div key={s.label} style={{textAlign:"center",background:"rgba(0,0,0,0.2)",borderRadius:12,padding:"14px 10px"}}>
                      <div style={{fontSize:10,color:"#45436A",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>{s.label}</div>
                      <div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:s.color}}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}