'use client';
import { useState } from 'react';
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';

const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231'];

export default function RigJBDBuilder() {
  const [zones, setZones] = useState({ green: [], red: [], black: [] });
  const [arrows, setArrows] = useState([]);
  const [zoneId, setZoneId] = useState(0);
  const [arrowId, setArrowId] = useState(0);

  const addZone = (color) => {
    const id = zoneId + 1;
    setZones(prev => ({ ...prev, [color]: [...prev[color], { id, x: 20, y: 20, w: 100, h: 100 }] }));
    setZoneId(id);
  };

  const updateZone = (color, id, newZone) => {
    setZones(prev => ({
      ...prev,
      [color]: prev[color].map(z => z.id === id ? newZone : z)
    }));
  };

  const addArrow = () => {
    const id = arrowId + 1;
    setArrows(prev => [...prev, { id, x: 30, y: 30, w: 100, h: 10 }]);
    setArrowId(id);
  };

  const updateArrow = (id, newArrow) => {
    setArrows(prev => prev.map(a => a.id === id ? newArrow : a));
  };

  return (
    <div className="p-4 space-y-2 w-[1123px] h-[794px] border-2 border-black overflow-auto">
      <h1 className="text-xl font-bold text-center mb-2">Rig JBD Interactive Builder</h1>
      <div className="flex space-x-2">
        <button onClick={() => addZone('green')} className="bg-green-500 px-2 py-1 text-white rounded">+ Green Zone</button>
        <button onClick={() => addZone('red')} className="bg-red-500 px-2 py-1 text-white rounded">+ Red Zone</button>
        <button onClick={() => addZone('black')} className="bg-black px-2 py-1 text-white rounded">+ Black Zone</button>
        <button onClick={addArrow} className="bg-blue-500 px-2 py-1 text-white rounded">+ Blue Arrow</button>
      </div>
      <div className="relative w-full h-[500px] border mt-2 bg-white">
        {[...zones.green.map(z => (
          <Rnd key={`g-${z.id}`} size={{ width: z.w, height: z.h }} position={{ x: z.x, y: z.y }}
            onDragStop={(e, d) => updateZone('green', z.id, { ...z, x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateZone('green', z.id, { ...z, w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}
            style={{ border: '2px dashed green', backgroundColor: 'rgba(0,255,0,0.1)', position: 'absolute' }} />
        ))]}
        {[...zones.red.map(z => (
          <Rnd key={`r-${z.id}`} size={{ width: z.w, height: z.h }} position={{ x: z.x, y: z.y }}
            onDragStop={(e, d) => updateZone('red', z.id, { ...z, x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateZone('red', z.id, { ...z, w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}
            style={{ border: '2px dashed red', backgroundColor: 'rgba(255,0,0,0.1)', position: 'absolute' }} />
        ))]}
        {[...zones.black.map(z => (
          <Rnd key={`b-${z.id}`} size={{ width: z.w, height: z.h }} position={{ x: z.x, y: z.y }}
            onDragStop={(e, d) => updateZone('black', z.id, { ...z, x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateZone('black', z.id, { ...z, w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}
            style={{ border: '2px dashed black', backgroundColor: 'rgba(0,0,0,0.1)', position: 'absolute' }} />
        ))]}
        {[...arrows.map(a => (
          <Rnd key={`arrow-${a.id}`} size={{ width: a.w, height: a.h }} position={{ x: a.x, y: a.y }}
            onDragStop={(e, d) => updateArrow(a.id, { ...a, x: d.x, y: d.y })}
            onResizeStop={(e, dir, ref, delta, pos) =>
              updateArrow(a.id, { ...a, w: parseInt(ref.style.width), h: parseInt(ref.style.height), ...pos })}
            style={{ backgroundColor: 'blue', borderRadius: '4px', position: 'absolute' }} />
        ))]}
      </div>
    </div>
  );
}
