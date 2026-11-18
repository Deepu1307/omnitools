'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Video, 
  Upload, 
  ArrowLeft, 
  Download, 
  Sparkles, 
  Play, 
  Pause, 
  Scissors,
  RotateCcw,
  Film
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function VideoClipperPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [clippedBlobUrl, setClippedBlobUrl] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a valid MP4 or WebM video file.');
      return;
    }
    setErrorMessage(null);
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setClippedBlobUrl(null);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, 10));
    }
  };

  const handlePlayPreviewRange = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = startTime;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.pause();
        videoRef.current.currentTime = startTime;
        setIsPlaying(false);
      }
    }
  };

  // Client-side video trimming via Canvas & MediaRecorder
  const handleExportClip = async () => {
    if (!videoRef.current || !videoUrl) return;
    setIsExporting(true);
    setExportProgress(0);

    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = false;
    await video.play();
    video.pause();

    video.currentTime = startTime;

    const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream?.();

    if (!stream) {
      setErrorMessage('Your browser does not support in-browser media recording.');
      setIsExporting(false);
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setClippedBlobUrl(url);
      setIsExporting(false);
    };

    mediaRecorder.start();
    video.play();

    const checkInterval = setInterval(() => {
      if (video.currentTime >= endTime || video.ended) {
        clearInterval(checkInterval);
        mediaRecorder.stop();
        video.pause();
      } else {
        const progress = Math.round(((video.currentTime - startTime) / (endTime - startTime)) * 100);
        setExportProgress(Math.min(100, Math.max(0, progress)));
      }
    }, 100);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}.${ms}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 mb-3">
          <Film className="w-3.5 h-3.5" />
          <span>Client-Side Video Trimmer • No Watermarks</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Video Clipper & Trimmer</h1>
        <p className="text-sm text-slate-500 mt-1">Select and trim clips from videos in your browser with exact second precision.</p>
      </div>

      {!videoUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-3xl p-12 text-center cursor-pointer bg-white transition-all shadow-sm hover:bg-slate-50/50"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept="video/mp4,video/webm"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Select or Drag Your MP4 Video</h3>
          <p className="text-xs text-slate-400 mt-1.5">Processed 100% locally. Zero server upload time.</p>
          <button className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow">
            Browse Video File
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="font-bold text-slate-800 text-sm truncate max-w-sm">{videoFile?.name}</span>
            <button
              onClick={() => { setVideoUrl(null); setClippedBlobUrl(null); }}
              className="text-xs text-slate-400 hover:text-rose-500"
            >
              Choose Another Video
            </button>
          </div>

          {/* Video Player Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center shadow-inner">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              className="max-h-full max-w-full"
              controls={false}
            />
          </div>

          {/* Trimming Timeline Controls */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">Start Timestamp</span>
                <span className="font-bold text-slate-800 text-base">{formatSeconds(startTime)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">End Timestamp</span>
                <span className="font-bold text-slate-800 text-base">{formatSeconds(endTime)}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 p-3 rounded-xl border border-purple-200">
                <span className="text-[11px] font-semibold text-purple-600 uppercase block">Clip Length</span>
                <span className="font-bold text-purple-900 text-base">{formatSeconds(Math.max(0, endTime - startTime))}</span>
              </div>
            </div>

            {/* Slider controls */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Start Point</span>
                  <span>{startTime.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, endTime - 0.5)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setStartTime(val);
                    if (videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>End Point</span>
                  <span>{endTime.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min={startTime + 0.5}
                  max={duration || 10}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEndTime(val);
                  }}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handlePlayPreviewRange}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-2 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>Preview Selection</span>
              </button>

              <button
                onClick={handleExportClip}
                disabled={isExporting}
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 transition-colors shadow disabled:opacity-50"
              >
                <Scissors className="w-4 h-4" />
                <span>{isExporting ? `Trimming Clip (${exportProgress}%)...` : 'Export Clipped Video'}</span>
              </button>
            </div>

            {clippedBlobUrl && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-emerald-900 text-sm">Clip Ready!</h5>
                  <p className="text-xs text-emerald-700">Exported without watermarks directly from your browser.</p>
                </div>
                <a
                  href={clippedBlobUrl}
                  download="omnitools-clipped.webm"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WebM</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <AdBanner slot="in-tool" />
    </div>
  );
}
