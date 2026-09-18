# Marcel Steek · Architektur

Fertiges Website-Paket für GitHub Pages, Stand 18.09.2026.

Vier Hauptseiten: **Aktuell**, **Projekte**, **Profil** und **Kontakt**. Dazu eine installierbare PWA, eine Offline-Seite und vorbereitete rechtliche Angaben. Die Website benötigt keinen Build-Schritt, kein npm und keinen eigenen Server.

## 1. Schnell ansehen

1. ZIP-Datei vollständig entpacken.
2. `index.html` im Browser öffnen.
3. Navigation, Galerie, Filter und Projektdialoge können direkt benutzt werden.

Installation als App und Offline-Speicherung benötigen die veröffentlichte HTTPS-Website. Sie funktionieren nicht beim Doppelklick auf eine lokale Datei.

## 2. Auf GitHub veröffentlichen

1. Bei GitHub ein neues Repository anlegen, beispielsweise `marcel-steek-architektur`.
2. Für GitHub Free ein **öffentliches** Repository verwenden. Bei geeigneten kostenpflichtigen Plänen können auch private Repositories als Quelle dienen.
3. Im Repository **Add file → Upload files** wählen.
4. Den **gesamten entpackten Inhalt** einschließlich des Ordners `assets` hochladen. `index.html` muss direkt auf der obersten Ebene des Repositorys liegen. Nicht die ZIP-Datei und nicht einen zusätzlichen übergeordneten Ordner hochladen.
5. Mit **Commit changes** speichern.
6. Unter **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch** wählen.
7. Branch **main** und Ordner **/(root)** auswählen, dann **Save**.
8. Nach dem erfolgreichen Pages-Lauf steht die Website-Adresse unter **Settings → Pages**.

Die Datei `.nojekyll` gehört zum Paket. Falls dein Dateimanager sie ausblendet, kannst du sie zusätzlich in GitHub als leere Datei anlegen. Es ist kein eigener GitHub-Actions-Workflow nötig. Alle Links und PWA-Pfade sind relativ und funktionieren auch unter einem Repository-Unterordner.

