export interface QuizOption {
	letter: string;
	text: string;
}

export interface ContentVariant {
	previousChoice: string;
	content: string;
}

export interface Chapter {
	day: number;
	title: string;
	content?: string;
	variants?: ContentVariant[];
	quiz: {
		question: string;
		options?: QuizOption[];
		note?: string;
	};
}

export function getChapterContent(chapter: Chapter, previousChoices: Record<number, string>): string {
	if (!chapter.variants || chapter.variants.length === 0) {
		return chapter.content || '';
	}
	const previousDayChoice = previousChoices[chapter.day - 1];
	const variant = chapter.variants.find(v => v.previousChoice === previousDayChoice);
	return variant?.content || chapter.variants[0].content || chapter.content || '';
}

export const chapters: Chapter[] = [
	{
		day: 1,
		title: "Den tomme stolen",
		content: `Første dag i ny jobb.
		Kontoret lukter kaffe og forventning.
		Julelysene i vinduene blinker varmt. Det er koselig her: planter, kaffemaskin, latter fra lunsjrommet.
		
		Du får pulten ved vinduet. Fin utsikt. Men stolen ved siden av er tom. 
		På pulten står en kaffekopp. Fortsatt lunken.

		«Hvem sitter her?» spør du sidemannen.
		Han ser knapt opp fra skjermen. «Max. Han er sikkert bare ute en tur.»
		Du trekker på skuldrene.
		
		Men Max kommer ikke tilbake. Ikke i dag.
		På vei ut ser du julelysene blinke i vinduet. Så koselig. Så normalt. 
		Men den tomme stolen ved pulten din forteller kanskje en annen historie.`,
		quiz: {
			question: "Hva tenker du?",
			options: [
				{ letter: "A", text: "Kanskje han er syk – stakkars fyr" },
				{ letter: "B", text: "Rart at ingen nevnte at han var borte" },
				{ letter: "C", text: "Ikke mitt problem – fokus på egen jobb" }
			]
		}
	},
	{
		day: 2,
		title: "Lappen",
		variants: [
			{
				previousChoice: "A",
				content: `Du håper Max er bedre i dag.
				Men stolen er fortsatt tom. Kaffekoppen står der ennå.
				
				«Skal jeg kaste den?» spør du Irina.
				Hun ser nesten skremt ut. 

				«Nei! Ikke rør Max sine ting.»
				«Men den har stått der siden i går?»
				«Han liker det sånn.»
				Merkelig. Men greit. Du har nok å tenke på som nyansatt.
				
				På pulten din ligger en gul lapp: 
				**«Velkommen! Håper du trives. – M.»**
				Max virker hyggelig. Du gleder deg til å møte ham.`
			},
			{
				previousChoice: "B",
				content: `Det var rart at ingen nevnte Max i går.
				I dag spør du daglig leder: «Når kommer Max tilbake?»
				Han ser nesten skremt ut.
				«Max? Ja, han er på noen prosjekter.»
				«Hvilke prosjekter?»
				«Store. Viktige.» Han ser på klokken. 
				«Nå må jeg i møte.»
				Kanskje det er konfidensielt?
				
				På pulten din ligger en lapp: 
				**«Velkommen! – M.»**
				I det minste er Max hyggelig nok til å ønske deg velkommen.`
			},
			{
				previousChoice: "C",
				content: `Du fokuserte på jobben i går. Lurt.
				Men i dag er du nysgjerrig. Kaffekoppen står der fortsatt.
				
				«Drikker Max alltid kald kaffe?» spør du.
				Kollegaen ser forvirret ut. 
				«Hæ? Nei, tror han liker det ferskt.»
				Men koppen er fortsatt den samme. 
				Du så den i går.
				
				På pulten ligger en lapp: 
				**«Velkommen! – M.»**
				Hyggelig gest fra Max. Kanskje du dømte for fort.`
			}
		],
		quiz: {
			question: "Du vil gjerne møte Max. Hva gjør du?",
			options: [
				{ letter: "A", text: "Spør når han vanligvis er på kontoret" },
				{ letter: "B", text: "Sender ham en hyggelig melding på Teams" },
				{ letter: "C", text: "Venter tålmodig: han dukker sikkert opp" }
			]
		}
	},
	{
		day: 3,
		title: "Teams meldingen",
		variants: [
			{
				previousChoice: "A",
				content: `«Når er Max vanligvis her?»
				Irina tenker. 
				«Han kommer og går. Vanskelig å si.»
				«Jobber han deltid?»
				«Nei, nei. Fulltid. Bare fleksibelt.»
				
				Du prøver Teams. Finner profilen hans. 
				Ingen bilde. Ingen kontaktinformasjon.
				Du sender: *«Hei Max! Ny kollega her. Hadde vært hyggelig å hilse!»*
				Svar kommer med én gang: *«Hei! Opptatt nå. Snakkes!»*
				
				Raskt svar! Han virker travel, men vennlig. Du smiler.`
			},
			{
				previousChoice: "B",
				content: `Du sender melding på Teams: 
				*«Hei Max! Jeg er ny her. Gleder meg til å møte deg!»*
				Svar med én gang: 
				*«Hei! Opptatt nå. Snakkes!»*
				Kort svar. Han må være midt i noe viktig.
				
				Du sjekker profilen hans. 
				Ingenting, bortsett fra tittel: «Koordinator».

				Koordinator av hva? Du spør Irina. «Åh, Max koordinerer det meste, egentlig.»
				Han må være viktig her.`
			},
			{
				previousChoice: "C",
				content: `Du ventet tålmodig. Men nysgjerrigheten vinner.
				Teams profilen hans sier «Koordinator». 
				Ingenting mer, verken bilde eller kontaktinformasjon.

				Du sender: *«Hei! Håper vi kan ta en kaffe snart!»*
				Svar: *«Hei! Opptatt nå. Snakkes!»*
				Kjapt svar. Han må ha mye å gjøre. 
				Men i det minste svarte han.`
			}
		],
		quiz: {
			question: "Max virker travel. Hva gjør du?",
			options: [
				{ letter: "A", text: "Respekterer at han er opptatt" },
				{ letter: "B", text: "Spør kollegaer om hva Max jobber med" },
				{ letter: "C", text: "Sender en oppfølgingsmelding" }
			]
		}
	},
	{
		day: 4,
		title: "Alle snakker om Max",
		variants: [
			{
				previousChoice: "A",
				content: `Du respekterer at Max er opptatt.

				Men på fellesmøtet sier daglig leder: 
				«Det tar Max seg av.»
				HR-leder nikker: 
				«Ja, Max har kontroll.»
				Irina hvisker til deg: «Max er vår go-to-person. 
				Han gjør alt som ingen andre gjør.»
				Du er imponert og litt bekymret for alt det han gjør.
				
				Etter møtet sjekker du kalenderen hans. 
				Ingen møter synlige. Kanskje han jobber hjemmefra?
				Du sender en ny melding: *«Håper alt er bra med deg!»*
				Samme svar: *«Hei! Opptatt nå. Snakkes!»*
				
				Hvordan har han så mye ansvar, men er likevel så usynlig?
				Samtidig er du også litt bekymret for alt det han gjør.`
			},
			{
				previousChoice: "B",
				content: `Du spør rundt: «Hva jobber Max med egentlig?»

				«Alt mulig.»
				«Koordinering.»
				«De vanskelige tingene.»
				«Det ingen andre vil ta.»
				Du er imponert og litt bekymret for alt det han gjør.
				
				Alle har et svar, men ingen er konkrete.
				Harald, den eldste, sier: «Max er limet i denne organisasjonen.»
				«Har du jobbet mye med ham?»
				Harald tenker. 
				«Ikke direkte. Men jeg vet han er viktig.»
				
				Interessant. Hvordan har han så mye ansvar, men er likevel så usynlig?
				Samtidig er du også litt bekymret for alt det han gjør.`
			},
			{
				previousChoice: "C",
				content: `Du sender oppfølging: 
				*«Bare lurer på når du er ledig for en prat?»*
				Svar: *«Hei! Opptatt nå. Snakkes!»*
				
				Samme melding. Ord for ord.
				Merkelig. Men noen liker å være konsise.

				På fellesmøtet hører du de andre si: 
				«Max tar det.» «Max fikser.» «Spør Max.»

				Interessant. Hvordan har han så mye ansvar, men er likevel så usynlig?
				Samtidig er du også litt bekymret for alt det han gjør.`
			}
		],
		quiz: {
			question: "Max virker å ha mye ansvar. Hva tenker du?",
			options: [
				{ letter: "A", text: "Imponerende – han må være dyktig" },
				{ letter: "B", text: "Bekymrende – høres ut som mye for én person" },
				{ letter: "C", text: "Litt rart at han aldri er her" }
			]
		}
	},
	{
		day: 5,
		title: "Mappen til Max vokser",
		variants: [
			{
				previousChoice: "A",
				content: `Max må virkelig være dyktig.
				Men i dag ser du noe rart: 
				En prosjektmappe merket **«MAX – HASTER»**.
				Inni: 47 oppgaver. Ingen avkrysset.
				47 oppgaver som haster? For én person?
				
				Du spør Irina: «Trenger Max hjelp?»
				Hun ler. 
				«Max? Han klarer seg alltid.»
				Men 47 oppgaver? Du føler sympati. 
				Kanskje han er overarbeidet. Kanskje han har blitt syk av stress?
				
				Du bestemmer deg for å holde et øye med situasjonen.`
			},
			{
				previousChoice: "B",
				content: `Du er bekymret for Max.
				Mappen på pulten hans har vokst. 
				**«TING MAX MÅ GJØRE»** – tykk som en murstein.
				
				«Er det sunt?» spør du daglig leder.
				«Hva mener du?»
				«All den arbeidsmengden. På én person.»
				Daglig leder ser forvirret ut. 
				«Max håndterer det. Som alltid.»
				Men gjør han det? Stolen er tom. Koppen er kald. 
				Mappen vokser.
				
				Du begynner å lure på om Max har fått et sammenbrudd.`
			},
			{
				previousChoice: "C",
				content: `Det er litt rart at Max aldri er her.

				Du begynner å legge merke til ting:
				Stolen hans har støv på armlenene. 
				Kalenderen har ingen faktiske avtaler. 
				Mappen hans vokser, men ingen ser ham jobbe.

				Kanskje Max er syk? Virkelig syk?
				Eller kanskje han har sluttet, og ingen har fortalt deg det?

				Du holder øynene åpne.`
			}
		],
		quiz: {
			question: "Du vil finne ut mer. Hvordan?",
			options: [
				{ letter: "A", text: "Ser på gamle prosjekter Max har levert" },
				{ letter: "B", text: "Spør HR om Max sin situasjon" },
				{ letter: "C", text: "Leter diskret rundt på pulten hans" }
			]
		}
	},
	{
		day: 6,
		title: "Har noe skjedd med Max?",
		variants: [
			{
				previousChoice: "A",
				content: `Du ser på gamle prosjekter.
				«Koordinert av Max M.» – men ingen detaljer.
				«Ansvarlig: Max» – men ingen signatur.
				«Levert av Max-teamet» – teamet har ingen andre medlemmer listet.
				
				Alt peker på Max. Men ingenting direkte fra ham.
				I en gammel rapport finner du et notat: **«Venter på input fra Max.»**
				Datert for ett år siden.
				
				Du får en urolig følelse. Har noe skjedd med Max som ingen vil snakke om?`
			},
			{
				previousChoice: "B",
				content: `HR er unnvikende.
				«Max sin situasjon? Hva mener du?»
				«Arbeidsmengden. Fraværet. Er han ok?»
				HR-leder kremter. «Max er en komplisert sak.»
				«Komplisert hvordan? Er han syk?» 
				Pause. 
				
				«Det er personalsak. Jeg kan ikke si mer.»
				Personalsak. Det ordet henger i luften.
				
				Har Max gjort noe galt? Er han sparket? Du går med flere spørsmål enn svar.`
			},
			{
				previousChoice: "C",
				content: `Du leter diskret på pulten hans.
				Støv. Masse støv.
				I skuffen: gamle penner, binders, og en lapp.
				**«Noen må ta ansvar. Hvis ikke jeg, hvem?»**
				
				Ordene treffer deg. Stakkars Max. 
				Du føler et stikk i hjertet. Kanskje Max ble utbrent? Kanskje han ba om hjelp og ingen lyttet?
				
				Du må finne ut hva som skjedde med ham.`
			}
		],
		quiz: {
			question: "Du føler at noe er galt. Hva gjør du?",
			options: [
				{ letter: "A", text: "Konfronterer daglig leder om Max" },
				{ letter: "B", text: "Snakker med kollegaer om bekymringen" },
				{ letter: "C", text: "Graver dypere i arkivene" }
			]
		}
	},
	{
		day: 7,
		title: "Noe stemmer ikke",
		variants: [
			{
				previousChoice: "A",
				content: `Du konfronterer daglig leder.
				«Jeg er bekymret for Max. Hvor er han egentlig?»
				Daglig leder sukker. «Max er tilgjengelig. På sin måte.»
				«Jeg har ikke sett ham én gang.»
				«Han er diskret. Jobber best alene.»
				«Men stolen hans er tom. Koppen er kald. Mappene hoper seg opp.»
				
				Daglig leder ser deg i øynene. «Noen ting er best å ikke grave i.»
				Du fryser. Er dette en trussel? Eller en advarsel?
				
				Du spør deg selv: Hva har skjedd med Max som er så alvorlig at daglig leder ikke vil snakke om det?`
			},
			{
				previousChoice: "B",
				content: `Du snakker med kollegaene.
				«Er jeg den eneste som aldri har sett Max?»
				Stille. 
				
				Så, sakte:
				«Jeg har heller ikke sett ham på lenge.» – Harald
				«Han pleide å være her mer før.» – Irina
				«Jeg tror jeg så ham på julebordet for noen år siden?» – Kenneth
				
				Alle er usikre. Men alle snakker om ham som om han eksisterer.
				«Tror dere han er ok?» spør du.
				Ingen svarer. Ubehaget sprer seg i rommet.`
			},
			{
				previousChoice: "C",
				content: `Arkivene avslører mer.
				Prosjekt etter prosjekt: «Max tar det.» «Send til Max.» «Max koordinerer.»
				Men ingen e-poster fra Max. Ingen rapporter signert av Max. Ingen møtereferater med Max som deltaker.
				
				Du finner et dokument fra noen år siden: **«Ansvarsfordeling»**
				Under «Diverse/ukategorisert» står det: **Max M.**
				Alle de vanskelige tingene. Dyttet på én person.

				Du spør deg selv: Ble Max overveldet? Ble han presset ut?`
			}
		],
		quiz: {
			question: "Mysteriet vokser. Hva føler du?",
			options: [
				{ letter: "A", text: "Frustrert – hvorfor er alle så unnvikende?" },
				{ letter: "B", text: "Bekymret – hva om Max er i trøbbel?" },
				{ letter: "C", text: "Mistenksom – noe dekkes til her" }
			]
		}
	},
	{
		day: 8,
		title: "Julepynt og hemmeligheter",
		variants: [
			{
				previousChoice: "A",
				content: `Du er frustrert. Alle holder tilbake.
				Men juletradisjoner er hellige. I dag skal treet pyntes. Julelysene henges opp. Kontoret skal skinne.
				
				I boden finner du en eske: **«MAX M. – JUL»**
				Inni: vakre kuler, slitte nisser, og hjemmelagde stjerner.
				En lapp: **«Til det beste kontoret. – M.»**
				Max donerte dette. 
				
				Du henger opp lysene hans i vinduet. De blinker varmt.
				Men du føler et stikk: Bak alle julelysene og koselighetene – hvor er personen som ga dette? Hva skjuler de bak fasaden?`
			},
			{
				previousChoice: "B",
				content: `Du er bekymret for Max.
				Men i dag er skal det pyntes til jul. Du vil delta, passe inn.
				
				I boden: **«MAX M. – JUL»**
				En eske full av gamle, kjære ting. Og lapper:
				**«God jul til alle fra Max!»**
				**«Håper dere liker nissene»**
				
				Hvor er denne snille personen nå? Hvorfor snakker ingen om ham?
				Du kjenner en klump i halsen.`
			},
			{
				previousChoice: "C",
				content: `Noe dekkes til. Du er sikker.
				Men først: julepynt. Du er ny, vil ikke virke paranoid.
				
				Esken merket **«MAX M.»** inneholder overraskelser.
				Håndlagde ting. Personlige notater.
				Max var her. Virkelig her. 
				
				Men når forsvant han? Og hvorfor later alle som om alt er normalt?`
			}
		],
		quiz: {
			question: "Hva gjør du med Max sin julepynt?",
			options: [
				{ letter: "A", text: "Henger den opp med respekt" },
				{ letter: "B", text: "Spør om historien bak den" },
				{ letter: "C", text: "Leter etter flere spor i esken" }
			]
		}
	},
	{
		day: 9,
		title: "Hvor er Max?",
		variants: [
			{
				previousChoice: "A",
				content: `Du henger opp Max sin pynt med respekt.
				«Den stjernen laget han i 2022,» sier Harald plutselig.
				«Du husker det?»
				«Jeg tror jeg husker det. Han var så stolt av den.»
				«Hvordan var han? Max?»
				Harald tenker lenge. 
				
				«Snill. Hjelpsom. Tok alltid på seg ekstra.»
				«Så hva skjedde?»
				Harald ser bort. «Folk tok ham for gitt. Så en dag var han bare borte.»

				Borte. Hjertet ditt synker.`
			},
			{
				previousChoice: "B",
				content: `«Hva er historien bak Max sin julepynt?»
				Stille først. 
				
				Så kommer det:
				«Han ble sent på kontoret i 2020 og lagde alt selv.»
				«Nei, det var 2021.»
				«Jeg hørte det var før jeg begynte i 2023.»
				
				Alle husker forskjellige ting. Ingen husker det samme.
				Men alle er enige om én ting: Max brydde seg. Virkelig.
				
				«Hvor er han nå?» spør du.
				Ingen svarer. Folk ser bort.`
			},
			{
				previousChoice: "C",
				content: `Du leter i esken etter spor.
				Under nissene: bilder. Gamle, falmede.
				Kontorjulebord 2022. Masse folk. Men hvem er Max?
				
				Du studerer ansiktene. Spør: «Hvem av disse er Max?»
				Folk ser. Peker forskjellige steder.
				«Der!» «Nei, der!» «Var han ikke den med skjegget?»

				Ingen er enige. Merkelig. Veldig merkelig.
				Kanskje Max ikke ville bli fotografert? Kanskje han holdt seg unna med vilje? Men hvor er han nå?`
			}
		],
		quiz: {
			question: "Ingen husker Max tydelig. Hva betyr det?",
			options: [
				{ letter: "A", text: "Han var beskjeden – holdt lav profil" },
				{ letter: "B", text: "Noe traumatisk skjedde som folk fortrenger" },
				{ letter: "C", text: "Folk vil ikke snakke om ham av en grunn" }
			]
		}
	},
	{
		day: 10,
		title: "Kenneth fra IT",
		variants: [
			{
				previousChoice: "A",
				content: `Max var nok bare beskjeden. Det forklarer mye.

				Men Kenneth fra IT sier noe merkelig:
				«Jeg skulle fikse Max sin PC i dag. Men den har ikke vært pålogget på veldig lenge.»**
				«Hvor lenge?»
				«Systemet viser ingen aktivitet på flere måneder.»

				Du fryser. «Så han har ikke brukt PCen på et halvt år?»
				«Det ser sånn ut.»

				Men han svarer på Teams! Han jobber! Eller gjør han det?
				Kanskje han jobber hjemmefra? Med privat PC? Du klamrer deg til håpet.`
			},
			{
				previousChoice: "B",
				content: `Noe traumatisk skjedde. Du er sikker nå.
				Du ber Kenneth fra IT sjekke Max sin bruker.

				«Merkelig,» sier han. «Kontoen eksisterer, men aktiviteten er lav.»
				«Lav?»
				«Nesten ingen innlogging det siste halvåret. Bare noen automatiske synkroniseringer.»
				«Men jeg fikk svar på Teams!»
				Kenneth rynker pannen. «La meg sjekke det.»

				Han klikker rundt. «Det der er en automatisk svarmelding. Satt opp for lenge siden.»
				Automatisk? Men det betyr at Max bevisst satte opp systemet før han forsvant.`
			},
			{
				previousChoice: "C",
				content: `Folk vil ikke snakke om Max av en grunn.
				Du går til Kenneth i IT. «Jeg trenger hjelp med noe.»
				Han lytter mens du forklarer.
				
				«La meg se.» Han klikker. «Max sin konto er aktiv, men bruken er minimal.»
				«Hva betyr det?»
				«Noen logger inn av og til. Men ingen faktisk aktivitet. Ingen filer åpnet.»
				«Hvem logger inn da?»
				Kenneth tenker seg godt om. 

				«Godt spørsmål. Vil du at jeg skal sjekke?»
				Du nikker. Puslespillet blir mer komplisert.`
			}
		],
		quiz: {
			question: "Max sin digitale aktivitet er minimal. Hva tenker du?",
			options: [
				{ letter: "A", text: "Han jobber kanskje utenfor systemet" },
				{ letter: "B", text: "Noe alvorlig må ha skjedd med ham" },
				{ letter: "C", text: "Noen dekker over hans fravær" }
			]
		}
	},
	{
		day: 11,
		title: "Samle bevis",
		variants: [
			{
				previousChoice: "A",
				content: `Kanskje Max jobber utenfor systemet. Noen gjør det.
				Men teorien holder ikke vann.
				
				Du finner en e-post fra daglig leder til hele teamet, sendt for tre måneder siden:
				**«Max tar seg av Q4-rapporten.»**
				Men Q4-rapporten ble aldri levert.
				Så enten har Max sviktet totalt, eller så er han ikke i stand til å jobbe.

				En ny tanke slår deg: Hva om Max er alvorlig syk? Kanskje på sykehus?
				Det ville forklare hvorfor Max ikke er tilgjengelig og at de andre er så avvikende.`
			},
			{
				previousChoice: "B",
				content: `Noe alvorlig har skjedd med Max. Du er overbevist.
				
				Du lager en tidslinje:
				For seks og fem år siden: Max nevnes ofte i møtereferater.
				For fire og tre år siden: Færre direkte referanser, men navnet brukes fortsatt.
				Mens de siste årene: Ingen konkret aktivitet, bare «Max tar det».
				
				Det er som om Max gradvis ble til et ekko av seg selv.
				Hadde han et sammenbrudd? Ble han presset ut gradvis? Skjedde det en ulykke?
				
				Du må finne ut sannheten. For Max sin skyld.`
			},
			{
				previousChoice: "C",
				content: `Noen dekker over fraværet. Men hvem? Og hvorfor?
				Du graver mer. I en gammel e-posttråd finner du noe interessant.
				
				Daglig leder skrev: **«Vi må holde Max-situasjonen intern.»**
				Situasjonen. Hva slags situasjon?
				En annen kollega svarte: **«Enig. Færre spørsmål, bedre.»**
				De visste. De vet fortsatt.
				
				Men hva er det de skjuler? Er Max i live? Har han gjort noe kriminelt? Er bedriften involvert i noe?
				Du er urolig. Hodet spinner.`
			}
		],
		quiz: {
			question: "Du tror du nærmer deg sannheten. Hva gjør du?",
			options: [
				{ letter: "A", text: "Konfronterer daglig leder igjen, denne gangen hardere" },
				{ letter: "B", text: "Allierer deg med noen du stoler på" },
				{ letter: "C", text: "Samler enda mer bevis før du handler" }
			]
		}
	},
	{
		day: 12,
		title: "Letingen etter Max fortsetter",
		variants: [
			{
				previousChoice: "A",
				content: `Du konfronterer daglig leder igjen.
				«Jeg vet at Max-situasjonen holdes skjult. Jeg har sett e-postene.»
				Daglig leder blir blek og nervøs. 
				
				«Du har vært i arkivene?»
				«Jeg vil bare vite at Max har det bra.»
				Lang pause. 
				
				Daglig leder gnir seg i ansiktet.
				«Max er komplisert. Det er alt jeg kan si.»
				«Er han syk? Død? Sparket?»
				«Nei. Ingenting sånt. Det er bare komplisert.»
				
				Komplisert. Det ordet igjen. Hva betyr det?`
			},
			{
				previousChoice: "B",
				content: `Du allierer deg med Irina. Hun virker oppriktig.
				«Jeg tror noe er galt med Max,» sier du.
				Hun ser seg rundt. «Ikke her. Møt meg etter jobb.»
				
				På kafeen forteller hun:
				«Max var en legende her. Alltid først på jobb, sist hjem. Tok på seg alt.»
				«Så hva skjedde?»
				Irina tenker seg godt om.
				
				«Jeg vet ikke. En dag sluttet folk å snakke om ham som person. Han ble bare et navn folk brukte.»
				«Et navn?»
				«Ja. Når noe var vanskelig, sa alle bare Max tar det. Men ingen så ham lenger.
				Irina ser bekymret ut.`
			},
			{
				previousChoice: "C",
				content: `Du samler mer bevis.
				I HR sin arkivboks finner du en mappe: **«Personalsaker – Spesielle»**

				Du blar. A, B, C. Der: **Max M.**
				Mappen er tynn. Inni er det bare ett ark:
				**«Max M. – Status: Snakk med ledelsen.»**
				Ingen personnummer. Ingen adresse. Ingen pårørende listet.

				Det er som om Max aldri var en fullstendig person i systemet.
				Merkelig. Veldig merkelig.

				Kanskje Max var innleid? Konsulent? Noen som ikke er i de vanlige systemene?`
			}
		],
		quiz: {
			question: "Mysteriet blir dypere. Hvordan føles det?",
			options: [
				{ letter: "A", text: "Besatt – du må finne sannheten" },
				{ letter: "B", text: "Bekymret – hva om du graver for dypt?" },
				{ letter: "C", text: "Frustrert – ingen gir deg rette svar" }
			]
		}
	},
	{
		day: 13,
		title: "Når forvant Max?",
		variants: [
			{
				previousChoice: "A",
				content: `Du er besatt. Må vite.
				Harald har vært her i 15 år. Han må vite noe.

				«Harald, jeg trenger ærlige svar om Max.»
				Han sukker tungt. «Du gir deg ikke, gjør du?»
				«Nei.»
				Harald bruker lang tid på å huske Max.

				«Max var den snilleste personen jeg kjente. For snill. Tok på seg alt.»
				«Hva skjedde med ham?»
				«Jeg vet ikke. Men på et tidspunkt sluttet jeg å se ham. Bare høre om ham.»
				«Når?»
				«Det er det som er rart. Jeg klarer ikke huske nøyaktig. Det bare skjedde gradvis.»`
			},
			{
				previousChoice: "B",
				content: `Du er litt bekymret. Kanskje du graver for dypt.
				Men du fortsetter. 
				
				En av renholderne, Maria, har jobbet her i 10 år.
				«Husker du Max?» spør du.
				Hun nikker. «Hyggelig mann. Jobbet alltid sent.»
				«Når så du ham sist?»
				Hun tenker. 
				
				«Det er lenge siden. Kanskje noen år?»
				Noen år. Men alle snakker om ham som om han var her i går.`
			},
			{
				previousChoice: "C",
				content: `Frustrasjonen driver deg videre.
				Du finner Kenneth igjen. 
				«Kan du grave mer i Max sin konto?»
				Han nøler. 
				
				«Det er egentlig ikke lov.»
				«Jeg tror noe er galt. Virkelig galt.»
				Han ser på deg lenge. Så nikker han.

				Etter en time: «Ok, dette er rart.»
				«Hva?» spør du.
				«Kontoen ble opprettet i 2019. Men det er ingen ansettelsesdato knyttet til den.»
				«Hva betyr det?»
				«At Max aldri formelt ble ansatt. I systemet er han bare et navn.»
				Du er urolig. Hjertet ditt hamrer. Hva har du avdekket?`
			}
		],
		quiz: {
			question: "Sannheten virker nær. Hva tenker du nå?",
			options: [
				{ letter: "A", text: "Kanskje Max jobbet svart eller uoffisielt" },
				{ letter: "B", text: "Kanskje Max er et falskt navn noen brukte" },
				{ letter: "C", text: "Kanskje Max forlot jobben uten å si fra" }
			]
		}
	},
	{
		day: 14,
		title: "Hvem lyver?",
		variants: [
			{
				previousChoice: "A",
				content: `Kanskje Max jobbet uoffisielt. Svart arbeid?
				Du sjekker lønningslister. Max M. står der. Med lønn.
				Men pengene går til en konto du ikke kan spore.

				«Hvem får Max sin lønn?» spør du regnskap.
				Hun stivner. 
				
				«Det er konfidensielt.»
				«Men noen får pengene?»
				«Selvfølgelig. Alt er i orden.»

				Hun lyver. Du ser det på henne.
				Men hvem får en ikke-eksisterende persons lønn?`
			},
			{
				previousChoice: "B",
				content: `Kanskje Max er et falskt navn. Et alias.
				Men hvorfor? For å skjule hva?

				Du tenker på alle oppgavene: Det ingen vil gjøre. Alt som skyves bort.
				Kanskje Max er et dekknavn for alt som faller mellom stoler?
				Nei, det gir ikke mening. Folk snakker om ham som en person. Med følelser, vaner, julepynt.

				Med mindre alle er med på løgnen?
				Nei. Det må være en enklere forklaring.`
			},
			{
				previousChoice: "C",
				content: `Kanskje Max bare forsvant. Sluttet uten å si fra.
				Men da ville noen ha reagert. Fylt stillingen.

				Du sjekker stillingslister. Max sin stilling eksisterer ikke offisielt.
				«Koordinator» står ingen steder i organisasjonskartet.
				Men alle vet at Max er koordinator. Alle bruker tittelen.

				Det er som om Max eksisterer i folks hoder, men ikke i systemer.
				Du føler deg svimmel. Hva er egentlig virkelig her?`
			}
		],
		quiz: {
			question: "Du føler deg nær gjennombruddet. Hva nå?",
			options: [
				{ letter: "A", text: "Konfronterer ledelsen samlet" },
				{ letter: "B", text: "Tar saken til styret eller fagforeningen" },
				{ letter: "C", text: "Graver i de eldste arkivene du kan finne" }
			]
		}
	},
	{
		day: 15,
		title: "På jakt etter sannheten",
		variants: [
			{
				previousChoice: "A",
				content: `Du krever et møte med ledelsen.
				«Jeg vil vite sannheten om Max.»
				De ser på hverandre. Ubehag i rommet.

				«Max er en verdifull ressurs,» sier daglig leder.
				«En ressurs jeg aldri har sett.»
				HR-leder: «Max jobber på sin måte.»
				«Hvilken måte? Usynlig?»
				Stille. 
				
				Så: «Vi setter pris på engasjementet ditt, men dette er ikke din sak.»
				Du blir bedt om å gå. Men du så frykten i øynene deres.

				De skjuler noe stort.`
			},
			{
				previousChoice: "B",
				content: `Du kontakter fagforeningen.
				«Jeg tror en kollega har forsvunnet og ingen vil snakke om det.»
				Representanten lytter. Tar notater.

				«Max M., sier du?»
				«Ja. Ingen har sett ham på årevis.»
				Hun sjekker registrene. 
		
				«Vi har ingen Max M. registrert som medlem.»
				«Han er kanskje ikke organisert?» spør du.
				Hun rynker pannen.
				«Nei, jeg mener vi har ingen ansatt med det navnet i våre lister over bedriften.»

				Gulvet vakler under deg.`
			},
			{
				previousChoice: "C",
				content: `Du graver i de eldste arkivene.
				I kjelleren finner du bokser fra 2019. Det året Max angivelig begynte.
				Du blar gjennom ansettelsesdokumenter. Finn, Grete, Harald, Irina.

				Ingen Max.
				Du sjekker 2018. 2019. 2020.
				Ingen Max noe sted.

				Hendene dine skjelver.
				Ingen ansettelsesdokumenter. Ingen kontrakt. Ingen underskrift.
				Men alle snakker om ham. Alle husker ham.

				Hvordan kan noen som aldri ble ansatt være så virkelig i alles hoder?`
			}
		],
		quiz: {
			question: "Bevisene peker i en umulig retning. Hvordan håndterer du det?",
			options: [
				{ letter: "A", text: "Det må være en feil i arkivene" },
				{ letter: "B", text: "Kanskje Max var ansatt under et annet navn" },
				{ letter: "C", text: "Du begynner å tvile på din egen virkelighetoppfatning" }
			]
		}
	},
	{
		day: 16,
		title: "Begynnelsen på avsløringen",
		variants: [
			{
				previousChoice: "A",
				content: `Det må være en feil. Dokumenter blir borte.
				Du ringer hovedkontoret. «Jeg trenger alle dokumenter på Max M.»
				«Max M.?» Klikking på tastatur. 
				
				«Vi har ingen med det navnet.»
				«Han har jobbet her i årevis. Alle kjenner ham.»
				Pause. 
				
				«Jeg beklager. Det finnes ingen Max M. i våre systemer.»
				Du legger på. Stirrer ut i luften.

				Kanskje Max brukte et kallenavn? Kanskje «Max» ikke er hans egentlige navn?
				Ja. Det må være det. Du leter etter noen som kalles Max, men heter noe annet.`
			},
			{
				previousChoice: "B",
				content: `Kanskje Max var ansatt under et annet navn.

				Du spør rundt: «Kjenner noen Max sitt egentlige navn?»
				Forvirrede blikk.

				«Heter Max noe mer enn bare Max M. eller om Max bare er en forkortelse?» spør du igjen.
				«Jeg har aldri tenkt på det.»
				«Men vet ingen hva M-en står for da?»

				Ingen vet. Ingen har tenkt på det.
				Du sjekker signaturer på gamle dokumenter. «Max M.» Bare «Max M.»
				Aldri et fullt navn. Aldri en identifiserbar signatur.

				En skygge, tenker du. Max er en skygge.`
			},
			{
				previousChoice: "C",
				content: `Du tviler på deg selv. Kanskje du er paranoid?

				Men så snakker Irina med deg.
				«Jeg har tenkt på det du sa. Om Max.»
				«Ja?»
				«Jeg prøvde å huske sist jeg faktisk så ham. Fysisk.»
				«Og?»
				«Jeg kan ikke. Jeg husker at jeg snakket om ham. Jeg husker at andre nevnte ham. Men jeg ser ikke ansiktet hans for meg.»
				Hun ser skremt ut.

				«Det er som et hull i hukommelsen. Jeg vet han finnes. Men jeg kan ikke bevise det.»
				Dere ser på hverandre. Begge rystet.`
			}
		],
		quiz: {
			question: "Julelysene blinker i vinduet. Men bak fasaden: Hva gjemmer seg?",
			options: [
				{ letter: "A", text: "En konspirasjon på arbeidsplassen" },
				{ letter: "B", text: "Et kollektivt minnetap" },
				{ letter: "C", text: "Noe du ikke kan forklare ennå" }
			]
		}
	},
	{
		day: 17,
		title: "Max = en illusjon?",
		variants: [
			{
				previousChoice: "A",
				content: `En konspirasjon. Det må være det.
				Men hvorfor? Hvem tjener på at Max «eksisterer»?

				Du tenker på alle oppgavene. Alt ansvaret. Alt ingen ville ta.
				Med Max kunne alle peke et annet sted. «Det er Max sitt problem.»
				Men hvis Max ikke er ekte, hvem gjør egentlig jobben?

				Du ser på mappene på pulten hans. De vokser. Ingen krymper dem.
				Kanskje ingen gjør jobben. Kanskje alt bare hoper seg opp, tildelt en person som ikke finnes.

				Et system for å unngå ansvar?`
			},
			{
				previousChoice: "B",
				content: `Et kollektivt minnetap virker umulig. Men hva annet forklarer det?

				Du spør flere. Samme svar:
				«Ja, Max.»
				«Hyggelig fyr.»
				«Jobber mye.»

				Men ingen kan beskrive ham. Ingen har en konkret historie.
				Det er som om alle har den samme vage ideen om Max, men ingen ekte minner.
				Du begynner å lure: Hva om Max aldri var en person? Hva om han var en ide som ble til «virkelighet» fordi alle antok han var ekte?

				Nei. Det er for sprøtt. Det skjer ikke i virkeligheten.
				Gjør det?`
			},
			{
				previousChoice: "C",
				content: `Du kan ikke forklare det. Ennå.
				Men du nekter å gi opp.

				I en gammel backup på serverrommet finner du noe.
				Organisasjonskart fra 2019.
				Du åpner det med skjelvende hender.

				Under «Koordinering» står det:
				**«TBA»**
				To be announced. Stillingen var aldri fylt.
				Men ved siden av, i parentes:
				**«Bruk Max som arbeidsnavn inntil videre.»**

				Arbeidsnavn.
				Max var et arbeidsnavn. For en stilling som aldri ble fylt.

				Du stirrer på skjermen. Kan det virkelig stemme?`
			}
		],
		quiz: {
			question: "Et arbeidsnavn. En ubesatt stilling. Hva betyr dette?",
			options: [
				{ letter: "A", text: "Noen bør ha tatt stillingen, men gjorde det ikke" },
				{ letter: "B", text: "Max ble til en person i folks hoder over tid" },
				{ letter: "C", text: "Det må være mer til historien" }
			]
		}
	},
	{
		day: 18,
		title: "Bevisene peker i en umulig retning",
		variants: [
			{
				previousChoice: "A",
				content: `Stillingen skulle fylles. Men ble det aldri.

				Du ser på tidslinjene:
				2019: «Max» settes som arbeidsnavn.
				2020: Folk begynner å bruke navnet i e-poster.
				2021: Max blir julepynt ansvarlig.
				2022: Max tar på seg flere prosjekter.
				2023-2025: Max er overalt i samtaler, men ingen steder fysisk.

				Det er som en snøball som bare vokste.
				Noen skrev «Max» i et skjema. Andre antok det var en person. Og snart trodde alle det.

				Men kan det virkelig forklare alt? Julepynten? Lappene? Personligheten folk husker?`
			},
			{
				previousChoice: "B",
				content: `Max ble til en person over tid. Gradvis.

				Du tester teorien på Irina.
				«Hva om Max aldri var ekte?»
				Hun ler nervøst. 
				
				«Det er jo sprøtt.»
				«Men tenk på det. Ingen har sett ham. Ingen faktiske spor.»
				Latteren stopper. Hun tenker.

				«Men jeg husker at han var snill. At han hjalp.»
				«Husker du det? Eller har du bare hørt andre si det?»
				Stille. Fargen forsvinner fra ansiktet hennes.

				«Åh. Jeg kan ikke skille det fra hverandre.»`
			},
			{
				previousChoice: "C",
				content: `Det er mer til historien. Du graver videre.

				I en gammel e-post finner du noe avslørende.
				Fra daglig leder, 2019:
				**«Max-stillingen forblir ubesatt pga. budsjettkutt. Fortsett å bruke navnet som placeholder for koordineringsoppgaver.»**
				Placeholder.

				Max var en placeholder. Et navn å klistre oppgaver på.
				Men over tid glemte folk at det bare var et navn. De begynte å behandle Max som en kollega.

				Og nå, seks år senere, er «Max» mer virkelig enn noen faktisk ansatt.`
			}
		],
		quiz: {
			question: "Erkjennelsen synker inn. Hvordan reagerer du?",
			options: [
				{ letter: "A", text: "Lettelse – mysteriet er løst" },
				{ letter: "B", text: "Sorg – Max var aldri ekte" },
				{ letter: "C", text: "Sinne – systemet lurte alle" }
			]
		}
	},
	{
		day: 19,
		title: "De skyldige",
		variants: [
			{
				previousChoice: "A",
				content: `Du føler lettelse. Endelig gir det mening.
				Men tvilen gnager.

				Hvis Max bare var et navn, hvem skrev velkomstlappen til deg? Hvem lagde julepynten? Hvem holdt illusjonen i live?
				Du går tilbake til esken. Ser på nissene.

				Du undersøker en av dem. På bunnen, nesten usynlig:
				**«D.A 2019»**
				Dina Hansen. Det navnet kjenner jeg igjen.
				
				Du konfronterer HR-leder.
				«Lagde du julepynten?»
				Hun blir stiv. 
				
				«Det var en del av onboarding-pakken. For å skape kultur.»
				«Kultur? Ved å late som en ansatt eksisterer?»
				«Det begynte ikke sånn. Men når først Max var etablert, var det lettere å holde det gående enn å forklare.»

				Ledelsen visste. Hele tiden. De holdt illusjonen i live med vilje.`
			},
			{
				previousChoice: "B",
				content: `Du føler sorg. Du brydde deg om Max. Virkelig.
				Og nå er han borte. Eller, han var vel alltid borte.

				Du sitter ved den tomme stolen. Kaffekoppen er fortsatt der.
				«Hvem sin er egentlig koppen?» spør du deg selv.
				Du snur den. På bunnen står det: **"D.A"**
				Dina Hansen. Det navnet kjenner jeg igjen. 
				
				Du finner HR-leder. «Hvorfor står det en kopp på Max sin pult hver dag?»
				Hun sukker tungt. «Jeg satte den ut for å opprettholde fasaden.»
				«Du visste at Max ikke var ekte?»
				«Jeg visste at vi aldri ansatte noen. Men Max var nyttig. Alle de vanskelige oppgavene hadde et sted å gå.»

				Ledelsen orkestrerte det hele. Fra dag én.`
			},
			{
				previousChoice: "C",
				content: `Du er sint. Bedriften lurte alle.
				Men hvem er egentlig skyldig?

				Du graver i de siste dokumentene. Finner en e-posttråd fra ledermøte 2020:
				**«Max løsningen fungerer. Fortsett som planlagt.»** – Daglig leder
				**«Enig. Sparer oss for én stilling i budsjettet.»** – HR-leder
				**«Husk å oppdatere Teams autosvar.»** – IT-leder

				De visste alle sammen. Ledelsen holdt Max i live med vilje.
				Du samler bevisene. E-postene. Arkivene. Tidslinjen.

				I morgen, på julemøtet, kommer sannheten fram. For alle.`
			}
		],
		quiz: {
			question: "I morgen er det tid for sannheten. Hvordan vil du presentere den?",
			options: [
				{ letter: "A", text: "Rolig og saklig – fakta taler for seg" },
				{ letter: "B", text: "Med empati – folk mente det ikke vondt" },
				{ letter: "C", text: "Med krav om endring – dette må ikke skje igjen" }
			]
		}
	},
	{
		day: 20,
		title: "Sannhetens time",
		variants: [
			{
				previousChoice: "A",
				content: `Julemøtet. Alle er samlet. Julelysene blinker i vinduet.

				Du reiser deg.
				«Jeg har noe å fortelle dere. Om Max.»
				Stillhet. Blikk utveksles.

				Du legger fram bevisene. Rolig. Saklig.
				Organisasjonskartet fra 2019: «Bruk Max som arbeidsnavn.»
				E-posten fra 2020: «Stillingen forblir ubesatt.»
				IT-loggen: Ingen ordentlig aktivitet.

				«Max var aldri en person,» sier du. «Han var et navn vi brukte for oppgaver ingen ville ta. Og over tid glemte vi at han ikke var ekte.»
				Stillhet. Sjokkerte ansikter.

				Så, sakte, nikking. Erkjennelse.

				«Jeg visste noe var rart,» hvisker Harald.
				«Vi alle visste,» sier Irina. «Men ingen sa det høyt.»

				Julelysene blinker videre. Men stemningen i rommet har endret seg.`
			},
			{
				previousChoice: "B",
				content: `Du velger empati.

				«Vi må snakke om Max,» begynner du på julemøtet.
				«Jeg vet dette er vanskelig. Og jeg dømmer ingen. Men sannheten er at Max aldri var en ekte person.»
				Du forklarer forsiktig. Viser bevisene.

				Folk ser på hverandre.

				«Jeg skrev lappen til deg,» sier Irina stille. «Velkomstlappen. Jeg ville at du skulle føle deg velkommen. Og Max føltes som den naturlige avsenderen.»
				«Jeg satte ut koppen,» innrømmer HR-leder foran alle. «Hver morgen. For å opprettholde illusjonen.»
				En etter en innrømmer folk små bidrag til myten om Max.

				Ingen planla det. Det bare vokste. En kollektiv fantasi bygget av gode intensjoner og unngått ansvar.`
			},
			{
				previousChoice: "C",
				content: `Du krever endring.

				«Max var ikke en person. Han var et system for å unngå ansvar.»
				Du slår bevisene i bordet. Bokstavelig.

				«I seks år har denne organisasjonen dyttet så mye på et navn. Et tomt navn. Og ingen stilte spørsmål.»
				Daglig leder blir rød. «Vi hadde ikke budsjett til stillingen.»
				«Så dere lot alle tro at noen tok seg av det. Mens ingen gjorde det.»
				«Oppgavene ble jo gjort. På et vis.» kommer det fra HR-leder.

				«Nei. De hopet seg opp. Se på mappen. Årevis med uløste oppgaver. Tildelt et spøkelse.»
				Stillhet. 
				
				Så tar Harald ordet:
				«Du har rett. Vi har alle latt dette skje.»

				Rommet endrer seg. Fra forsvar til erkjennelse.`
			}
		],
		quiz: {
			question: "Sannheten er ute. Hvordan reagerer folk?",
			options: [
				{ letter: "A", text: "Med lettelse – endelig sagt høyt" },
				{ letter: "B", text: "Med skam – alle var med på det" },
				{ letter: "C", text: "Med besluttsomhet – dette må endres" }
			]
		}
	},
	{
		day: 21,
		title: "Etterdønningene",
		variants: [
			{
				previousChoice: "A",
				content: `Lettelsen sprer seg.

				Folk snakker åpent. For første gang.
				«Jeg visste det ikke føltes riktig,» sier Kenneth. «Men jeg trodde alle andre visste noe jeg ikke visste.»
				«Samme her,» nikker Irina. «Jeg antok at noen hadde møtt ham.»

				Ingen hadde det. Alle antok.
				Daglig leder tar ordet: «Vi trenger en ekte koordinator. Noen som faktisk finnes.»
				Folk ler. Nervøst, men ekte.
				«Og vi spør,» legger du til. «Når noe virker rart, feil eller man bare trenger litt hjelp så spør vi.»
				
				Det føles som et nytt kapittel. Max er borte, men lærdommen blir.`
			},
			{
				previousChoice: "B",
				content: `Skammen henger i luften.
				Men Harald bryter stillheten: «Vi kan ikke forandre fortiden. Men vi kan forandre fremtiden.»
				Folk nikker.

				«Fra nå av: Ingen flere Max-er,» sier daglig leder. «Klare ansvarsområder på ekte mennesker.»

				«Og vi spør,» legger du til. «Når noe virker rart, feil eller man bare trenger litt hjelp så spør vi.»
				Irina smiler. «Takk for at du spurte. Selv om vi ikke ville svare.»
				Du smiler tilbake. 
				
				Det føles som en avslutning. Og en begynnelse.`
			},
			{
				previousChoice: "C",
				content: `Besluttsomheten tar over.

				«Vi lager nye rutiner,» sier daglig leder. «Ingen oppgaver uten en som er ansvarlig.»
				«Årlig gjennomgang av ansvarsområder og roller,» foreslår HR-leder.
				«Og vi spør,» legger du til. «Når noe virker rart, feil eller man bare trenger litt hjelp så spør vi.»
				Folk nikker. Skriver notater. Engasjementet er ekte.

				Max sin tomme stol blir ikke fylt. Den blir fjernet. Et symbol på endring.
				Der den sto, satt noen en plante. Ny vekst. Ny start.`
			}
		],
		quiz: {
			question: "Kontoret endrer seg. Hva føler du?",
			options: [
				{ letter: "A", text: "Stolthet – du gjorde en forskjell" },
				{ letter: "B", text: "Ro – mysteriet er løst" },
				{ letter: "C", text: "Håp – ting kan bli bedre" }
			]
		}
	},
	{
		day: 22,
		title: "Ryddingen",
		variants: [
			{
				previousChoice: "A",
				content: `Du er stolt.

				I dag rydder dere Max sin pult. Sammen.
				Mappene sorteres. Oppgavene fordeles. På ekte mennesker.

				«Det er rart,» sier Irina. «Å innse at alt dette bare lå her. I årevis.»
				«Fordi Max skulle ta det.»
				«Ja. Max som ikke finnes.»
				Dere ler. Det er litt trist, men også frigjørende.

				Til slutt står bare kaffekoppen igjen. Dina tar den.
				«Jeg tror jeg vasker denne og tar den hjem. Som en påminnelse.»`
			},
			{
				previousChoice: "B",
				content: `Roen fyller deg.

				Du sitter ved vinduet. Julelysene blinker.
				Kollegaene pakker sammen Max sine ting. Det er ikke mye. Mest papir.
				Men julepynten får bli. Den er ekte, selv om skaperen var det ikke.

				«Skal vi henge den opp?» spør Kenneth.
				«Ja,» sier du. «Max lærte oss noe. Det fortjener å huskes.»

				Nissene henger i treet. Stjernene i vinduet.
				En påminnelse om at selv fantasier kan ha verdi`
			},
			{
				previousChoice: "C",
				content: `Håpet driver deg.
				Du hjelper til med ryddingen.

				«Disse oppgavene,» sier du og holder opp en bunke. «Hvem tar dem egentlig?»
				Daglig leder ser på listen. «Det fordeler vi på teamet. Rettferdig.»
				«Og fremtidige oppgaver?»
				«Samme system. Klare navn, klare frister, med lavterskel for å spørre.»

				Det høres enkelt ut. Men det er et stort seg i riktig retning for denne arbeidsplassen.
				Max lever videre. Ikke som en person, men som en påminnelse.`
			}
		],
		quiz: {
			question: "Lille julaften nærmer seg. Hvordan føler du deg?",
			options: [
				{ letter: "A", text: "Mysterier er slitsomt å løse" },
				{ letter: "B", text: "Det var godt å finne sannheten" },
				{ letter: "C", text: "Hadde vært fint om Max eksisterte" }
			]
		}
	},
	{
		day: 23,
		title: "Kvelden før kvelden",
		variants: [
			{
				previousChoice: "A",
				content: `Du tok sjansen. Og det var verdt det.

				Hjemme pakker du gaver. Tenker på desember.
				Telefonen lyser opp. Irina har sendt en melding:
				*«Vi har laget en intern regel. Den heter Max-regelen: Aldri anta at noen tar ansvar og alltid spør.»*

				Du ler. En regel oppkalt etter en som ikke eksisterte.
				*«Perfekt,»* svarer du.

				Max lever videre. Ikke som en person, men som en påminnelse. Det føles riktig.`
			},
			{
				previousChoice: "B",
				content: `Du håper lærdommen varer.

				Irina sender melding:
				*«Vi har laget en intern regel. Den heter Max-regelen: Aldri anta at noen tar ansvar og alltid spør.»*

				Du ler. En regel oppkalt etter en som ikke eksisterte.
				*«Perfekt,»* svarer du.

				Max lever videre. Ikke som en person, men som en påminnelse.
				Det føles riktig.`
			},
			{
				previousChoice: "C",
				content: `En normal arbeidsdag. Det er alt du ønsker deg.
				Men først: julefred.

				Du sitter med en kopp te. Julelysene blinker i stuen.
				Telefonen vibrerer. Irina:
				*«Vi har laget en intern regel. Den heter Max-regelen: Aldri anta at noen tar ansvar og alltid spør.»*

				Du ler. En regel oppkalt etter en som ikke eksisterte.
				*«Perfekt,»* svarer du.

				Max lever videre. Ikke som en person, men som en påminnelse. Det føles riktig.`,
			}
		],
		quiz: {
			question: "Julaften nærmer seg. Siste tanker?",
			options: [
				{ letter: "A", text: "Takknemlig for litt lesestoff i adventstiden" },
				{ letter: "B", text: "Mysteriet lærte meg noe" },
				{ letter: "C", text: "Nysgjerrig på hva neste år bringer" }
			]
		}
	},
	{
		day: 24,
		title: "Julaften",
		variants: [
			{
				previousChoice: "A",
				content: `Julaften.

				Familien samles. Maten damper. Barna river i gavepapir.

				Noen spør om den nye jobben.
				«Spennende,» sier du. «Litt merkelig, faktisk.»
				Du forteller ikke hele historien. Noen ting er for rare til å forklare over ribbe.

				Senere, når huset er stille, sitter du ved vinduet.
				Julelysene i nabolaget blinker. Varme, trygge farger.

				Men du har lært noe denne måneden. Bak julelysene kan det skjule seg mye. Tomme stoler. Navnløse skygger. Sannheter ingen vil se.
				Du tok deg tid til å se bak lyset. Og det gjorde en forskjell.

				*God jul.*`
			},
			{
				previousChoice: "B",
				content: `Det er over. Endelig.

				Du puster ut. Julaften omgir deg med varme og latter.
				Men tankene vandrer tilbake til Max. Til den tomme stolen. Til alle som bidro til fantasien uten å vite det.

				Det er trist. Men også menneskelig.
				Vi skaper det vi trenger. Selv når det ikke er ekte.

				Du ser ut vinduet. Julelysene blinker. Alle de koselige fasadene.
				Men du vet nå at bak julelysene finnes det alltid noe mer. Historier ingen forteller høyt.

				Det er greit. Så lenge noen tør å spørre.

				*God jul.*`
			},
			{
				previousChoice: "C",
				content: `Nytt år snart. Nye muligheter.
				Men først: julaften. Familie. Tradisjoner.

				Du sitter i sofaen med et glass gløgg. Takknemlig.
				Telefonen lyser opp. Gruppemelding fra jobben:
				*«God jul alle sammen! Her er til et nytt år uten Max-er!»* Fra daglig leder

				Folk svarer med emojier. Hjerter og latter.
				Du smiler. Utenfor blinker julelysene. Vakre og varme.

				Men du husker: Bak julelysene fant du sannheten. En tom stol og et navn som aldri var noe mer.

				Kanskje det er lærdommen. Å alltid se bak det som glitrer.

				*God jul.*`
			}
		],
		quiz: {
			question: "Året ebber ut. Her er mysteriets budskap:",
			note: `Max ble valgt som navn fordi det representerer noe større enn en enkeltperson: en usynlig “maksgrense” i systemet.  
			Et sted hvor ansvar og oppgaver hopet seg opp, hvor spørsmål sluttet å bli stilt, og hvor fantasier tok over der strukturer manglet.  
			Historien viser hva som skjer når noe/noen strekkes til det maksimale uten at noen stopper opp for å se nærmere.  
			Samtidig minner den oss om at våre menneskelige verktøy, som medfølelse og sympati er det som setter endring i gang.  
			*Takk for at du fulgte med, og for at du ser både systemet og menneskene bak det.*`
		}
	}
];
