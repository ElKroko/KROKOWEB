@echo off
echo Limpiando proyecto KROKOWEB...

REM Crear carpeta de destino si no existe
if not exist "old\" mkdir old

REM Mover archivos redundantes
if exist "src\components\SectionTracker.tsx" (
    move "src\components\SectionTracker.tsx" "old\" && echo Movido: SectionTracker.tsx
) else (
    echo No encontrado: SectionTracker.tsx
)

if exist "src\app\base-styles.css" (
    move "src\app\base-styles.css" "old\" && echo Movido: base-styles.css
) else (
    echo No encontrado: base-styles.css
)

if exist "src\lib\theme-config.ts" (
    move "src\lib\theme-config.ts" "old\" && echo Movido: theme-config.ts
) else (
    echo No encontrado: theme-config.ts
)

if exist "src\styles\colorConfig.ts" (
    move "src\styles\colorConfig.ts" "old\" && echo Movido: colorConfig.ts
) else (
    echo No encontrado: colorConfig.ts
)

echo Proceso de limpieza completado.