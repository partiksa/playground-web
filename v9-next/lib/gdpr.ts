/* Ochrana osobných údajov: text stránky /<lang>/ochrana-udajov/ v 4 jazykoch.
   NÁVRH na schválenie klientom (2026-11-28): doba uchovania a zoznam príjemcov treba potvrdiť s PLAYGROUND, s.r.o. */
import type { Lang } from "@/lib/i18n";

export type GdprSection = { h: string; p: string[] };
export type Gdpr = { title: string; description: string; eb: string; h1: string; lead: string; updated: string; sections: GdprSection[] };

const firma = "PLAYGROUND, s.r.o., Poštová 6562/20, 917 01 Trnava, IČO 47051990";

export const GDPR: Record<Lang, Gdpr> = {
  sk: {
    title: "Ochrana osobných údajov | Playground",
    description: "Ako PLAYGROUND, s.r.o. spracúva osobné údaje z dopytového formulára a e-mailov: účel, doba uchovania, príjemcovia a vaše práva.",
    eb: "Právne informácie",
    h1: "Ochrana osobných údajov",
    lead: "Osobné údaje spracúvame len v rozsahu, ktorý potrebujeme na vybavenie vášho dopytu a ďalšiu komunikáciu s vami.",
    updated: "Platné od 28. 11. 2026",
    sections: [
      { h: "Prevádzkovateľ", p: [`Prevádzkovateľom je ${firma}, zapísaná v Obchodnom registri Okresného súdu Trnava, oddiel Sro, vložka 31165/T.`, "Kontakt vo veciach osobných údajov: info@play-ground.sk, +421 905 724 437."] },
      { h: "Aké údaje spracúvame", p: ["Z dopytového formulára: meno, e-mail, telefón (ak ho uvediete), mesto, typ prevádzky, popis požiadavky, text správy a priložený súbor (napríklad pôdorys).", "Z e-mailov a telefonátov: údaje, ktoré nám sami pošlete alebo poviete."] },
      { h: "Účel a právny základ", p: ["Údaje spracúvame, aby sme odpovedali na váš dopyt, pripravili ponuku a dohodli realizáciu. Ide o opatrenia pred uzavretím zmluvy na vašu žiadosť podľa čl. 6 ods. 1 písm. b) nariadenia (EÚ) 2016/679 (GDPR).", "Ak uzavrieme zmluvu, údaje ďalej spracúvame na jej plnenie a na splnenie zákonných povinností, napríklad účtovných a daňových."] },
      { h: "Ako dlho údaje uchovávame", p: ["Údaje z dopytu, z ktorého nevznikne zmluva, uchovávame najviac 3 roky od poslednej komunikácie. Potom ich vymažeme.", "Údaje k uzavretej zmluve a k účtovným dokladom uchovávame po dobu, ktorú ukladajú právne predpisy."] },
      { h: "Komu údaje poskytujeme", p: ["Údaje nepredávame a neposkytujeme na marketing tretích strán. K údajom majú prístup len naši sprostredkovatelia, ktorí pre nás zabezpečujú technickú prevádzku:", "Hetzner Online GmbH (Nemecko): hosting webu. Resend (Plus Five Five, Inc., USA): doručenie správy z formulára do našej e-mailovej schránky. Prenos do USA prebieha na základe štandardných zmluvných doložiek Európskej komisie. Webglobe, a.s.: e-mailová schránka.", "Pri poskytovaní služieb nám môže pomáhať správca webu, ktorý je viazaný mlčanlivosťou."] },
      { h: "Súbory cookie", p: ["Web nepoužíva reklamné ani analytické cookies. V prehliadači si ukladá len vašu voľbu z cookie lišty, aby sa lišta neukazovala znova.", "Ak v budúcnosti zapneme meranie návštevnosti, spustí sa len s vaším súhlasom a táto stránka sa aktualizuje."] },
      { h: "Vaše práva", p: ["Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie spracúvania, prenosnosť a právo namietať. Žiadosť pošlite na info@play-ground.sk, odpovieme do jedného mesiaca.", "Ak sa domnievate, že spracúvanie porušuje predpisy, môžete podať návrh na Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk."] },
    ],
  },
  cz: {
    title: "Ochrana osobních údajů | Playground",
    description: "Jak PLAYGROUND, s.r.o. zpracovává osobní údaje z poptávkového formuláře a e-mailů: účel, doba uchování, příjemci a vaše práva.",
    eb: "Právní informace",
    h1: "Ochrana osobních údajů",
    lead: "Osobní údaje zpracováváme jen v rozsahu, který potřebujeme k vyřízení vaší poptávky a další komunikaci s vámi.",
    updated: "Platné od 28. 11. 2026",
    sections: [
      { h: "Správce", p: [`Správcem je ${firma}, zapsaná v obchodním rejstříku Okresního soudu Trnava, oddíl Sro, vložka 31165/T.`, "Kontakt ve věcech osobních údajů: info@play-ground.sk, +421 905 724 437."] },
      { h: "Jaké údaje zpracováváme", p: ["Z poptávkového formuláře: jméno, e-mail, telefon (pokud ho uvedete), město, typ provozu, popis požadavku, text zprávy a přiložený soubor (například půdorys).", "Z e-mailů a telefonátů: údaje, které nám sami pošlete nebo řeknete."] },
      { h: "Účel a právní základ", p: ["Údaje zpracováváme, abychom odpověděli na vaši poptávku, připravili nabídku a domluvili realizaci. Jde o opatření před uzavřením smlouvy na vaši žádost podle čl. 6 odst. 1 písm. b) nařízení (EU) 2016/679 (GDPR).", "Pokud uzavřeme smlouvu, údaje dále zpracováváme k jejímu plnění a ke splnění zákonných povinností, například účetních a daňových."] },
      { h: "Jak dlouho údaje uchováváme", p: ["Údaje z poptávky, ze které nevznikne smlouva, uchováváme nejvýše 3 roky od poslední komunikace. Poté je vymažeme.", "Údaje k uzavřené smlouvě a k účetním dokladům uchováváme po dobu, kterou ukládají právní předpisy."] },
      { h: "Komu údaje poskytujeme", p: ["Údaje neprodáváme a neposkytujeme k marketingu třetích stran. K údajům mají přístup jen naši zpracovatelé, kteří pro nás zajišťují technický provoz:", "Hetzner Online GmbH (Německo): hosting webu. Resend (Plus Five Five, Inc., USA): doručení zprávy z formuláře do naší e-mailové schránky. Přenos do USA probíhá na základě standardních smluvních doložek Evropské komise. Webglobe, a.s.: e-mailová schránka.", "Při poskytování služeb nám může pomáhat správce webu, který je vázán mlčenlivostí."] },
      { h: "Soubory cookie", p: ["Web nepoužívá reklamní ani analytické cookies. V prohlížeči si ukládá jen vaši volbu z cookie lišty, aby se lišta nezobrazovala znovu.", "Pokud v budoucnu zapneme měření návštěvnosti, spustí se jen s vaším souhlasem a tato stránka se aktualizuje."] },
      { h: "Vaše práva", p: ["Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Žádost pošlete na info@play-ground.sk, odpovíme do jednoho měsíce.", "Pokud se domníváte, že zpracování porušuje předpisy, můžete podat stížnost u Úradu na ochranu osobných údajov Slovenskej republiky (Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk) nebo u Úřadu pro ochranu osobních údajů v České republice (www.uoou.gov.cz)."] },
    ],
  },
  en: {
    title: "Privacy policy | Playground",
    description: "How PLAYGROUND, s.r.o. processes personal data from the inquiry form and emails: purpose, retention, recipients and your rights.",
    eb: "Legal information",
    h1: "Privacy policy",
    lead: "We process personal data only to the extent we need to handle your inquiry and to communicate with you.",
    updated: "Effective from 28 November 2026",
    sections: [
      { h: "Controller", p: [`The controller is ${firma}, registered in the Commercial Register of the District Court Trnava, section Sro, file 31165/T.`, "Contact for personal data matters: info@play-ground.sk, +421 905 724 437."] },
      { h: "What data we process", p: ["From the inquiry form: name, email, phone (if provided), city, type of venue, description of your request, message text and an attached file (for example a floor plan).", "From emails and phone calls: the data you send or tell us yourself."] },
      { h: "Purpose and legal basis", p: ["We process the data to answer your inquiry, prepare an offer and agree on the project. These are steps taken at your request before entering into a contract under Article 6(1)(b) of Regulation (EU) 2016/679 (GDPR).", "If we sign a contract, we process the data to perform it and to meet legal obligations, such as accounting and tax requirements."] },
      { h: "How long we keep the data", p: ["Data from an inquiry that does not lead to a contract are kept for no longer than 3 years after our last communication and then deleted.", "Data related to a contract and accounting records are kept for the period required by law."] },
      { h: "Who receives the data", p: ["We do not sell the data or share it for third-party marketing. Only our processors that run the technical operation have access to it:", "Hetzner Online GmbH (Germany): website hosting. Resend (Plus Five Five, Inc., USA): delivery of form messages to our mailbox; the transfer to the USA is based on the European Commission's standard contractual clauses. Webglobe, a.s.: mailbox.", "A website administrator bound by confidentiality may assist us in providing these services."] },
      { h: "Cookies", p: ["The website uses no advertising or analytics cookies. Your browser stores only your choice from the cookie bar so that the bar is not shown again.", "If we enable visitor measurement in the future, it will run only with your consent and this page will be updated."] },
      { h: "Your rights", p: ["You have the right of access, rectification, erasure, restriction of processing, data portability and the right to object. Send your request to info@play-ground.sk; we will reply within one month.", "If you believe the processing breaches the law, you can lodge a complaint with the Office for Personal Data Protection of the Slovak Republic, Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk, or with the supervisory authority in your country."] },
    ],
  },
  de: {
    title: "Datenschutz | Playground",
    description: "Wie PLAYGROUND, s.r.o. personenbezogene Daten aus dem Anfrageformular und aus E-Mails verarbeitet: Zweck, Speicherdauer, Empfänger und Ihre Rechte.",
    eb: "Rechtliche Hinweise",
    h1: "Datenschutz",
    lead: "Wir verarbeiten personenbezogene Daten nur in dem Umfang, den wir zur Bearbeitung Ihrer Anfrage und zur weiteren Kommunikation mit Ihnen benötigen.",
    updated: "Gültig ab 28. 11. 2026",
    sections: [
      { h: "Verantwortlicher", p: [`Verantwortlicher ist ${firma}, eingetragen im Handelsregister des Bezirksgerichts Trnava, Abteilung Sro, Einlage 31165/T.`, "Kontakt in Datenschutzfragen: info@play-ground.sk, +421 905 724 437."] },
      { h: "Welche Daten wir verarbeiten", p: ["Aus dem Anfrageformular: Name, E-Mail, Telefon (falls angegeben), Ort, Art des Betriebs, Beschreibung des Anliegens, Nachrichtentext und eine angehängte Datei (zum Beispiel ein Grundriss).", "Aus E-Mails und Telefonaten: die Daten, die Sie uns selbst senden oder mitteilen."] },
      { h: "Zweck und Rechtsgrundlage", p: ["Wir verarbeiten die Daten, um Ihre Anfrage zu beantworten, ein Angebot zu erstellen und die Umsetzung zu vereinbaren. Es handelt sich um vorvertragliche Maßnahmen auf Ihre Anfrage nach Art. 6 Abs. 1 lit. b der Verordnung (EU) 2016/679 (DSGVO).", "Kommt ein Vertrag zustande, verarbeiten wir die Daten zu seiner Erfüllung und zur Erfüllung gesetzlicher Pflichten, etwa im Rechnungswesen und Steuerrecht."] },
      { h: "Wie lange wir die Daten speichern", p: ["Daten aus einer Anfrage, aus der kein Vertrag entsteht, speichern wir höchstens 3 Jahre ab der letzten Kommunikation und löschen sie danach.", "Daten zu einem Vertrag und zu Buchhaltungsbelegen speichern wir so lange, wie es gesetzlich vorgeschrieben ist."] },
      { h: "An wen wir Daten weitergeben", p: ["Wir verkaufen die Daten nicht und geben sie nicht für Marketing Dritter weiter. Zugriff haben nur unsere Auftragsverarbeiter, die den technischen Betrieb sicherstellen:", "Hetzner Online GmbH (Deutschland): Webhosting. Resend (Plus Five Five, Inc., USA): Zustellung der Formularnachricht in unser Postfach; die Übermittlung in die USA erfolgt auf Grundlage der Standardvertragsklauseln der Europäischen Kommission. Webglobe, a.s.: E-Mail-Postfach.", "Bei der Erbringung dieser Leistungen kann uns ein zur Verschwiegenheit verpflichteter Website-Administrator unterstützen."] },
      { h: "Cookies", p: ["Die Website verwendet keine Werbe- oder Analyse-Cookies. Im Browser wird nur Ihre Auswahl aus der Cookie-Leiste gespeichert, damit die Leiste nicht erneut erscheint.", "Sollten wir künftig eine Besuchermessung einführen, läuft sie nur mit Ihrer Einwilligung, und diese Seite wird aktualisiert."] },
      { h: "Ihre Rechte", p: ["Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Senden Sie Ihre Anfrage an info@play-ground.sk; wir antworten innerhalb eines Monats.", "Wenn Sie der Ansicht sind, dass die Verarbeitung gegen Vorschriften verstößt, können Sie sich an die slowakische Datenschutzbehörde (Úrad na ochranu osobných údajov SR, Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk) oder an die Aufsichtsbehörde in Ihrem Land wenden."] },
    ],
  },
};

export const GDPR_LINK: Record<Lang, string> = { sk: "Ochrana osobných údajov", cz: "Ochrana osobních údajů", en: "Privacy policy", de: "Datenschutz" };
