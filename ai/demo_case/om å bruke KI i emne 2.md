# Om å bruke KI i Emne 2

I Emne 2 begynner vi for alvor å bruke KI som en del av utviklingsarbeidet.

Dette er et bevisst tidspunkt å gjøre det på.

Før dette har målet vært at dere skal lære grunnleggende programmering og forstå hva kode faktisk gjør. I Emne 2 har dere også arbeidet med:

- kundebehov
- tekstlig oppsummering av bestillingen
- skjermbilder
- modellering

Når vi kommer til implementasjonen av view- og controller-funksjoner, har vi derfor allerede gjort mye av tenkearbeidet.

Det er et godt tidspunkt å la KI hjelpe oss med å produsere kode raskere.

Men målet er ikke:

> Få KI til å løse oppgaven for oss.

Målet er:

> Bli i stand til å styre KI til å produsere kode vi forstår, kan kontrollere og kan ta ansvar for.

---

# Hvorfor skal vi bruke KI?

KI-verktøy er blitt en naturlig del av utviklerarbeidet.

Når dere senere kommer ut i praksis eller jobb, vil mange bedrifter forvente at dere kan bruke slike verktøy på en fornuftig måte.

Det betyr ikke at KI skal erstatte forståelse.

Tvert imot blir en annen ferdighet viktigere:

> **Kan du vurdere om det KI har laget faktisk er bra?**

Hvis du bare kan skrive kode selv, men ikke kan bruke KI effektivt, mangler du etter hvert en viktig utviklerferdighet.

Hvis du bare kan be KI lage kode, men ikke kan lese og vurdere resultatet, har du et enda større problem.

Vi trenger begge deler.

---

# Bruk KI før du ber andre om hjelp

Hvis du står fast eller ønsker tilbakemelding, er KI ofte et naturlig første sted å spørre.

Hvis du for eksempel har laget:

- en modell
- en obligatorisk oppgave
- en controller-funksjon
- en test
- en løsning på et programmeringsproblem

kan du først be KI om å være kritisk:

> Finn svakheter ved dette. Hva kan være feil? Hvilke deler ville du undersøkt nærmere?

Deretter vurderer **du** tilbakemeldingen.

Hvis KI finner et problem du forstår og er enig i, kan du rette det.

Hvis du er usikker på om KI har rett, er det et godt tidspunkt å spørre en lærer eller en mer erfaren utvikler.

Det gjør også spørsmålet ditt bedre:

> «Jeg har prøvd dette. KI mener problemet er X. Jeg forstår argumentet slik, men er usikker på dette punktet.»

Det er mye mer nyttig enn bare:

> «Dette virker ikke. Kan du hjelpe meg?»

Men KI er ikke fasit. Den kan misforstå problemet og foreslå dårlige løsninger med stor selvsikkerhet.

---

# Chat og agent er ikke helt det samme

Vi kan bruke KI på minst to forskjellige måter.

## Chat

En vanlig KI-chat er spesielt nyttig når vi vil:

- diskutere en modell
- få forklart kode
- vurdere alternativer
- analysere et problem
- få kritikk av en løsning
- formulere et godt oppdrag til en coding agent

Da arbeider vi først og fremst gjennom samtale.

En praktisk teknikk kan være:

1. Last ned GitHub-repositoriet som ZIP.
2. Last ZIP-filen opp i en chat.
3. Be chatten gå gjennom prosjektet.
4. Diskuter problemet.
5. Be til slutt chatten skrive et presist prompt til coding-agenten som skal gjøre endringene.

Dette er ofte bedre enn å starte med:

> «Agent, fiks dette.»

---

# Coding agent

En coding agent arbeider direkte med kodebasen.

Den kan typisk:

- lese mange filer
- opprette filer
- endre eksisterende filer
- søke gjennom prosjektet
- kjøre tester
- rette feil
- gjennomføre endringer på tvers av hele løsningen

En agent kan derfor gjøre mye mer enn å gi deg et kodeforslag som du selv må kopiere.

Dette gjør agenten svært nyttig.

Det gjør også at en dårlig instruks kan gjøre langt større skade.

---

# Hva trenger en agent?

Jo bedre kontekst agenten får, desto større er sjansen for et godt resultat.

I Emne 2 kan en svært god startpakke være:

1. **bestillingen fra kunden**
2. **skjermbildene**
3. **modellen**
4. **reglene for hvordan vi bygger apper i Emne 2**

I demo-caset vårt ligger de tre første i:

```text
AI/
└── Demo_Case/
    ├── Bestilling.md
    ├── model.js
    └── skjermbilder.png
```

I tillegg har vi dokumentet:

