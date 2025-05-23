'use client';

import { useState } from 'react';
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';

const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6'];

const Input = ({ label, ...props }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1">{label}</label>
    <input {...props} className="border rounded p-2 w-full" />
  </div>
);

const Button = (props) => (
  <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded" />
);

const Select = ({ value, onChange, options, label }) => (
  <div className="flex flex-col text-sm">
    <label className="mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded p-2 w-full">
      <option value="">Select...</option>
      {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default function RigJBDBuilder() {
  const [operation, setOperation] = useState('');
  const [rig, setRig] = useState('');
  const [pic, setPic] = useState('');
  const [lofHazard, setLofHazard] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workers, setWorkers] = useState([]);
  const [positions, setPositions] = useState({});
  const [diagram, setDiagram] = useState('');
  const [stepBack, setStepBack] = useState(false);
  const [redZone, setRedZone] = useState(false);
  const [blackZone, setBlackZone] = useState(false);
  const [stepBackArea, setStepBackArea] = useState({ width: 100, height: 100, x: 0, y: 0 });
  const [redZoneArea, setRedZoneArea] = useState({ width: 100, height: 100, x: 50, y: 50 });
  const [blackZoneArea, setBlackZoneArea] = useState({ width: 100, height: 100, x: 100, y: 100 });
  const [tasks, setTasks] = useState([]);
  const [taskStep, setTaskStep] = useState('');
  const [taskPersons, setTaskPersons] = useState([]);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleAddWorker = () => {
    if (workerName.trim()) {
      setWorkers([...workers, workerName]);
      setWorkerName('');
    }
  };

  const updatePosition = (index, data) => {
    setPositions({ ...positions, [index]: { x: data.x, y: data.y } });
  };

  const handleAddTask = () => {
    if (taskStep.trim() && taskPersons.length > 0) {
      setTasks([...tasks, { step: taskStep, persons: [...taskPersons] }]);
      setTaskStep('');
      setTaskPersons([]);
    }
  };

  const handleGeneratePDF = async () => {
    const res = await fetch('/api/generate-jbd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation, rig, pic, lofHazard, workers, tasks })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  return (
    <div className="space-y-4 w-[1123px] h-[794px] border-2 border-black p-4 overflow-auto">
      <h1 className="text-xl font-bold text-center">Build Your Own Job By Design</h1>
      <div className="flex space-x-2">
        <Input label="OPERATION" value={operation} onChange={(e) => setOperation(e.target.value)} />
        <Input label="RIG" value={rig} onChange={(e) => setRig(e.target.value)} />
        <Input label="PIC" value={pic} onChange={(e) => setPic(e.target.value)} />
      </div>
      <Input label="LINE OF FIRE HAZARD" value={lofHazard} onChange={(e) => setLofHazard(e.target.value)} />
      <div className="flex space-x-2 items-end">
        <Input label="Add Personnel" value={workerName} onChange={(e) => setWorkerName(e.target.value)} />
        <Button onClick={handleAddWorker}>Add</Button>
      </div>
      <div className="flex space-x-4 h-[300px]">
        <div className="w-[300px] h-full border-2 border-black relative">
          <p className="text-sm font-bold p-1">Place personnel on the diagram</p>
          {workers.map((w, i) => (
            <Draggable key={i} position={positions[i] || { x: 10 * i, y: 10 * i }} onStop={(e, data) => updatePosition(i, data)}>
              <div title={w} className="absolute w-8 h-8 rounded-full text-white text-xs flex items-center justify-center cursor-move z-10"
                style={{ backgroundColor: colors[i % colors.length] }}>
                {i + 1}
              </div>
            </Draggable>
          ))}
        </div>
        <div className="w-[700px] h-full border-2 border-black relative overflow-hidden">
          <p className="text-sm font-bold p-1">Diagram</p>
          <Select value={diagram} onChange={setDiagram} options={['Drillfloor', 'Helideck', 'Deck']} label="Select Diagram" />
          {diagram && (
            <div className="relative w-full h-[240px] mt-2">
              <img src={`/${diagram}.png`} alt={diagram} className="absolute w-full h-full object-contain" />
              {stepBack && (
                <Rnd size={stepBackArea} position={{ x: stepBackArea.x, y: stepBackArea.y }}
                  onDragStop={(e, d) => setStepBackArea({ ...stepBackArea, x: d.x, y: d.y })}
                  onResizeStop={(e, dir, ref, delta, pos) => setStepBackArea({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos })}
                  style={{ border: '2px dashed green', backgroundColor: 'rgba(0,255,0,0.1)', zIndex: 2 }} />
              )}
              {redZone && (
                <Rnd size={redZoneArea} position={{ x: redZoneArea.x, y: redZoneArea.y }}
                  onDragStop={(e, d) => setRedZoneArea({ ...redZoneArea, x: d.x, y: d.y })}
                  onResizeStop={(e, dir, ref, delta, pos) => setRedZoneArea({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos })}
                  style={{ border: '2px dashed red', backgroundColor: 'rgba(255,0,0,0.1)', zIndex: 2 }} />
              )}
              {blackZone && (
                <Rnd size={blackZoneArea} position={{ x: blackZoneArea.x, y: blackZoneArea.y }}
                  onDragStop={(e, d) => setBlackZoneArea({ ...blackZoneArea, x: d.x, y: d.y })}
                  onResizeStop={(e, dir, ref, delta, pos) => setBlackZoneArea({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), ...pos })}
                  style={{ border: '2px dashed black', backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 2 }} />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-4">
        <label><input type="checkbox" checked={stepBack} onChange={() => setStepBack(!stepBack)} /> Green Zone</label>
        <label><input type="checkbox" checked={redZone} onChange={() => setRedZone(!redZone)} /> Red Zone</label>
        <label><input type="checkbox" checked={blackZone} onChange={() => setBlackZone(!blackZone)} /> Black Zone</label>
      </div>
      <div className="flex space-x-2 mt-2">
        <Input label="Task Step" value={taskStep} onChange={(e) => setTaskStep(e.target.value)} />
        <select multiple value={taskPersons} onChange={(e) => setTaskPersons(Array.from(e.target.selectedOptions, o => o.value))} className="border rounded p-2 w-full">
          {workers.map((w, i) => <option key={i} value={w}>{w}</option>)}
        </select>
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
      <ul className="space-y-1 text-sm">
        {tasks.map((t, i) => (
          <li key={i} className="border p-2 rounded">Step: {t.step} | Persons: {t.persons.join(', ')}</li>
        ))}
      </ul>
      <Button onClick={handleGeneratePDF}>Export PDF Preview</Button>
      {pdfUrl && <iframe src={pdfUrl} title="PDF Preview" className="w-full h-[400px] border mt-2" />}
    </div>
  );
}
