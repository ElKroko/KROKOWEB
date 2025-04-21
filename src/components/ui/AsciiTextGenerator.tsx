'use client';

import React, { useState, useEffect, useRef } from 'react';
import Typography from '@/components/ui/Typography';
import { 
  asciiTextStyles, 
  generateAsciiArt, 
  AsciiTextStyle, 
  figletFonts 
} from '@/lib/ascii-art';
import { FiCopy, FiDownload, FiRefreshCw } from 'react-icons/fi';

interface AsciiTextGeneratorProps {
  initialText?: string;
}

const AsciiTextGenerator: React.FC<AsciiTextGeneratorProps> = ({ 
  initialText = 'KROKO' 
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<AsciiTextStyle | null>(asciiTextStyles[0]);
  const [generatedASCII, setGeneratedASCII] = useState<string>('');
  const [customFont, setCustomFont] = useState<string>('Standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Generar el arte ASCII cuando cambie el texto o el estilo
  useEffect(() => {
    if (selectedStyle) {
      generateAscii();
    }
  }, [selectedStyle, inputText]);

  // Función para generar el arte ASCII
  const generateAscii = async () => {
    if (!selectedStyle) return;
    
    setIsGenerating(true);
    try {
      // Clonar las opciones del estilo seleccionado para personalizaciones
      const styleOptions = {
        ...selectedStyle,
        options: { ...selectedStyle.options }
      };
      
      // Si se seleccionó una fuente personalizada y es un estilo figlet
      if (styleFilter === 'custom-font' && !selectedStyle.customRenderer) {
        styleOptions.options = { ...styleOptions.options, font: customFont };
      }
      
      const ascii = await generateAsciiArt(inputText || 'KROKO', styleOptions);
      setGeneratedASCII(ascii);
    } catch (error) {
      console.error('Error generando ASCII:', error);
      setGeneratedASCII('Error generando arte ASCII');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar al portapapeles
  const copyToClipboard = () => {
    if (navigator.clipboard && generatedASCII) {
      navigator.clipboard.writeText(generatedASCII)
        .then(() => {
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2000);
        })
        .catch(err => {
          console.error('Error al copiar:', err);
        });
    }
  };

  // Descargar como archivo de texto
  const downloadAsText = () => {
    if (generatedASCII) {
      const element = document.createElement('a');
      const file = new Blob([generatedASCII], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${inputText || 'kroko'}-ascii-art.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Filtrar los estilos según la selección
  const filteredStyles = () => {
    if (styleFilter === 'all') return asciiTextStyles;
    if (styleFilter === 'figlet') return asciiTextStyles.filter(style => style.category === 'figlet');
    if (styleFilter === 'custom') return asciiTextStyles.filter(style => style.category === 'custom');
    if (styleFilter === 'custom-font') return [
      {
        id: 'custom-font',
        name: 'Fuente Personalizada',
        figletFont: customFont,
        description: 'Usa una fuente específica de figlet',
        preview: 'KROKO',
        category: 'figlet',
        options: { font: customFont }
      }
    ];
    return asciiTextStyles;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Sección superior: Entrada de texto y configuración */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel de entrada de texto */}
          <div className="lg:w-1/2 p-6 bg-accent-bg/30 rounded-lg border-2 border-accent-strong">
            <Typography variant="h3" className="mb-4 text-accent-strong">Texto de entrada</Typography>
            
            <div className="mb-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un texto para convertir a ASCII..."
                className="w-full p-3 border-2 border-accent-bg rounded-md bg-black/20 text-foreground placeholder:opacity-70"
                maxLength={50}
              />
              <p className="text-xs opacity-70 mt-1">Máximo 50 caracteres. Mejor funcionamiento con texto corto.</p>
            </div>
            
            <div className="mb-4">
              <Typography variant="h4" className="mb-2">Filtrar estilos</Typography>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStyleFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${styleFilter === 'all' ? 'bg-accent-strong text-white' : 'bg-accent-bg text-foreground'}`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStyleFilter('figlet')}
                  className={`px-3 py-1 text-sm rounded-md ${styleFilter === 'figlet' ? 'bg-accent-strong text-white' : 'bg-accent-bg text-foreground'}`}
                >
                  Fuentes Figlet
                </button>
                <button
                  onClick={() => setStyleFilter('custom')}
                  className={`px-3 py-1 text-sm rounded-md ${styleFilter === 'custom' ? 'bg-accent-strong text-white' : 'bg-accent-bg text-foreground'}`}
                >
                  Estilos Personalizados
                </button>
                <button
                  onClick={() => {
                    setStyleFilter('custom-font');
                    setShowFontSelector(true);
                  }}
                  className={`px-3 py-1 text-sm rounded-md ${styleFilter === 'custom-font' ? 'bg-accent-strong text-white' : 'bg-accent-bg text-foreground'}`}
                >
                  Fuente Específica
                </button>
              </div>
            </div>

            {/* Selector de fuente (mostrado solo cuando se selecciona "Fuente Específica") */}
            {showFontSelector && (
              <div className="mb-4">
                <Typography variant="h4" className="mb-2">Seleccionar fuente</Typography>
                <select
                  value={customFont}
                  onChange={(e) => {
                    setCustomFont(e.target.value);
                    // Si está en modo fuente específica, regenerar el ASCII
                    if (styleFilter === 'custom-font') {
                      generateAscii();
                    }
                  }}
                  className="w-full p-2 border-2 border-accent-bg rounded-md bg-black/20 text-foreground"
                >
                  {figletFonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Panel de estilos */}
          <div className="lg:w-1/2 p-6 bg-accent-bg/30 rounded-lg border-2 border-accent-strong">
            <Typography variant="h3" className="mb-4 text-accent-strong">Estilos disponibles</Typography>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2">
              {filteredStyles().map((style) => (
                <div
                  key={style.id}
                  onClick={() => {
                    setSelectedStyle(style);
                    setShowFontSelector(style.id === 'custom-font');
                  }}
                  className={`cursor-pointer p-3 rounded-md border-2 transition-all ${
                    selectedStyle?.id === style.id
                      ? 'border-accent-strong bg-accent-strong/20'
                      : 'border-accent-bg bg-accent-bg/30 hover:bg-accent-bg/50'
                  }`}
                >
                  <Typography variant="h4" className="text-sm mb-1">{style.name}</Typography>
                  <Typography variant="p" className="text-xs opacity-70 mb-2">{style.description}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sección inferior: Resultado y controles */}
        <div className="p-6 bg-black rounded-lg border-2 border-accent-strong">
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h3" className="text-accent-strong">
              {selectedStyle ? `Arte ASCII - ${selectedStyle.name}` : 'Resultado'}
            </Typography>
            
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!generatedASCII}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-accent-bg text-foreground hover:bg-accent-bg/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCopy size={14} />
                <span className="text-sm">Copiar</span>
              </button>
              <button
                onClick={downloadAsText}
                disabled={!generatedASCII}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-accent-bg text-foreground hover:bg-accent-bg/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiDownload size={14} />
                <span className="text-sm">Descargar</span>
              </button>
              <button
                onClick={generateAscii}
                disabled={isGenerating}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-accent-strong text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                <span className="text-sm">Regenerar</span>
              </button>
            </div>
          </div>
          
          {/* Notificación de copiado */}
          {copiedNotification && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md animate-fade-out">
              ¡Copiado al portapapeles!
            </div>
          )}
          
          {/* Resultado ASCII */}
          <div className="relative min-h-[300px] max-h-[500px] overflow-auto bg-black p-4 rounded-md">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-accent-strong">Generando...</div>
              </div>
            ) : (
              <textarea
                ref={textAreaRef}
                readOnly
                value={generatedASCII}
                className="w-full h-full min-h-[300px] bg-transparent text-accent-strong font-mono resize-none border-none focus:outline-none focus:ring-0"
                style={{
                  whiteSpace: 'pre',
                  overflowWrap: 'normal',
                  overflowX: 'auto'
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsciiTextGenerator;