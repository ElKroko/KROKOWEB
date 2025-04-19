export function analyzeAudio(audioElement: HTMLAudioElement): number {
  // En una implementación real, utilizaríamos Web Audio API para analizar el audio
  // Este es un ejemplo simple para demostración
  
  try {
    // Crear un contexto de audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Crear un analizador
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    
    // Conectar el elemento de audio al analizador
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyzer);
    analyzer.connect(audioContext.destination);
    
    // Obtener datos de frecuencia
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyzer.getByteFrequencyData(dataArray);
    
    // Calcular la intensidad promedio (normalizada a 0-1)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength / 255;
    
    return average;
  } catch (error) {
    console.error("Error analyzing audio:", error);
    return 0;
  }
}