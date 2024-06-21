#!/bin/bash

# Überprüfe, ob beide GET-Parameter übergeben wurden
if [ "$#" -ne 2 ]; then
    echo "Bitte geben Sie eine UserID und einen Hash als Parameter an."
    exit 1
fi

# Setze die URL mit den GET-Parametern
url="https://selfservice.campus-dual.de/room/json?userid=$1&hash=$2"

# Setze den Dateinamen für die lokale Speicherung
output_file="data.json"

# Führe den cURL-Befehl aus, um die Daten abzurufen und in die Datei zu speichern
curl -svk $url -o "$output_file"

# Überprüfe, ob der cURL-Befehl erfolgreich war
if [ $? -eq 0 ]; then
    echo "Daten wurden erfolgreich abgerufen und in $output_file gespeichert."
else
    echo "Fehler beim Abrufen der Daten. Bitte überprüfen Sie die URL und die Parameter."
fi
