# Utstyrsutlån

GET Academy ønsker en enkel intern applikasjon for å holde oversikt over utstyr som lånes ut til studenter og ansatte.

Applikasjonen skal ha oversikt over utstyr, personer og utlån.

## Utstyr

Det skal finnes en oversikt over alt utstyr som kan lånes ut, for eksempel USB-headset, webkamera og laptopladere.

For hvert utstyr skal man kunne se om det er tilgjengelig eller utlånt.

Det skal være mulig å:

- søke etter utstyr
- starte et nytt utlån av tilgjengelig utstyr
- redigere informasjon om utstyr

For hvert utstyr lagres blant annet navn, kategori og en kort beskrivelse.

## Personer

Applikasjonen skal ha en enkel oversikt over personer som kan låne utstyr.

For hver person lagres:

- navn
- e-post

Det skal være mulig å registrere nye personer.

## Registrere utlån

Når et utstyr lånes ut, skal brukeren velge hvilken person som låner det.

Utlånsdato registreres samtidig.

Et utstyr som allerede er utlånt skal ikke kunne lånes ut på nytt før det er levert tilbake.

## Aktive utlån

Det skal finnes en egen oversikt over alle aktive utlån.

For hvert utlån skal man se:

- hvem som har lånt utstyret
- hvilket utstyr som er lånt
- utlånsdato

Fra denne oversikten skal man kunne registrere at utstyret er levert tilbake.

## Utlånshistorikk

Tidligere og aktive utlån skal kunne vises i en historikk.

Historikken skal vise:

- person
- utstyr
- utlånsdato
- innleveringsdato dersom utstyret er levert tilbake

Et aktivt utlån vises uten innleveringsdato.

## Generelt

Applikasjonen skal være en enkel frontend-applikasjon uten backend eller innlogging.

Skjermbildene som følger med denne beskrivelsen viser ønsket funksjonalitet og brukerflyt. De skal brukes sammen med teksten som grunnlag for modellering og implementasjon.