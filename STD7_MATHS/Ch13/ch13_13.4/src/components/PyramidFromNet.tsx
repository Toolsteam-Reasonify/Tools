import React, { useState, useEffect } from "react";

// PyramidFromNet.tsx
// Single-file React + TypeScript component that shows a flat net (2D) of a square-based
// pyramid and animates folding it into a 3D pyramid.
// - Uses Tailwind classes for quick styling (no Tailwind imports here; assume your app has Tailwind configured)
// - Exported as default so you can drop this file into a React + TypeScript project
// - Controls: toggle fold, slider for fold progress, auto-play

type Face = "front" | "back" | "left" | "right";

interface PyramidFromNetProps {
  language: 'en' | 'hi' | 'gu';
}

const translations = {
  en: {
    title: "Pyramid: Flat Net → 3D",
    subtitle: "Use the slider to fold/unfold the net. Toggle auto-play to animate.",
    fold: "Fold",
    unfold: "Unfold",
    stop: "Stop",
    autoPlay: "Auto-play",
    progress: "Progress",
    tip: "Tip: If you want a sharper 3D look, increase the translateZ amount in the code where faces use translateZ."
  },
  hi: {
    title: "पिरामिड: सपाट नेट → 3D",
    subtitle: "नेट को मोड़ने/खोलने के लिए स्लाइडर का उपयोग करें। एनिमेट करने के लिए ऑटो-प्ले टॉगल करें।",
    fold: "मोड़ें",
    unfold: "खोलें",
    stop: "रोकें",
    autoPlay: "ऑटो-प्ले",
    progress: "प्रगति",
    tip: "सुझाव: यदि आप तेज 3D लुक चाहते हैं, तो कोड में translateZ मात्रा बढ़ाएं जहां फलक translateZ का उपयोग करते हैं।"
  },
  gu: {
    title: "પિરામિડ: સપાટ નેટ → 3D",
    subtitle: "નેટને મુડવા/ખોલવા માટે સ્લાઇડરનો ઉપયોગ કરો। એનિમેટ કરવા માટે ઓટો-પ્લે ટોગલ કરો।",
    fold: "મુડો",
    unfold: "ખોલો",
    stop: "રોકો",
    autoPlay: "ઓટો-પ્લે",
    progress: "પ્રગતિ",
    tip: "સૂચના: જો તમે તીવ્ર 3D લુક ઇચ્છો છો, તો કોડમાં translateZ માત્રા વધારો જ્યાં ફલક translateZ નો ઉપયોગ કરે છે।"
  }
};