```text
Om Emne 2-måten å bygge en applikasjon.md
```

Dette gir KI både:

- **hva vi skal bygge**
- **hvordan vi vil at det skal bygges**

Forskjellen er viktig.

---

# Demo 1 – et helt rimelig, men naivt KI-oppdrag

Vi starter med:

- kundebeskrivelsen
- skjermbildene
- modellen

Men vi sier ingenting om hvordan vi har lært å programmere i Emne 2.

Vi gir agenten omtrent dette oppdraget:

## Prompt – demo 1

> Les den vedlagte beskrivelsen, skjermbildene og JavaScript-modellen.
>
> Lag en komplett fungerende frontend-applikasjon basert på dette.
>
> Bruk HTML, CSS og JavaScript.
>
> Implementer skjermbildene og funksjonaliteten som fremgår av materialet.
>
> Bruk modellen som utgangspunkt for data og state.
>
> Kontroller at applikasjonen fungerer når du er ferdig.

Dette er ikke et dårlig prompt.

Vi har gitt KI:

- en bestilling
- skjermbilder
- en modell
- teknologien JavaScript

La oss se hva vi får.

---

# Første kontroll: Fungerer appen?

Vi starter med å kjøre løsningen.

Kanskje:

- skjermbildene ser fine ut
- knappene virker
- søket fungerer
- utlån kan registreres
- et utlån kan leveres tilbake
- historikken fungerer

Det er lett å konkludere:

> Dette var jo kjempebra.

Men det er bare første kontroll.

---

# Andre kontroll: Hva slags kode fikk vi?

Nå åpner vi koden.

Vi undersøker blant annet om agenten har brukt:

- `import` og `export`
- JavaScript modules
- Node eller npm
- Vite
- arrow functions
- `map()`
- `filter()`
- `find()`
- `reduce()`
- `forEach()`
- destructuring
- spread syntax
- `Object.assign()`
- `querySelector()`
- `addEventListener()`
- classes
- annen arkitektur vi ikke bruker

Det kan godt hende at alt dette er gyldig JavaScript.

Problemet er at det ikke nødvendigvis er **vår kodebase**.

Dette er et sentralt poeng:

> **Kode kan fungere og likevel være feil løsning for prosjektet.**

---

# Hvorfor kan fungerende kode være feil?

I Emne 2 arbeider hele teamet innenfor en liten, felles verktøykasse.

Hvis KI plutselig introduserer fem nye JavaScript-teknikker, får vi kode som enkelte på teamet ikke kan lese eller vedlikeholde.

I en bedrift kan akkurat det samme skje.

Et prosjekt kan for eksempel ha bestemte regler for:

- språkversjon
- biblioteker
- arkitektur
- navngivning
- testing
- sikkerhet
- hvordan data hentes
- hvordan feil håndteres

En utvikler skal ikke uten videre introdusere sin egen favorittmåte.

Det gjelder også KI.

---

# Demo 2 – vi gir agenten kodestandarden

Nå gjør vi samme oppgave på nytt.

Agenten får fortsatt:

- `Bestilling.md`
- `model.js`
- `skjermbilder.png`

Men nå får den i tillegg:

- `Om Emne 2-måten å bygge en applikasjon.md`

Dette dokumentet forklarer både:

- arkitekturen vår
- JavaScript-verktøykassen vår
- hvilke konstruksjoner som ikke skal brukes

## Prompt – demo 2

> Les alle vedlagte filer før du begynner.
>
> Implementer applikasjonen fra Demo_Case basert på bestillingen, skjermbildene og den ferdige modellen.
>
> Filen «Om Emne 2-måten å bygge en applikasjon» beskriver kodestandarden for dette prosjektet. Følg den strengt.
>
> Ikke introduser JavaScript-konstruksjoner, verktøy eller arkitektur som dokumentet sier at vi ikke bruker.
>
> Behold den globale modellen som utgangspunkt for løsningen.
>
> Lag nødvendige view-funksjoner og controller-funksjoner og implementer funksjonaliteten som fremgår av skjermbildene.
>
> Lag også relevante QUnit-tester av controller-logikken.
>
> Applikasjonen skal være enkel nok til at studenter på dette nivået kan lese og forklare koden.
>
> Når du er ferdig, gå gjennom løsningen én gang til og kontroller den mot reglene i Emne 2-dokumentet.

Vi sammenligner så resultatet med demo 1.

---

# Hva var forskjellen?

KI-modellen kan være akkurat den samme.

Forskjellen er **konteksten og instruksjonen vi ga den**.

Det illustrerer en av de viktigste ferdighetene ved bruk av coding agents:

> Du må kunne beskrive rammene agenten skal arbeide innenfor.

En god utvikler bruker ikke bare KI til å produsere mest mulig kode.

En god utvikler klarer å styre KI mot riktig løsning.

---

# Referanseappen

I repositoriet ligger også en komplett referanseapp som bruker Emne 2-måten.

Den kan brukes på flere måter.

Dere kan:

- lese den selv
- sammenligne egen kode med den
- vise den til KI som eksempel
- spørre KI hvordan deres løsning skiller seg fra referanseappen

Hvis et skriftlig regelsett ikke er nok, kan eksisterende kode være svært nyttig kontekst.

Du kan for eksempel si:

> Les referanseappen først. Følg samme arkitektur og kodestil når du implementerer min løsning. Ikke kopier domenet eller funksjonaliteten; bruk den bare som kodeeksempel.

Men prøv først å forstå **hvilke prinsipper referanseappen demonstrerer**.

Ikke bare kopier struktur mekanisk.

---

# KI som reviewer av modellen

Agentbruk handler ikke bare om implementasjon.

Når dere har:

- bestillingen
- skjermbildene
- et forslag til modell

kan dere be KI evaluere modellen før dere går videre.

Et godt prompt kan være:

> Les bestillingen, skjermbildene, modellen og «Om Emne 2-måten å bygge en applikasjon».
>
> Ikke endre modellen ennå.
>
> Vurder den kritisk.
>
> Finn spesielt:
>
> - state som ligger på feil sted
> - manglende viewState
> - avledede verdier som unødvendig er lagret
> - dupliserte data
> - objekter som heller bør kobles med ID
> - unødvendig dype datastrukturer
> - data som mangler for å kunne tegne skjermbildene eller gjennomføre brukerhandlingene
>
> Forklar hvert problem og foreslå en forbedring.

Deretter må teamet selv vurdere forslagene.

---

# Ikke be KI endre alt med en gang

En veldig nyttig teknikk er:

> **Analyse først. Endring etterpå.**

I stedet for:

> Fiks modellen.

kan vi først si:

> Gå gjennom modellen. Ikke gjør noen endringer. Fortell oss hva du mener er problemene.

Da får vi anledning til å tenke før agenten begynner å skrive.

Det samme gjelder kode.

Før en stor refaktorering:

> Undersøk problemet og foreslå en plan. Ikke endre filer ennå.

Når planen ser fornuftig ut:

> Gjennomfør planen.

---

# Implementer litt om gangen

Selv om en agent kan skrive hele appen på én gang, betyr ikke det at den bør gjøre det.

En god arbeidsmåte kan være:

1. Ha bestilling, skjermbilder og modell klare.
2. Commit modellen.
3. Be agenten lese materialet og foreslå hvilke view- og controller-funksjoner som trengs.
4. Implementer én side eller én brukerflyt.
5. Kjør appen.
6. Les koden.
7. Test funksjonaliteten.
8. Commit.
9. Gå videre.

Da er det mye enklere å oppdage når agenten beveger seg i feil retning.

---

# Les diffen

Når en agent endrer kode, må vi vite **hva som ble endret**.

Ikke vurder bare sluttresultatet i nettleseren.

Se på:

- hvilke filer som ble laget
- hvilke filer som ble endret
- hva som faktisk ble lagt til og fjernet

Git er spesielt nyttig sammen med KI.

Hvis agenten gjør noe dårlig, skal vi kunne:

- forstå endringen
- korrigere den
- eller gå tilbake

---

# Commit ofte

Et godt mønster er:

> **fungerende liten endring → forstå → commit**

Ikke la KI gjøre en enorm mengde arbeid mellom hver gang teamet tar kontroll.

Dette blir enda viktigere når flere personer arbeider sammen.

---

# KI og teamarbeid

Et team på tre til fem personer trenger ikke at én person gjør alt agentarbeidet.

Dere kan for eksempel:

1. én person arbeider med agenten
2. kontrollerer resultatet
3. committer og pusher
4. neste person puller siste versjon
5. fortsetter fra samme kodebase

Dette gjør også at flere i teamet får erfaring med agentene.

Det er nyttig å prøve mer enn ett verktøy. Ulike agenter og modeller kan løse det samme problemet forskjellig.

---

# Gratis bruk

Mange coding-verktøy har en gratis inngang eller begrenset gratis bruk.

Per oktober 2026 gjelder blant annet:

