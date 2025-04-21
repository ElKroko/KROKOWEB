import React, { useState, useEffect } from 'react';
import { 
  generateAsciiArt, 
  figletFonts, 
  asciiTextStyles, 
  AsciiTextStyle,
  updateFontList,
  generateFigletText,
  FigletOptions
} from '@/lib/ascii-art';

const AsciiArtGenerator = () => {
  const [text, setText] = useState('KROKO');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AsciiTextStyle>(asciiTextStyles[0]);
  const [availableFonts, setAvailableFonts] = useState<string[]>(figletFonts);
  const [selectedFont, setSelectedFont] = useState('Standard');
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [customOptions, setCustomOptions] = useState<FigletOptions>({
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  });

  // Cargar las fuentes disponibles al montar el componente
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = await updateFontList();
        setAvailableFonts(fonts);
      } catch (error) {
        console.error('Error cargando fuentes:', error);
      }
    };
    
    loadFonts();
  }, []);

  // Generar arte ASCII cuando cambie el texto o estilo
  useEffect(() => {
    const generateArt = async () => {
      if (!text) return;
      
      setLoading(true);
      try {
        let result;
        
        if (showCustomOptions) {
          // Si se están usando opciones personalizadas, usar directamente generateFigletText
          result = await generateFigletText(text, {
            ...customOptions,
            font: selectedFont
          });
        } else {
          // De lo contrario, usar el estilo seleccionado
          result = await generateAsciiArt(text, selectedStyle);
        }
        
        setOutput(result);
      } catch (error) {
        console.error('Error generando arte ASCII:', error);
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    };
    
    generateArt();
  }, [text, selectedStyle, selectedFont, customOptions, showCustomOptions]);

  // Manejar cambios en las opciones personalizadas
  const handleOptionChange = (option: keyof FigletOptions, value: any) => {
    setCustomOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-900 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-purple-500 mb-6">Generador de Arte ASCII</h1>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Texto:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
          placeholder="Ingresa texto para convertir a ASCII art"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-2">Estilo:</label>
          <div className="relative">
            <select
              value={selectedStyle.id}
              onChange={(e) => {
                const style = asciiTextStyles.find(s => s.id === e.target.value);
                if (style) setSelectedStyle(style);
                setShowCustomOptions(false);
              }}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white appearance-none"
              disabled={showCustomOptions}
            >
              {asciiTextStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name} - {style.description}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <label className="text-gray-300">Opciones Personalizadas:</label>
            <label className="inline-flex items-center ml-4 cursor-pointer">
              <input
                type="checkbox"
                checked={showCustomOptions}
                onChange={(e) => setShowCustomOptions(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded"
              />
              <span className="ml-2 text-sm text-gray-300">Activar</span>
            </label>
          </div>
        </div>
      </div>
      
      {showCustomOptions && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl text-purple-400 mb-4">Configuración Personalizada</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Fuente:</label>
              <div className="relative">
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white appearance-none"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Diseño Horizontal:</label>
              <div className="relative">
                <select
                  value={customOptions.horizontalLayout}
                  onChange={(e) => handleOptionChange('horizontalLayout', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white appearance-none"
                >
                  <option value="default">Por defecto</option>
                  <option value="full">Completo</option>
                  <option value="fitted">Ajustado</option>
                  <option value="controlled smushing">Compresión controlada</option>
                  <option value="universal smushing">Compresión universal</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Diseño Vertical:</label>
              <div className="relative">
                <select
                  value={customOptions.verticalLayout}
                  onChange={(e) => handleOptionChange('verticalLayout', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white appearance-none"
                >
                  <option value="default">Por defecto</option>
                  <option value="full">Completo</option>
                  <option value="fitted">Ajustado</option>
                  <option value="controlled smushing">Compresión controlada</option>
                  <option value="universal smushing">Compresión universal</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Ancho máximo:</label>
              <input
                type="number"
                value={customOptions.width}
                onChange={(e) => handleOptionChange('width', parseInt(e.target.value) || 80)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                min="40"
                max="200"
              />
            </div>
            
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={customOptions.whitespaceBreak}
                  onChange={(e) => handleOptionChange('whitespaceBreak', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="ml-2 text-gray-300">Dividir en espacios en blanco</span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">Resultado:</label>
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="loader"></div>
              <span className="ml-3 text-gray-300">Generando...</span>
            </div>
          ) : (
            <pre className="w-full p-4 bg-black text-green-400 font-mono overflow-auto rounded-md whitespace-pre">
              {output}
            </pre>
          )}
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
              }}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md"
              title="Copiar al portapapeles"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Generador de Arte ASCII - Desarrollado para KROKOWEB</p>
        <p className="mt-1">Disponible con {availableFonts.length} fuentes FIGlet</p>
      </div>
      
      <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #8b5cf6;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AsciiArtGenerator;