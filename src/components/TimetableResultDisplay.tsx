import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Download, Printer, FileText, Edit3 } from 'lucide-react';
import { TimetableResult, Day } from '../types';
import { DAYS } from '../constants';

interface Props {
  results: TimetableResult[];
  onModify: (index: number) => void;
}

export const TimetableResultDisplay: React.FC<Props> = ({ results, onModify }) => {
  const exportDOCX = async (result: TimetableResult) => {
    const { config, grid } = result;
    
    const tableHeader = new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "Day", alignment: AlignmentType.CENTER })] }),
        ...config.periodTimings.map(t => new TableCell({ 
          children: [new Paragraph({ text: `${t.startTime}-${t.endTime}${t.isLunch ? ' (L)' : ''}`, alignment: AlignmentType.CENTER })] 
        }))
      ]
    });

    const tableRows = config.workingDays.map((day, dIdx) => {
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: day, alignment: AlignmentType.CENTER })] }),
          ...grid[dIdx].map(p => new TableCell({
            children: [new Paragraph({ text: p ? `${p.subjectCode}\n(${p.facultyName})` : '-', alignment: AlignmentType.CENTER })]
          }))
        ]
      });
    });

    const statsParagraph = new Paragraph({
      children: [
        new TextRun({ text: `Total Periods per Day: ${config.periodTimings.length}`, bold: true }),
        new TextRun({ text: " | ", bold: true }),
        new TextRun({ text: `Duration per Period: 1 Hour`, bold: true }),
      ],
      alignment: AlignmentType.LEFT,
      spacing: { before: 400 },
    });

    const signatureTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Timetable Coordinator", alignment: AlignmentType.CENTER, spacing: { before: 800 } })], borders: { top: { style: "single", size: 1 } } }),
            new TableCell({ children: [new Paragraph({ text: "Head of Department", alignment: AlignmentType.CENTER, spacing: { before: 800 } })], borders: { top: { style: "single", size: 1 } } }),
            new TableCell({ children: [new Paragraph({ text: "Dean Academic", alignment: AlignmentType.CENTER, spacing: { before: 800 } })], borders: { top: { style: "single", size: 1 } } }),
            new TableCell({ children: [new Paragraph({ text: "Principal", alignment: AlignmentType.CENTER, spacing: { before: 800 } })], borders: { top: { style: "single", size: 1 } } }),
          ],
        }),
      ],
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: `${config.department} Department`, bold: true, size: 32 })],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${config.course} - Section ${config.section}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [tableHeader, ...tableRows],
          }),
          statsParagraph,
          signatureTable,
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Timetable_${config.course}_${config.section}.docx`);
  };

  const exportPDF = (result: TimetableResult) => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const { config, grid } = result;

    doc.setFontSize(18);
    doc.text(`${config.department} Department - ${config.course}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Year: ${config.year} | Semester: ${config.semester} | Section: ${config.section}`, 14, 28);
    doc.text(`Academic Year: ${config.academicYear} | Room: ${config.roomNumber}`, 14, 34);

    const head = [['Day', ...config.periodTimings.map(t => `${t.startTime} - ${t.endTime}${t.isLunch ? ' (Lunch)' : ''}`)]];
    const body = config.workingDays.map((day, dIdx) => {
      return [
        day,
        ...grid[dIdx].map(p => p ? `${p.subjectCode}\n(${p.facultyName})` : '-')
      ];
    });

    autoTable(doc, {
      head,
      body,
      startY: 45,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      headStyles: { fillColor: [40, 40, 40] },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Total Periods per Day: ${config.periodTimings.length} | Duration per Period: 1 Hour`, 14, finalY);
    
    const sigY = finalY + 25;
    doc.text('Coordinator Signature', 14, sigY);
    doc.text('HOD Signature', 75, sigY);
    doc.text('Dean Academic Signature', 140, sigY);
    doc.text('Principal Signature', 220, sigY);

    doc.save(`Timetable_${config.course}_${config.section}.pdf`);
  };

  return (
    <div className="space-y-12 pb-20">
      {results.map((result, idx) => (
        <div key={idx} className="glass rounded-2xl shadow-xl border border-white/40 overflow-hidden print:shadow-none print:border-none">
          <div className="bg-zinc-900/90 backdrop-blur-sm p-6 text-white flex justify-between items-center print:hidden">
            <div>
              <h2 className="text-xl font-bold">{result.config.course} - Section {result.config.section}</h2>
              <p className="text-zinc-400 text-sm">{result.config.department} Department</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => onModify(idx)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors btn-hover"
              >
                <Edit3 className="w-4 h-4" /> Modify
              </button>
              <button 
                onClick={() => exportDOCX(result)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors btn-hover"
              >
                <FileText className="w-4 h-4" /> DOCX
              </button>
              <button 
                onClick={() => exportPDF(result)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors btn-hover"
              >
                <Download className="w-4 h-4" /> PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors btn-hover"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>

          <div className="p-8 overflow-x-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-black uppercase tracking-tighter">{result.config.department} DEPARTMENT</h1>
              <p className="font-bold text-zinc-600">
                {result.config.course} | Year: {result.config.year} | Sem: {result.config.semester} | Sec: {result.config.section}
              </p>
              <div className="flex justify-center gap-8 mt-2 text-xs font-mono uppercase text-zinc-500">
                <span>Room: {result.config.roomNumber}</span>
                <span>W.E.F: {result.config.wef}</span>
                <span>Teacher: {result.config.classTeacher}</span>
              </div>
            </div>

            <table className="w-full border-collapse border-2 border-zinc-900 text-sm">
              <thead>
                <tr>
                  <th className="border-2 border-zinc-900 p-3 bg-zinc-100 font-black uppercase">Day</th>
                  {result.config.periodTimings.map((t, i) => (
                    <th key={i} className="border-2 border-zinc-900 p-3 bg-zinc-100">
                      <div className="text-[10px] font-bold text-zinc-500">{t.startTime} - {t.endTime}</div>
                      <div className="font-black uppercase">{t.isLunch ? 'Lunch' : `P${i + 1}`}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.config.workingDays.map((day, dIdx) => (
                  <tr key={day}>
                    <td className="border-2 border-zinc-900 p-3 font-black bg-zinc-50 uppercase text-center">{day.slice(0, 3)}</td>
                    {result.grid[dIdx].map((period, pIdx) => (
                      <td 
                        key={pIdx} 
                        className={`border-2 border-zinc-900 p-3 text-center min-w-[120px] ${period?.subjectCode === 'LUNCH' ? 'bg-zinc-100 italic' : ''}`}
                      >
                        {period ? (
                          <>
                            <div className="font-black text-lg leading-tight">{period.subjectCode}</div>
                            <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1">{period.facultyName}</div>
                          </>
                        ) : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-mono uppercase text-zinc-500 mb-8">
              <span>Total Periods: {result.config.periodTimings.length}</span>
              <span>Duration/Period: 1 Hour</span>
            </div>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="border-t-2 border-zinc-900 pt-6">
                <p className="font-black uppercase text-xs">Timetable Coordinator</p>
              </div>
              <div className="border-t-2 border-zinc-900 pt-6">
                <p className="font-black uppercase text-xs">Head of Department</p>
              </div>
              <div className="border-t-2 border-zinc-900 pt-6">
                <p className="font-black uppercase text-xs">Dean Academic</p>
              </div>
              <div className="border-t-2 border-zinc-900 pt-6">
                <p className="font-black uppercase text-xs">Principal</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/40 backdrop-blur-sm rounded-xl border border-zinc-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Faculty Details & Workload</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.config.subjects.map((sub, sIdx) => (
                  <div key={sIdx} className="flex justify-between items-center text-xs">
                    <span className="font-bold">{sub.code}: {sub.facultyName} {sub.facultyPhone ? `(${sub.facultyPhone})` : ''}</span>
                    <span className="text-zinc-500">{sub.weeklyHours} Hrs/Week</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