Quelle: [GitHub-Dokumentation zur Veröffentlichungsquelle](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## 3. Kontaktformular einrichten

Die echte Kontaktadresse wurde noch nicht angegeben. Deshalb startet die Website mit einem funktionierenden **Vorschaumodus**: Angaben prüfen, Anfrage als Text vorbereiten und kopieren. Es wird keine Zustellung vorgetäuscht.

### Variante A: E-Mail-Programm verwenden

In `site-config.js` bei `contactEmail` Marcels tatsächliche E-Mail-Adresse zwischen den Anführungszeichen eintragen. `formEndpoint` leer lassen.

Das Formular prüft die Pflichtfelder und bereitet anschließend eine E-Mail vor. Mit **E-Mail öffnen** übernimmt der Besucher die Nachricht in sein E-Mail-Programm. Dort wird sie tatsächlich versendet. Als Alternative bleibt der Text kopierbar. Sehr lange Nachrichten lassen sich gegebenenfalls besser kopieren, da E-Mail-Programme unterschiedlich lange `mailto`-Links unterstützen.

### Variante B: Direkt aus der Website senden

Einen öffentlichen HTTPS-Formular-Endpunkt eines passenden Formulardienstes in `formEndpoint` eintragen. Die Implementierung unterstützt Formspree-kompatible Endpunkte: `POST` mit `FormData`, `Accept: application/json`, CORS-Freigabe für die Website und HTTP-Erfolgscode bei angenommener Nachricht. Die Antwort darf nicht auf eine andere URL umleiten. Einen solchen öffentlichen Endpunkt benutzen; niemals geheime API-Schlüssel eintragen.

Die Formularfelder heißen `name`, `email`, `phone`, `topic`, `message`, `consent`, `_subject` und `_gotcha` (Spam-Falle). Der Formulardienst muss Empfänger und Spam-Schutz verwalten. Ein Browserformular allein bietet keinen zuverlässigen serverseitigen Spam-Schutz.

Bei Verbindungsfehlern bleiben die Eingaben erhalten. Ohne Verbindung wird nichts gesendet. Die Website speichert keine Nachrichten dauerhaft und führt keine Hintergrundzustellung aus. Den tatsächlichen Empfang nach Einrichtung mit einer eigenen Testanfrage kontrollieren.

**Nach jeder Änderung** auch die Versionsnummer in `sw.js` erhöhen, beispielsweise von `v1` auf `v2`, und beide Dateien gemeinsam hochladen.

## 4. Vor der öffentlichen Nutzung ergänzen

- In `rechtliches.html` sind Anschrift, Kontaktangaben sowie Kammer- und weitere erforderliche Anbieterangaben ausdrücklich als fehlend markiert. Es wurden keine Daten erfunden.
- Die Datenschutzhinweise sind eine Entwurfsfassung. An die tatsächlichen Anbieterangaben, das verwendete Hosting und einen gegebenenfalls verwendeten Formulardienst anpassen.
- Alle sechs Projekte sind bewusst fiktive Beispiele. Für ein echtes Portfolio durch eigene Projekte ersetzen; Bildreferenzen nicht als eigene Referenzbauten ausgeben.
- Das Porträt ist die bereitgestellte Datei. Für große, besonders scharfe Darstellungen später eine höher aufgelöste Originaldatei einsetzen.

## 5. Als App installieren

Die veröffentlichte Website einmal vollständig mit Internetverbindung laden.

- **Chrome/Edge/Android:** Falls vom Browser angeboten, im Website-Footer **App installieren** wählen oder die Installationsfunktion des Browsers verwenden.
- **iPhone/iPad:** In Safari über das Teilen-Menü die Website zum Home-Bildschirm hinzufügen. Die Bezeichnung kann je nach Systemversion variieren.

Nach erfolgreicher Initialisierung speichert die PWA ihre Seiten und Bilder für den Offline-Zugriff. Die Offline-Speicherung hängt auch vom verfügbaren Browserspeicher ab. Ein Browser kann gespeicherte Website-Daten später entfernen. Der Nachrichtenversand benötigt immer eine Verbindung.

Die App muss nach Änderungen nicht erneut installiert werden. `VERSION` in `sw.js` erhöhen und die aktualisierten Dateien hochladen. Beim nächsten Online-Besuch wird der Service Worker aktualisiert. Bereits geöffnete Seiten gegebenenfalls neu laden.

## 6. Inhalte und Gestaltung ändern

| Datei | Inhalt |
| --- | --- |
| `index.html` | Aktuell, großes Titelbild, redaktionelle Projektteaser |
| `projekte.html` | Sechs Projektkarten, Kategorien und vollständige Projektdialoge |
| `profil.html` | Porträt, Profiltext, Berufserfahrung und Ausbildung |
| `kontakt.html` | Kontaktinformationen und Formular |
| `rechtliches.html` | Anbieterangaben, Datenschutzhinweise und Bildnachweise |
| `site-config.js` | E-Mail-Adresse und optionaler Formular-Endpunkt |
| `assets/styles.css` | Responsive Gestaltung und Farbvariablen |
| `assets/app.js` | Menü, Filter, Dialoge, Kontaktlogik und Installation |
| `assets/images/` | Alle Bilddateien, einschließlich kleiner mobiler Varianten |
| `assets/icons/` | Favicon, App-Icons und Apple-Touch-Icon |
| `manifest.webmanifest` | Name, Farben und Startadresse der PWA |
| `sw.js` | Offline-Speicher und Versionsnummer |
| `image-credits.json` | Quellen und Rechtehinweise der Bildreferenzen |

Die Farben werden am Anfang von `assets/styles.css` eingestellt: Weinrot `#701f2e`, Schrift `#1b1b1a`, Hintergrund `#fafaf8`.

Die Schriftfamilie ist `Helvetica, "Helvetica Neue", Arial, sans-serif`. Helvetica wird verwendet, sofern sie auf dem Gerät vorhanden ist; andernfalls greift die Systemalternative. Es werden keine lizenzierten Helvetica-Webfontdateien mitgeliefert. Eine eigene, für Webnutzung lizenzierte Schriftdatei kann später eingebunden werden.

Beim Ersetzen von Bildern sowohl die große als auch die `-small.webp`-Datei austauschen. Wenn sich das Format ändert, `width`, `height` und `srcset` in den betroffenen HTML-Dateien anpassen.

Die Profilangaben entsprechen den gelieferten Stationen. Die ergänzenden Einleitungstexte sind redaktionelle Entwürfe und können direkt in den HTML-Dateien geändert werden.

## 7. Bildnachweise

Das Hofhaus wurde eigens als KI-Visualisierung eines fiktiven Entwurfs erstellt. Die fünf weiteren Architekturaufnahmen sind Bildreferenzen von Unsplash. Ihre Quellen, Fotografen und Lizenzlinks stehen in `image-credits.json` und auf der Seite `rechtliches.html`. Sie zeigen keine von Marcel Steek entworfenen Bauten.

Porträt: vom Auftraggeber bereitgestellt. Die Website ruft keine Bilder, Webfonts, Tracker oder Skriptbibliotheken von fremden Servern ab. Nur ein ausdrücklich eingetragener Formular-Endpunkt wird beim Absenden angesprochen.

## 8. Durchgeführte Prüfungen

- Hauptseiten im Browser dargestellt; Projektfilter, Projektdialog, Escape-Schließen und mobiles Menü bedient.
- Kontaktformular mit fiktiven lokalen Testdaten geprüft; der Entwurf wird erzeugt, ohne eine Nachricht zu versenden.
- Mobile und Tablet-Darstellung in eingebetteten Browser-Ansichten mit 320, 390 und 768 Pixel Breite geprüft.
- Lokale Seiten-, Bild- und Fragmentverweise, JavaScript-Syntax und App-Icon-Abmessungen geprüft.
- Service Worker mit den echten Paketdateien und simuliertem Netzausfall geprüft: 29 Offline-Dateien, Unterordner-Betrieb, Seiten und Bilder offline, Ersatzseite, Ausschluss von POST-Anfragen und Schutz fremder Website-Caches.

Die tatsächliche Installation auf einem Mobilgerät und ein Live-Versand über einen Formulardienst können erst nach Veröffentlichung beziehungsweise Einrichtung geprüft werden.
