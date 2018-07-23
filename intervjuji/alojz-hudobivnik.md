---
layout: page
title: "Intervju: Alojz Hudobivnik"
featured-img: intervju
summary: Intervju
categories: slo-post
---

# Intervju: Alojz Hudobivnik





**Kakšen je bil vaš začetek v slovenski računalniški idustriji, pri katerem podjetju ste bili zaposleni in kakšna je bila vaša vloga?**

Gimnazijo sem zaključil leta 1978 ter postal štipendist pri Kranjskem Iskra Elektromehanika in se odločil za študij na Fakulteti za elektrotehniko v Ljubljani. Leta 1979 so me po prvem letniku študija poslali na Iskro, kjer sem opravljal prakso. V treh tednih pri Iskri sem se spoznal z bodočimi sodelavci, programsko opremo, ki so jo uporabljali in napisal aplikacijo, ki je iz informacij o javnem prometu pridobila najhitrejšo linijo.

Prakso v drugem letniku sem opravil v Švici. Jeseni 1980 pa so naju s kolegom Rokom Sošićem (danes je doktor na Univerzi Stanford) povabili na delo v Iskro.

Najina prva naloga je bil disassembler. Disassembler je program, ki omogoča programerjem lažji pregled kode, tako da zaporedja ničel in enic pretvori v jezik assembly, ki je bolj prijazen za bralca, katerega zanimajo ukazi, ki se izvajajo v programu. Projekt sva zaključila v začetku čertega letnika. To orodje so uporabljali na Iskra Telematika, kjer je potekala proizvodnja telefonskih central.

Diplomiral sem leta 1983 in se zaposlil v Iskrinem oddelku za razvoj mikroračunalnikov v Kranju.

**Na čem ste delali po zaposlitvi?**

Zvone Duplančič je bil vodja projekta za emulacijo IBM terminala. Pred odhodom v vojsko sem mu pomagal s prikazom informacij na zaslonu. Problem je bil namreč v tem, da so imeli IBM-ovi terminali drugačne zaslone od ostalih terminalov, ki so bili takrat v uporabi.

Ko sem prišel iz vojske leta 1984 so me poslali na tečaj operacijskega sistema Unix v London. Med mojo odsotnostjo so trije kolegi že naredili nekaj strojne opreme za Motorolin 68000 procesor, nakar so odpotovali za 3 mesece v Ameriko na izobraževanje.

Leta 1984 in 1985 smo delali z Unix operacijskim sistemom. Ekipa se je v tem času zanimala predvsem za pisanje gonilnikov za Linux.

**Vaša magistrska naloga je bila povezana z računalnikom Triglav, kako ste bili povezani z razvojem tega računalnika?**

Moj prvi projekt v zvezi s Triglavom je bil komercialen. Leta 1985 so v sosednjem oddelku delali na grafični kartici za Triglav, ki je bil že barvni računalnik. Naša naloga je bila priskrbeti programe, ki bi pokazali zmogljivosti Triglava na sejmih. Analizirali smo nemški teletekst ter naredili svojo izvedbo, ki se je uporabila na Triglavu. Za prikaz smo uporabili zmogljivosti grafične kartice.

Leta 1986 pa smo imeli že kar precej izkušenj in lotili smo se razvoja SCSI kontrolerja. SCSI standard se je pojavil istega leta in je predstavljal nov način dostopa procesorja do več diskov. Izpeljanke tega standarda se uporabljajo še danes. Zaradi hitrejšega dostopa, branja in pisanja na disk smo sodelovali z Iskro Telematiko, ki so se za naš projekt zanimali zaradi ogromnih količin podatkov, s katerimi delajo telefonske centrale.

Zvone Duplančič, Matej Kranjec in jaz smo delali na programski opremi za SCSI kontroler. Sodelovali smo z drugo ekipo, ki je bila zadolžena za strojno opremo. Strojno opremo so sestavljali po zahtevah programerske ekipe in razvili so koncept pametnega SCSI kontrolerja. Razvoj je potekal 2 leti. Leta 1988 je nastal večji del moje magistrske naloge, ki bolj natančno opisuje naš projekt.

**Nam lahko poveste še kaj o pametnem SCSI kontrolerju?**

Sprva smo ga nameravali programirati v programskem jeziku C a smo ugotovili da je koda napisana v assembly dvakrat hitrejša. Po mojem predlogu smo se odločili za izvedbo kontrolerja, ki bi omogočala ne le komuniciranje z več diski ampak bi lahko do podatkov dostopalo tudi več procesorjev prek istega kontrolerja. Takrat smo delali z za eno generacijo boljšimi komponentami kot ostale ekipe, ki so delale Triglav. Jaz sem bil odgovoren za pravilno razporejanje procesov po prioriteti. Zvone Duplančič je iz Iskra Telematika priskrbel RTOS s pomočjo katerega smo realizirali programski del kontrolerja. Predvidevali smo, da bo naš izdelek lahko komuniciral z osmimi različnimi procesorji. Preko SCSI krmilnika smo z uporabo predpomnilnika in razporejanjem ukazov za branje dobili 4 ms povprečnega dostopnega časa. Načrtovali smo tudi RAID1 in RAID5, ampak to ni uspelo.

V tistem času so imeli računalniki Partnerji 20MB diske, mi pa smo našo opremo testirali na 400MB diski. Naš kontroler smo pripravili na delo z vsemi tremi konfiguracijami triglava. Računalnik Triglav je lahko imel namreč tri različne procesorje, kontroler je moral delovati z vsemi. Procesorji so z drugimi napravami komunicirali preko VME vodila. Čeprav je bilo VME vodilo namenjeno za Motorolin procesor, so bili procesorji in vodilo prilagojeni, da so delovali skupaj. Možno je bilo tudi posodabljanje programske opreme med delovanjem računalnika.

