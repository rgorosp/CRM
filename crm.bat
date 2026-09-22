@echo off
title CRM - http://localhost:3100
cd /d "%~dp0"

rem Endereco do CRM. A porta 3100 esta fixa no script "dev" do package.json.
set "URL=http://localhost:3100"

where npm >nul 2>nul
if errorlevel 1 (
    echo O npm nao foi encontrado. Instale o Node.js e abra este menu de novo.
    pause
    exit /b 1
)

:menu
cls
echo =========================================================
echo  CRM - acesso pelo localhost
echo =========================================================
echo  1) Ligar o CRM e abrir no navegador
echo  2) Abrir o CRM no navegador (servidor ja ligado)
echo  3) Sair
echo ---------------------------------------------------------
echo  Endereco: %URL%
echo =========================================================
set "escolha="
set /p escolha=Digite a opcao:

if "%escolha%"=="1" goto ligar
if "%escolha%"=="2" goto abrir
if "%escolha%"=="3" exit /b 0

echo Opcao invalida.
pause
goto menu

:ligar
rem Se o CRM ja responde, ligar de novo daria erro de porta ocupada.
curl -s -o nul --connect-timeout 2 %URL%/login
if not errorlevel 1 (
    echo O CRM ja esta ligado em outra janela.
    goto abrir
)
echo.
echo Ligando o CRM. O navegador abre sozinho quando o servidor estiver pronto.
echo Para DESLIGAR: Ctrl+C nesta janela, ou feche esta janela.
echo Fechar a aba do navegador NAO desliga o servidor.
echo.
rem Em segundo plano: espera o servidor responder (ate 60 s) e so entao abre o
rem navegador. Abrir antes disso mostraria "nao foi possivel acessar esta pagina".
start "" /b cmd /c "curl -s -o nul --retry 60 --retry-delay 1 --retry-connrefused %URL%/login && start %URL%"
call npm run dev
echo.
echo O servidor do CRM foi desligado.
pause
goto menu

:abrir
curl -s -o nul --connect-timeout 2 %URL%/login
if errorlevel 1 (
    echo O CRM esta desligado. Use a opcao 1 para ligar.
    pause
    goto menu
)
echo Abrindo %URL% no navegador...
start "" %URL%
exit /b 0
