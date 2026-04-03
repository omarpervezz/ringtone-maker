/**
 * Global app state
 * --------------------------------------------------
 * These variables store the current waveform instance,
 * selection region, uploaded file, and generated ringtone URL.
 */
let wavesurfer = null;
let regionsPlugin = null;
let activeRegion = null;
let currentFile = null;
let ringtoneUrl = null;

/**
 * DOM references
 * --------------------------------------------------
 * Cache all required DOM elements once so we do not
 * repeatedly query the document.
 */
const audioFileInput = document.getElementById("audioFile");
const fileNameEl = document.getElementById("fileName");
const startLabel = document.getElementById("startLabel");
const endLabel = document.getElementById("endLabel");
const durationLabel = document.getElementById("durationLabel");
const currentTimeLabel = document.getElementById("currentTimeLabel");
const playPauseBtn = document.getElementById("playPauseBtn");
const playSelectionBtn = document.getElementById("playSelectionBtn");
const resetSelectionBtn = document.getElementById("resetSelectionBtn");
const makeRingtoneBtn = document.getElementById("makeRingtoneBtn");
const downloadLink = document.getElementById("downloadLink");
const messageEl = document.getElementById("message");
const dropzone = document.getElementById("dropzone");

/**
 * Convert seconds into a mm:ss.s format.
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1).padStart(4, "0");
  return `${String(mins).padStart(2, "0")}:${secs}`;
}

/**
 * Show a status message to the user.
 */
function setMessage(text, type = "neutral") {
  messageEl.textContent = text;
  messageEl.className = "mt-5 min-h-6 text-sm";

  if (type === "error") {
    messageEl.classList.add("message-error");
    return;
  }

  if (type === "success") {
    messageEl.classList.add("message-success");
    return;
  }

  messageEl.classList.add("message-neutral");
}

/**
 * Update visible values for the active region.
 */
function updateRegionInfo(region) {
  if (!region) return;

  startLabel.textContent = formatTime(region.start);
  endLabel.textContent = formatTime(region.end);
  durationLabel.textContent = `${(region.end - region.start).toFixed(1)} sec`;
}

/**
 * Enable or disable the control buttons.
 */
function setControlsEnabled(enabled) {
  playPauseBtn.disabled = !enabled;
  playSelectionBtn.disabled = !enabled;
  resetSelectionBtn.disabled = !enabled;
  makeRingtoneBtn.disabled = !enabled;
}

/**
 * Reset all visible timing values to their defaults.
 */
function resetDisplayValues() {
  startLabel.textContent = "00:00.0";
  endLabel.textContent = "00:00.0";
  durationLabel.textContent = "0.0 sec";
  currentTimeLabel.textContent = "00:00.0";
  playPauseBtn.textContent = "▶";
}

/**
 * Clean up the previously generated ringtone URL.
 */
function cleanupRingtoneUrl() {
  if (ringtoneUrl) {
    URL.revokeObjectURL(ringtoneUrl);
    ringtoneUrl = null;
  }
}

/**
 * Destroy the current waveform instance.
 */
function destroyWaveform() {
  if (wavesurfer) {
    wavesurfer.destroy();
    wavesurfer = null;
  }

  activeRegion = null;
}

/**
 * Create a default region after the waveform is ready.
 */
function createDefaultRegion(duration) {
  if (!regionsPlugin) return;

  const preferredStart = duration > 15 ? duration * 0.15 : 0;
  const preferredLength = Math.min(12.8, Math.max(5, duration * 0.25));

  const start = Math.max(
    0,
    Math.min(preferredStart, Math.max(0, duration - 1)),
  );
  const end = Math.min(duration, start + preferredLength);

  const region = regionsPlugin.addRegion({
    start,
    end,
    drag: true,
    resize: true,
    color: "rgba(34, 211, 238, 0.18)",
  });

  activeRegion = region;
  updateRegionInfo(region);
}

/**
 * Ensure only one region exists at a time.
 */
function ensureSingleRegion(region) {
  const allRegions = regionsPlugin.getRegions();

  allRegions.forEach((existingRegion) => {
    if (existingRegion.id !== region.id) {
      existingRegion.remove();
    }
  });

  activeRegion = region;
  updateRegionInfo(region);
}

/**
 * Initialize WaveSurfer and bind its events.
 */
function initWaveform(file) {
  destroyWaveform();
  cleanupRingtoneUrl();
  downloadLink.classList.add("hidden");

  regionsPlugin = WaveSurfer.Regions.create();

  wavesurfer = WaveSurfer.create({
    container: "#waveform",
    height: 220,
    waveColor: "#94a3b8",
    progressColor: "#f8fafc",
    cursorColor: "#ffffff",
    barWidth: 2,
    barGap: 2,
    barRadius: 999,
    normalize: true,
    dragToSeek: true,
    plugins: [regionsPlugin],
  });

  wavesurfer.on("ready", () => {
    const duration = wavesurfer.getDuration();
    createDefaultRegion(duration);
    setControlsEnabled(true);
    setMessage("Audio loaded. Adjust the selection and create your ringtone.");
  });

  wavesurfer.on("timeupdate", (currentTime) => {
    currentTimeLabel.textContent = formatTime(currentTime);
  });

  wavesurfer.on("play", () => {
    playPauseBtn.textContent = "⏸";
  });

  wavesurfer.on("pause", () => {
    playPauseBtn.textContent = "▶";
  });

  wavesurfer.on("finish", () => {
    playPauseBtn.textContent = "▶";
  });

  wavesurfer.on("error", (error) => {
    console.error(error);
    setMessage("Could not load this audio file.", "error");
    setControlsEnabled(false);
    resetDisplayValues();
  });

  regionsPlugin.on("region-created", (region) => {
    ensureSingleRegion(region);
  });

  regionsPlugin.on("region-updated", (region) => {
    activeRegion = region;
    updateRegionInfo(region);
  });

  regionsPlugin.enableDragSelection({
    color: "rgba(34, 211, 238, 0.18)",
    drag: true,
    resize: true,
  });

  wavesurfer.loadBlob(file);
}

