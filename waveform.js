async function decodeAndDisplayAudio(audioFilePath) {
  const response = await fetch(audioFilePath);
  const audioData = await response.arrayBuffer();
  const audioCtx = new AudioContext();

  const source = audioCtx.createBufferSource();
  source.buffer = await audioCtx.decodeAudioData(audioData);

  const canvas = document.getElementById("waveformCanvas");
  drawWaveform(source.buffer, canvas, 0.5, 1);
}

decodeAndDisplayAudio("resources/Owl City - Fireflies (Official Music Video) [psuRGfAaju4].wav");






function drawWaveform (audioBuffer, canvas, pos = 0.5, zoom = 1) {
  const canvasCtx = canvas.getContext("2d")
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  canvasCtx.clearRect(0, 0, width, height)
  canvasCtx.fillStyle  = "rgb(255, 0, 0)"

  // calculate displayed part of audio 
  // and slice audio buffer to only process that part
  const bufferLength = audioBuffer.length
  const zoomLength = bufferLength / zoom
  const start = Math.max(0, bufferLength * pos - zoomLength / 2)
  const end = Math.min(bufferLength, start + zoomLength)
  const rawAudioData = audioBuffer.getChannelData(0).slice(start, end)

  // process chunks corresponding to 1 pixel width
  const chunkSize = Math.max(1, Math.floor(rawAudioData.length / width))
  const values = []
  for (let x = 0; x < width; x++) {
    const start = x*chunkSize
    const end = start + chunkSize
    const chunk = rawAudioData.slice(start, end)
    // calculate the total positive and negative area
    let positive = 0
    let negative = 0
    chunk.forEach(val => 
      val > 0 && (positive += val) || val < 0 && (negative += val)
    )
    // make it mean (this part makes dezommed audio smaller, needs improvement)
    negative /= chunk.length
    positive /= chunk.length
    // calculate amplitude of the wave
    chunkAmp = -(negative - positive)
    // draw the bar corresponding to this pixel
    canvasCtx.fillRect(
      x,
      height / 2 - positive * height,
      1,
      Math.max(1, chunkAmp * height)
    )
  }
}
