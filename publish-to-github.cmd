@echo off
rem Your site is published at https://b-mi.github.io/covid-19-charts-slovakia/
set GHUSER=b-mi
set GHREPONAME=covid-19-charts-slovakia
ng deploy --repo=https://github.com/%GHUSER%/%GHREPONAME%.git --base-href="https://%GHUSER%.github.io/%GHREPONAME%/"
pause