- **Codex** er tilgjengelig også med ChatGPT Free, med planavhengige bruksgrenser. Codex Cloud krever kvalifisert betalt plan.
- **GitHub Copilot Free** har begrenset chat-/agentbruk og kodefullføring.
- **Cursor Hobby** er gratis og inkluderer begrensede Agent-forespørsler.
- **Google Antigravity Individual** har en gratis plan med agenttilgang og grunnleggende ukentlige grenser.
- **Claude har gratis chat**, men **Claude Code krever en betalt plan**, fra Pro og oppover.

Planer og grenser endrer seg ofte, så sjekk alltid dagens betingelser.

Det er helt fint å prøve flere verktøy.

Poenget er ikke å finne «den eneste riktige agenten».

Poenget er å lære arbeidsformen.

---

# Aktuelle coding agents

Vi demonstrerer først og fremst **ChatGPT Codex**, fordi det er verktøyet læreren bruker mest.

Det finnes flere relevante alternativer.

## ChatGPT Codex

Coding agent fra OpenAI.

Kan arbeide med hele kodeprosjekter, gjøre endringer og hjelpe med blant annet implementasjon, feilretting og review.

## GitHub Copilot

Er tett integrert med GitHub og Visual Studio Code.

For mange er dette det enkleste stedet å begynne dersom man allerede arbeider i VS Code.

GitHub har også en gratis Copilot-plan med begrenset agentbruk.

## Cursor

En kodeeditor bygget med KI-arbeidsflyt som en sentral del av produktet.

Gratis Hobby-plan har begrenset Agent-bruk.

## Google Antigravity

Googles agentmiljø for utvikling.

Det finnes en gratis Individual-plan med grunnleggende grenser.

## Claude Code

Anthropics coding agent.

Claude Code brukes mye av profesjonelle utviklere og kan arbeide fra blant annet terminal, IDE og web. Det er inkludert i betalte Claude-planer, men ikke i gratisplanen.

---

# Ikke bruk mye tid på å velge verktøy

Verktøyene endrer seg raskt.

Agenten som er «best» i dag trenger ikke være best om seks måneder.

Ferdigheten vi vil lære er mer generell:

- gi god kontekst
- beskrive krav
- avgrense oppgaven
- få agenten til å undersøke før den endrer
- lese endringer
- kjøre løsningen
- teste
- kvalitetssikre
- korrigere agenten

Disse ferdighetene kan flyttes mellom verktøy.

---

# KI og QUnit

KI er svært nyttig til å lage unit-tester.

I Emne 2 bruker vi **QUnit**.

Vi tester særlig controller-logikk og hjelpefunksjoner.

Controller-funksjonene våre kaller ofte:

```js
updateView();
```

I en unit-test ønsker vi ikke å tegne HTML.

Da kan testmiljøet ha en tom funksjon:

```js
function updateView() {
}
```

Testen kan deretter:

1. sette opp `model` i en kjent tilstand
2. kalle controller-funksjonen
3. undersøke hvordan modellen har endret seg

---

# Eksempel på KI-prompt for tester

> Lag QUnit-tester for controller-funksjonene i denne filen.
>
> Følg QUnit-stilen som brukes i prosjektet.
>
> Test logikken gjennom endringene i `model`, ikke gjennom DOM.
>
> Hver test skal starte med en kjent modelltilstand.
>
> Controller-funksjonene kan kalle `updateView()`. Bruk en tom `updateView()` i testoppsettet slik at testene ikke trenger DOM.
>
> Bruk bare JavaScript-konstruksjonene som er tillatt i «Om Emne 2-måten å bygge en applikasjon».

Men igjen:

> At KI har skrevet testen betyr ikke at testen nødvendigvis er god.

Les testen.

Forstå hva den faktisk tester.

---

# KI til feilsøking

Når noe ikke virker, ikke skriv bare:

> Det virker ikke. Fiks det.

Gi agenten informasjon.

For eksempel:

> Når jeg klikker «Registrer utlån», skjer det ingenting.
>
> Jeg forventer at et nytt loan-objekt pushes til `model.loans`, at `currentPage` endres og at viewet tegnes på nytt.
>
> Undersøk problemet. Forklar først hva som er feil. Ikke endre kode før du har forklart årsaken.

Dette lærer deg mer og reduserer risikoen for at KI bare prøver tilfeldige endringer.

---

# Be KI forklare sin egen kode

Hvis agenten har laget noe du ikke forstår:

> Forklar denne funksjonen linje for linje med utgangspunkt i det JavaScript-nivået som er beskrevet i Emne 2-dokumentet.

Hvis du fortsatt ikke forstår løsningen, bør du ikke uten videre beholde den.

En mulig neste instruks er:

> Dette er mer komplisert enn vi trenger. Skriv det om med enklere konstruksjoner fra Emne 2-verktøykassen.

---

# KI kan også være kritiker

