import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Clock, BookOpen, User, Phone, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import { TimetableConfig, Subject, Day } from '../types';
import { DAYS, DEFAULT_PERIOD_TIMINGS } from '../constants';
import { cn } from '../utils/cn';

interface Props {
  initialData: TimetableConfig;
  onSubmit: (data: TimetableConfig) => void;
  onBack?: () => void;
  formIndex?: number;
  totalForms?: number;
  isLast?: boolean;
}

export const TimetableForm: React.FC<Props> = ({ 
  initialData, 
  onSubmit, 
  onBack, 
  formIndex, 
  totalForms,
  isLast = true
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<TimetableConfig>({
    defaultValues: initialData
  });

  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control,
    name: "subjects"
  });

  const { fields: timingFields, append: appendTiming, remove: removeTiming } = useFieldArray({
    control,
    name: "periodTimings"
  });

  return (
    <div className="max-w-4xl mx-auto glass rounded-2xl shadow-xl overflow-hidden border border-white/40">
      <div className="bg-zinc-900/90 backdrop-blur-sm p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {totalForms ? `Form ${formIndex! + 1} of ${totalForms}` : 'Timetable Configuration'}
          </h2>
          <p className="text-zinc-400 text-sm">Enter department and faculty details below</p>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="back-btn bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Department</label>
            <input 
              {...register("department", { required: true })}
              placeholder="e.g. CSE"
              className="w-full p-3 bg-white/50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Course</label>
            <input 
              {...register("course", { required: true })}
              placeholder="e.g. B.Tech"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Year</label>
            <select 
              {...register("year", { required: true })}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Semester</label>
            <select 
              {...register("semester", { required: true })}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            >
              <option value="">Select Semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Section</label>
            <input 
              {...register("section", { required: true })}
              placeholder="e.g. A"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Room Number</label>
            <input 
              {...register("roomNumber")}
              placeholder="e.g. 302"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Class Teacher</label>
            <input 
              {...register("classTeacher")}
              placeholder="Faculty Name"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Academic Year</label>
            <input 
              {...register("academicYear", { required: true })}
              placeholder="e.g. 2023-24"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Student Strength</label>
            <input 
              {...register("strength")}
              placeholder="e.g. 60"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">W.E.F Date</label>
            <input 
              {...register("wef")}
              type="date"
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
            />
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Period Timings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5" /> Period Timings
            </h3>
            <button 
              type="button"
              onClick={() => appendTiming({ startTime: "", endTime: "", isLunch: false })}
              className="text-sm font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 btn-hover px-2 py-1 rounded-lg hover:bg-zinc-100 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Period
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timingFields.map((field, index) => (
              <div key={field.id} className="p-3 bg-white/40 backdrop-blur-sm rounded-3xl border border-zinc-200 relative group hover:border-zinc-400 transition-all hover:shadow-md">
                <div className="flex items-center gap-1 mb-2">
                  <input 
                    {...register(`periodTimings.${index}.startTime` as const)}
                    type="time"
                    className="w-full px-2 py-1 bg-white/80 border border-zinc-200 rounded-full outline-none text-[10px] font-bold focus:ring-1 focus:ring-zinc-900 transition-all appearance-none"
                  />
                  <span className="text-zinc-400 text-[10px] font-bold">to</span>
                  <input 
                    {...register(`periodTimings.${index}.endTime` as const)}
                    type="time"
                    className="w-full px-2 py-1 bg-white/80 border border-zinc-200 rounded-full outline-none text-[10px] font-bold focus:ring-1 focus:ring-zinc-900 transition-all appearance-none"
                  />
                </div>
                <label className="flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest cursor-pointer text-zinc-500 hover:text-zinc-900 transition-colors">
                  <input 
                    {...register(`periodTimings.${index}.isLunch` as const)}
                    type="checkbox"
                    className="w-3 h-3 rounded-full border-zinc-300 text-zinc-900 focus:ring-zinc-900 transition-all"
                  />
                  Lunch Break
                </label>
                <button 
                  type="button"
                  onClick={() => removeTiming(index)}
                  className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-sm border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Subjects & Faculty */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Subjects & Faculty
            </h3>
            <button 
              type="button"
              onClick={() => appendSubject({ id: Math.random().toString(), code: "", name: "", facultyName: "", weeklyHours: 3, isLab: false })}
              className="text-sm font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 btn-hover px-2 py-1 rounded-lg hover:bg-zinc-100 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>
          
          <div className="space-y-3">
            {subjectFields.map((field, index) => (
              <div key={field.id} className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-zinc-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-end group hover:border-zinc-400 transition-colors">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Code</label>
                  <input 
                    {...register(`subjects.${index}.code` as const, { required: true })}
                    placeholder="CS301"
                    className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Subject Name</label>
                  <input 
                    {...register(`subjects.${index}.name` as const, { required: true })}
                    placeholder="Operating Systems"
                    className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Faculty</label>
                  <input 
                    {...register(`subjects.${index}.facultyName` as const, { required: true })}
                    placeholder="Dr. Smith"
                    className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Phone</label>
                  <input 
                    {...register(`subjects.${index}.facultyPhone` as const)}
                    placeholder="9876543210"
                    className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-400">Hours</label>
                  <input 
                    {...register(`subjects.${index}.weeklyHours` as const, { valueAsNumber: true })}
                    type="number"
                    className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-4 pb-2">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input 
                      {...register(`subjects.${index}.isLab` as const)}
                      type="checkbox"
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    />
                    Is Lab
                  </label>
                </div>
                <div className="md:col-span-1 flex justify-end pb-1">
                  <button 
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <button 
            type="submit"
            className={cn(
              "px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg rainbow-border btn-hover",
              isLast 
                ? "bg-zinc-900 text-white hover:bg-zinc-800" 
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            )}
          >
            {isLast ? (
              <>Generate Timetable <Save className="w-5 h-5" /></>
            ) : (
              <>Next Form <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
