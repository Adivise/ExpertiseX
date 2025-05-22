@echo off
title BackEnd
set TOKEN=%1
set PORT=%2
cd /d "%~dp0..\\BackEnd"

node index.js %TOKEN% %PORT%
exit