export default function PyramidFromNet({ language }: PyramidFromNetProps): JSX.Element {
  const [fold, setFold] = useState<number>(0); // 0 = flat net, 1 = fully folded
  const [playing, setPlaying] = useState<boolean>(false);

  const t = translations[language];

  // simple auto-play animation
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let start: number | null = null;
    const duration = 1500; // ms for fold or unfold
    const direction = fold < 0.5 ? 1 : -1; // if partly folded, decide direction

    function step(ts: number) {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // smooth-ish ease
      setFold(prev => {
        const target = direction === 1 ? Math.min(1, prev + eased * 0.02) : Math.max(0, prev - eased * 0.02);
        return target;
      });
      if (t < 1) raf = requestAnimationFrame(step);
      else setPlaying(false);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // helper: compute rotation angle (deg) for a face based on fold (0..1)
  const angleFor = (_face: Face) => {
    // When fold = 1, we want approximately 90deg folding so side faces meet at apex.
    // Slight overshoot (like 95deg) can make seam look nicer in CSS, but we'll use 90.
    return fold * 90;
  };

  // style helpers for triangle faces using clip-path polygons so we can rotate them in 3D
  const faceCommon: React.CSSProperties = {
    position: "absolute",
    width: "160px",
    height: "160px",
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden",
    willChange: "transform",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-600">{t.subtitle}</p>
        </div>

        {/* Stage */}
        <div className="w-[520px] h-[420px] bg-white rounded-xl shadow-lg flex items-center justify-center">
          <div
            className="relative w-[360px] h-[360px] perspective-800"
            style={{ perspective: "900px" }}
          >
            {/* Container that holds the base and 4 side faces */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 360, height: 360, transformStyle: "preserve-3d" }}
            >
              {/* Base (square) */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-300 border border-gray-300 shadow-inner"
                style={{ width: 160, height: 160 }}
              >
                <div className="w-full h-full flex items-center justify-center text-gray-800 font-medium">Base</div>
              </div>

              {/* Top triangle (attached to top edge of base) */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: `calc(50% - 160px)`, width: 160, height: 160 }}
              >
                <div
                  style={{ ...faceCommon }}
                  className="triangle face-front origin-bottom"
                  // transform rotates around the bottom edge to fold up
                  // We rotate around X axis (positive angle folds away from viewer)
                  // origin needs to be at the bottom edge: set transformOrigin in inline styles
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      background: "rgba(59,130,246,0.85)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      transformOrigin: "50% 100%",
                      transform: `rotateX(${ -angleFor("front") }deg) translateZ(${Math.max(0, fold * 80)}px)`,
                      boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                    }}
                  />
                </div>
              </div>

              {/* Bottom triangle (attached to bottom edge of base) */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: `calc(50% + 160px)`, width: 160, height: 160 }}
              >
                <div style={{ ...faceCommon }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
                      background: "rgba(16,185,129,0.9)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      transformOrigin: "50% 0%",
                      transform: `rotateX(${ +angleFor("back") }deg) translateZ(${Math.max(0, fold * 80)}px)`,
                      boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                    }}
                  />
                </div>
              </div>

              {/* Left triangle (attached to left edge of base) */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `calc(50% - 160px)`, width: 160, height: 160 }}
              >
                <div style={{ ...faceCommon }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
                      background: "rgba(234,179,8,0.95)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      transformOrigin: "100% 50%",
                      transform: `rotateY(${ +angleFor("left") }deg) translateZ(${Math.max(0, fold * 80)}px)`,
                      boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                    }}
                  />
                </div>
              </div>

              {/* Right triangle (attached to right edge of base) */}
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `calc(50% + 160px)`, width: 160, height: 160 }}
              >
                <div style={{ ...faceCommon }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
                      background: "rgba(236,72,153,0.92)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      transformOrigin: "0% 50%",
                      transform: `rotateY(${ -angleFor("right") }deg) translateZ(${Math.max(0, fold * 80)}px)`,
                      boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                    }}
                  />
                </div>
              </div>

              {/* Optional: a faint wireframe showing net connections */}
              <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width="360" height="360" style={{ pointerEvents: "none" }}>
                {/* base square wireframe */}
                <rect x={100} y={100} width={160} height={160} fill="none" stroke="#bdbdbd" strokeWidth={1} />
                {/* lines to triangle centroids */}
                <line x1={180} y1={100} x2={180} y2={40} stroke="#cfcfcf" strokeDasharray="4 4" />
                <line x1={180} y1={260} x2={180} y2={320} stroke="#cfcfcf" strokeDasharray="4 4" />
                <line x1={100} y1={180} x2={40} y2={180} stroke="#cfcfcf" strokeDasharray="4 4" />
                <line x1={260} y1={180} x2={320} y2={180} stroke="#cfcfcf" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={() => setFold(prev => (prev > 0.5 ? 0 : 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
          >
            {fold > 0.5 ? t.unfold : t.fold}
          </button>

          <button
            onClick={() => setPlaying(p => !p)}
            className={`px-4 py-2 rounded-md shadow-sm ${playing ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {playing ? t.stop : t.autoPlay}
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">{t.progress}</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={fold}
              onChange={e => setFold(parseFloat(e.target.value))}
              className="w-64"
            />
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">{t.tip}</div>
      </div>
    </div>
  );
}