Zanimivo vam bo še to, na Triglavih se je na delovanje nove verzije programske opreme čakalo dve uri. Računalnik podjetja Sun Workstations pa je omogočal pregled nove verzije že po 20 minutah. Ker je bil v Jugoslavijo prepovedan uvoz teh naprav smo se na delo vozili v Celovec, kjer smo imeli na voljo te naprave in tako smo prihranili čas.

Izdelek se je stabiliziral z Unix operacijskim sistemom na procesorju Motorola 68020. Žal se je kmalu v letu 1989 začel zaton podjetja in s tem se je razvoj in proizvodnja končala.

**Ali se je ohranilo kaj strojne ali programske opreme po zaključku, ko je bilo jasno da ne bo prišlo do proizvodnje?**

Namen je bil tak. Programsko opremo smo shranili na diske in popisali kaj vse imamo, da bi lahko komu prišlo prav. Kasneje sem izvedel da so bili po stečaju diski prodani, vsebina pa je bila izgubljena saj so jih formatirali.

**Vaši ekipi sta razvijali nekaj novega. So bile izkušnje dovolj ali ste se morali še dodatno izobraževati?**

Iskra Delta je v tem času organizirala poletna šolanja. Ravno v času, ko smo začeli z razvojem SCSI kontrolerja, je potekalo šolanje v Dubrovniku. Šlo je za predavanja na katera so bili povabljeni profesorji Jugoslovanskega porekla iz Amerike. Zame je bilo najbolj koristno predavanje profesorja Miloša D. Ercegovaca iz Univerze v Kaliforniji. Profesor je predaval o arhitekturi takrat najnovejših superačunalnikov. Ekipa se je spoznala s koncepti porazdeljenega računalništva in se odločila, da bo ideje, ki se uporabljajo v superračunalnikih implementirala v mikroračunalnike. Kot sem omenil že prej so nas pošiljali na izobraževanja tudi v ekipah in posamezno, nakar smo udeleženci izobraževanj delili znanje z drugimi zaposlenimi. V Novi Gorici smo organizirali tudi izobraževanja za kupce naših izdelkov.

**Kaj se je dogajalo z vašo ekipo in vami ob zatonu Iskre Delte?**

Direktor razvoja na komunikacijskem oddelku nam je razložil okoliščine in začeli smo iskati možne rešitve. Ekipa za strojno opremo je naredila skice za masovno proizvodnjo in tudi na sejmih smo navduševali.

V Kranju nas je vodil Marko Rogač pri proizvodnji Triglav Motorola linije. Iskali smo podjetja, ki bi lahko odkupila naš oddelek. Šlo je za 60 ljudi, polovica je delala na aplikacijah, ostali pa smo delali na grafični kartici, SCSI kartici ter strojni opremi.

Žal se nam ni uspelo dogovoriti z nobenim podjetjem za odkup celotnega oddelka. Iskratel je zaposlil 20 članov, ostali so naprej iskali zaposlitev.

Zvone Duplančič je ustvaril podjetje preko katerega smo na laserskih tiskalnikih podjetja Oki omogočali tiskanje šumnikov. Kasneje se je to podjetje ukvarjalo tudi s tiskanjem črtnih kod ter enostavnih grafik. Pred mojim odhodom v Iskratel sem z njimi sodeloval. Danes je to podjetje znano kot NiceLabel.

Kasneje sem šel tudi v Nemčijo, kjer sem delal na Siemens-ovih programih.

**Kakšen je vaš pogled na Iskro sedaj? Kje jo vidite v primerjavi z ostalimi podjetji po svetu?**

Če primerjam Iskro z podjetji Billa Gatesa in Steva Jobsa bi rekel da smo bili z razvojem le eden ali dva meseca za njimi. Naši najboljši ljudje so bili na enakem nivoju kot tisti drugje po svetu. Le kot primer bi dal študenta, ki je na Japonskem študiral paralelne računalnike. Ob njegovi vrnitvi smo ga oblili z vprašanji saj smo imeli dovolj praktične podlage, da smo lahko vse novo znanje takoj aplicirali.

Tudi z omrežji smo se veliko ukvarjali. Povezovali smo računalnike na različnih lokacijah. Tako je prišlo tudi do demonstrazije za Jugoslovansko vojsko, kjer smo Ljubljano, Banjaluko in Vrhniko povezali ter vojski pokazali grafično karto, ki je v realnem času prikazovala situacijo na terenu. Na tem področju je znano tudi to da smo na Kitajsko prodali celotno omrežje.

**Iskra je sodelovala tudi na raznih športnih prireditvah, nam lahko poveste kaj več o tem?**

V Kranju se je z obdelavo športnih prireditev ukvarjal Božo Oman, še ena ekipa je delala v Ljubljani. Šlo je za prikazovanje štartnih mest, rezultatov in podobnega na zaslonih med potekom prireditev za televizijo. To storitev so potrebovali vsi in tudi sam sem se v prvih nekaj letih dela pri Iskri pridružil ekipam, ki so šle na lokacije prireditev urejati prenos. Delali smo v Planici in Kranjski Gori, univerzijadi na Češki ter Balkanijadi v Ljubljani. Leta 1989 sem bil prisoten tudi na Bledu kjer je potekalo temovanje v veslanju za veterane.
