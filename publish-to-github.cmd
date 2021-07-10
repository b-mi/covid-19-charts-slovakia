@echo off
rem Your site is published at https://b-mi.github.io/covid-19-charts-slovakia/
set GHUSER=b-mi
set GHREPONAME=covid-19-charts-slovakia
ng build -c production --base-href "https://%GHUSER%.github.io/%GHREPONAME%/"
npx angular-cli-ghpages --dir=dist/covid-19-charts-slovakia
pause