/**
 * Check whether the selected file is a valid MP3.
 */
function validateMp3File(file) {
  if (!file) return false;

  return (
    file.type === "audio/mpeg" ||
    file.type === "audio/mp3" ||
    file.name.toLowerCase().endsWith(".mp3")
  );
}

/**
 * Validate and process a selected file.
 */
function handleSelectedFile(file) {
  if (!validateMp3File(file)) {
    audioFileInput.value = "";
    currentFile = null;
    fileNameEl.textContent = "No file selected";
    setControlsEnabled(false);
    resetDisplayValues();
    cleanupRingtoneUrl();
    downloadLink.classList.add("hidden");
    setMessage("Only MP3 files are allowed.", "error");
    return;
  }

  currentFile = file;
  fileNameEl.textContent = file.name;
  setMessage("Loading audio...");
  initWaveform(file);
}

/**
 * File input change handler.
 */
audioFileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  handleSelectedFile(file);
});

/**
 * Drag-over highlight state.
 */
dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("border-cyan-400/60", "bg-cyan-400/10");
});

/**
 * Remove drag-over highlight state.
 */
dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("border-cyan-400/60", "bg-cyan-400/10");
});

/**
 * Handle file drop upload.
 */
dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("border-cyan-400/60", "bg-cyan-400/10");

  const file = event.dataTransfer?.files?.[0];
  if (!file) return;

  handleSelectedFile(file);
});

/**
 * Toggle full track playback.
 */
playPauseBtn.addEventListener("click", () => {
  if (!wavesurfer) return;
  wavesurfer.playPause();
});

/**
 * Play only the selected region.
 */
playSelectionBtn.addEventListener("click", () => {
  if (!wavesurfer || !activeRegion) return;
  activeRegion.play();
});

/**
 * Reset the selected region back to default.
 */
resetSelectionBtn.addEventListener("click", () => {
  if (!wavesurfer || !regionsPlugin) return;

  const duration = wavesurfer.getDuration();
  regionsPlugin.getRegions().forEach((region) => region.remove());
  createDefaultRegion(duration);
});

/**
 * Generate a ringtone from the current selection.
 */
makeRingtoneBtn.addEventListener("click", async () => {
  try {
    if (!currentFile || !activeRegion) {
      setMessage("Please upload an MP3 and select a region first.", "error");
      return;
    }

    setMessage("Creating ringtone...");
    cleanupRingtoneUrl();
    downloadLink.classList.add("hidden");

    const arrayBuffer = await currentFile.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const sampleRate = audioBuffer.sampleRate;
    const startOffset = Math.floor(activeRegion.start * sampleRate);
    const endOffset = Math.floor(activeRegion.end * sampleRate);
    const frameCount = endOffset - startOffset;

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      frameCount,
      sampleRate,
    );

    const slicedBuffer = offlineContext.createBuffer(
      audioBuffer.numberOfChannels,
      frameCount,
      sampleRate,
    );

    for (
      let channel = 0;
      channel < audioBuffer.numberOfChannels;
      channel += 1
    ) {
      const sourceData = audioBuffer
        .getChannelData(channel)
        .slice(startOffset, endOffset);

      slicedBuffer.copyToChannel(sourceData, channel, 0);
    }

    const source = offlineContext.createBufferSource();
    source.buffer = slicedBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    const wavBlob = audioBufferToWavBlob(renderedBuffer);

    ringtoneUrl = URL.createObjectURL(wavBlob);
    downloadLink.href = ringtoneUrl;
    downloadLink.download = `${currentFile.name.replace(/\.mp3$/i, "")}-ringtone.wav`;
    downloadLink.classList.remove("hidden");

    setMessage(
      "Ringtone created successfully. Your download is ready.",
      "success",
    );
    await audioContext.close();
  } catch (error) {
    console.error(error);
    setMessage("Failed to create ringtone.", "error");
  }
});

/**
 * Convert AudioBuffer -> WAV Blob
 */
function audioBufferToWavBlob(buffer) {
  const wavArrayBuffer = audioBufferToWav(buffer);
  return new Blob([wavArrayBuffer], { type: "audio/wav" });
}

/**
 * Convert AudioBuffer -> WAV ArrayBuffer
 */
function audioBufferToWav(buffer) {
  const numOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;

  const channelData = [];
  for (let i = 0; i < numOfChannels; i += 1) {
    channelData.push(buffer.getChannelData(i));
  }

  const interleaved = interleave(channelData);
  const byteRate = sampleRate * numOfChannels * (bitDepth / 8);
  const blockAlign = numOfChannels * (bitDepth / 8);
  const dataSize = interleaved.length * 2;
  const bufferLength = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  floatTo16BitPCM(view, 44, interleaved);

  return arrayBuffer;
}

/**
 * Interleave multi-channel audio data.
 */
function interleave(channelData) {
  if (channelData.length === 1) {
    return channelData[0];
  }

  const length = channelData[0].length + channelData[1].length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    for (let channel = 0; channel < channelData.length; channel += 1) {
      result[index++] = channelData[channel][inputIndex];
    }
    inputIndex += 1;
  }

  return result;
}

/**
 * Convert Float32 audio samples to 16-bit PCM.
 */
function floatTo16BitPCM(output, offset, input) {
  for (let i = 0; i < input.length; i += 1, offset += 2) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(
      offset,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true,
    );
  }
}

/**
 * Write a string into a DataView.
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i += 1) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