En nyttig avslutning på en agentøkt er:

> Ikke gjør noen endringer.
>
> Gå gjennom det du nettopp har laget som en kritisk reviewer.
>
> Sammenlign løsningen med:
>
> 1. bestillingen
> 2. skjermbildene
> 3. modellen
> 4. «Om Emne 2-måten å bygge en applikasjon»
>
> List opp konkrete avvik, mangler og mulige feil.

En annen KI-chat kan også gjøre review av agentens arbeid.

Det kan være nyttig fordi den ikke nødvendigvis har de samme antagelsene som agenten som skrev koden.

---

# CSS

Ikke bruk store deler av Emne 2 på CSS.

Målet er først og fremst:

- riktig funksjonalitet
- riktig modell
- forståelig kode
- god dataflyt

Bruk gjerne:

- enkel egen CSS
- semantisk HTML
- eventuelt et enkelt classless CSS-oppsett dersom læreren anbefaler det

KI kan fint lage en liten `style.css`.

Men dersom teamet bruker flere timer på å få en knapp til å se perfekt ut, bruker dere sannsynligvis tiden på feil sted.

---

# Ting KI ikke skal få ta over

KI kan produsere mye.

Men teamet skal fortsatt eie:

## Kundebehovet

Forstår vi hva vi faktisk skal bygge?

## Skjermbildene

Gir brukerflyten mening?

## Modellen

Representerer den problemet på en god måte?

## Arkitekturen

Følger koden måten prosjektet skal bygges på?

## Kvalitetssikringen

Virker funksjonaliteten?

Hva tester vi?

Hva mangler?

## Forståelsen

Kan vi forklare løsningen?

Dette er utviklerarbeid selv om mye av selve tastingen utføres av KI.

---

# Et faresignal

Et veldig enkelt faresignal er:

> «Jeg vet ikke helt hva denne koden gjør, men KI laget den og den virker.»

Da bør dere stoppe.

Bruk KI til å forklare koden.

Forenkle den om nødvendig.

Spør teammedlemmer.

Spør lærer hvis dere fortsatt er usikre.

---

# Et annet faresignal

Dette bør også gjøre dere skeptiske:

> «KI sier at vi bør endre hele arkitekturen.»

Kanskje KI har et godt argument.

Men kanskje den bare foretrekker en annen arkitektur.

I dette emnet har vi valgt en bestemt måte å arbeide på.

En del av oppgaven er nettopp å få KI til å følge den.

---

# En anbefalt arbeidsflyt i resten av Emne 2

Når dere arbeider videre med caseoppgaven:

## 1. Forstå bestillingen

Ha kundedialog.

Oppsummer skriftlig.

## 2. Tegn skjermbilder

Finn brukerflyten.

Avklar spørsmål.

## 3. Lag modellen

Gjør et ordentlig forsøk i teamet.

## 4. Bruk KI til modell-review

Gi KI:

- bestilling
- skjermbilder
- modell
- Emne 2-dokumentet

Be om kritikk.

## 5. Vurder kritikken selv

Ikke endre automatisk fordi KI foreslår noe.

## 6. Be lærer om hjelp der dere fortsatt er usikre

Nå har dere et mye bedre grunnlag for samtalen.

## 7. Commit modellen

Når teamet har landet den.

## 8. Gi agenten konteksten

Bestilling + skjermbilder + modell + Emne 2-regler.

## 9. Få agenten til å planlegge

Gjerne før den gjør store endringer.

## 10. Implementer i små steg

Én side eller brukerflyt om gangen.

## 11. Les og test resultatet

Ikke bare se at nettsiden ser riktig ut.

## 12. Lag QUnit-tester

Bruk gjerne KI, men forstå testene.

## 13. Commit fungerende steg

Og fortsett.

---

# Hva betyr det å være ferdig?

En funksjon er ikke ferdig bare fordi KI har skrevet den.

Spør:

- Virker den?
- Følger den bestillingen?
- Stemmer den med skjermbildene?
- Bruker den modellen riktig?
- Følger den Emne 2-reglene?
- Har vi relevante tester?
- Kan teamet forklare koden?

Hvis svaret er ja, har KI vært et godt utviklingsverktøy.

---

# Kortversjonen

**Bruk KI mye.**

Men:

**Gi den god kontekst.**

**Gi den tydelige rammer.**

**La den ikke bestemme kodestandarden.**

**Les det den gjør.**

**Test det den gjør.**

**Be den kritisere sitt eget arbeid.**

**Spør mennesker når du fortsatt er usikker.**

Og viktigst:

> **KI kan skrive mye av koden. Dere må fortsatt eie forståelsen av løsningen.**