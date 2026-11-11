import Shell from "@/components/Shell";
import { toLang } from "@/lib/i18n";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/v9";

type P = { params: Promise<{ lang: string }> };
export const generateMetadata = ({ params }: P) => pageMetadata(params, "kontakt");

export default async function Kontakt({ params }: P) {
  const s = site(toLang((await params).lang));
  const { m, T, fmt, AR } = s;
  const f = (k: string) => m("kontakt.form." + k);

  const chips = (name: string, items: [string, string][]) => (
    <div className="chips">
      {items.map(([v, t]) => <label key={v}><input type="radio" name={name} value={v} /><span>{fmt(t)}</span></label>)}
    </div>
  );
  const svc = ["nove", "prerabka", "stahovanie", "reviza", "nafukovacie", "ine"].map((k) => [k, f(`service.options.${k}`)] as [string, string]);
  const typ = [0, 1, 2, 3, 4].map((i) => [f(`type.options[${i}]`), f(`type.options[${i}]`)] as [string, string]);
  const kedy = [0, 1, 2, 3].map((i) => [f(`when.options[${i}]`), f(`when.options[${i}]`)] as [string, string]);
  const send = T(["rozmery priestoru a výšku stropu", "pôdorys alebo fotky priestoru", "pre aký vek detí je ihrisko", "typ prevádzky a termín"],
    ["rozměry prostoru a výšku stropu", "půdorys nebo fotky prostoru", "pro jaký věk dětí je hřiště", "typ provozu a termín"],
    ["room dimensions and ceiling height", "a floor plan or photos of the space", "the age of the children", "type of venue and timing"],
    ["Raummaße und Deckenhöhe", "Grundriss oder Fotos des Raums", "Alter der Kinder", "Art des Betriebs und Zeitrahmen"]);
  const kt = {
    errContact: T("Doplňte meno a platný e-mail.", "Doplňte jméno a platný e-mail.", "Please enter your name and a valid email address.",
      "Bitte geben Sie Ihren Namen und eine gültige E-Mail-Adresse an."),
    errOther: f("service.otherError"), errConsent: f("errors.consent"), errType: f("plan.errType"), errSize: f("plan.errSize"),
    chosen: f("plan.fileChosen"), none: f("mail.none"), mService: f("mail.service"), mType: f("mail.type"), mWhen: f("mail.when"),
    mPlan: f("mail.plan"), planYes: f("mail.planYes"), planNo: f("mail.planNo"), mName: f("mail.name"), mEmail: f("mail.email"),
    mPhone: f("mail.phone"), mCity: f("mail.city"), subject: f("mail.subject"), doneText: f("done.text"), doneTextPlan: f("done.textPlan"),
    to: f("done.to"), copied: f("done.copied"),
  };
  const br = (t: string) => t.split("\n").flatMap((x, i) => (i ? [<br key={i} />, x] : [x]));

  return (
    <Shell s={s} page="kontakt" data={"var KT = " + JSON.stringify(kt) + ";"} scripts={["/js/kontakt.js"]}>
      <section className="ph">
        <p className="eb rv" data-now="">{fmt(m("kontakt.eb"))}</p>
        <h1 className="h h1" data-split="now">{fmt(m("kontakt.h1"))}</h1>
        <p className="lead rv" data-now="" data-d=".15">{fmt(m("kontakt.lead"))}</p>

        <div className="ko">
          <div className="ko-info rv" data-now="" data-d=".25">
            <div className="ko-big">
              <a href={`tel:${m("common.phoneHref")}`}>{m("common.phone")}</a>
              <a href={`mailto:${m("common.email")}`}>{m("common.email")}</a>
            </div>
            <dl className="ko-dl">
              <div><dt>{m("kontakt.addressTitle")}</dt><dd>{br(m("kontakt.address"))}</dd></div>
              <div><dt>{m("kontakt.companyTitle")}</dt><dd>{br(m("kontakt.company"))}</dd></div>
            </dl>
            <div className="chk">
              <h2>{T("Čo nám pošlite", "Co nám pošlete", "What to send us", "Was Sie uns schicken können")}</h2>
              <ul>{send.map((x) => <li key={x}>{fmt(x)}</li>)}</ul>
            </div>
          </div>

          <div className="f rv" data-now="" data-d=".35" id="f">
            <form noValidate aria-label={f("label")}>
              <fieldset>
                <legend><span className="n">01</span> {fmt(f("service.legend"))}</legend>
                {chips("co", svc)}
                <div className="sub" id="other" hidden>
                  <label className="fld wide"><span>{fmt(f("service.otherLabel"))}</span><input name="co_ine" /></label>
                </div>
              </fieldset>
              <fieldset>
                <legend><span className="n">02</span> {fmt(f("type.legend"))}</legend>
                {chips("typ", typ)}
              </fieldset>
              <fieldset>
                <legend><span className="n">03</span> {fmt(f("when.legend"))}</legend>
                {chips("kedy", kedy)}
              </fieldset>
              <fieldset>
                <legend><span className="n">04</span> {fmt(f("plan.legend"))}</legend>
                {chips("plan", [["ano", f("plan.yes")], ["nie", f("plan.no")]])}
                <div className="sub" id="planFile" hidden>
                  <label className="file"><span className="fld"><span>{fmt(f("plan.fileLabel"))}</span></span>
                    <input type="file" name="plan_file" accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf" /><small>{fmt(f("plan.fileHint"))}</small></label>
                  <p className="file-msg" aria-live="polite" />
                </div>
              </fieldset>
              <fieldset>
                <legend><span className="n">05</span> {fmt(f("contact.legend"))}</legend>
                <div className="fields">
                  <label className="fld"><span>{fmt(f("contact.name"))}</span><input name="meno" autoComplete="name" required /></label>
                  <label className="fld"><span>{fmt(f("contact.email"))}</span><input name="email" type="email" autoComplete="email" required /></label>
                  <label className="fld"><span>{fmt(f("contact.phone"))}</span><input name="tel" type="tel" autoComplete="tel" /></label>
                  <label className="fld"><span>{fmt(f("contact.city"))}</span><input name="mesto" autoComplete="address-level2" /></label>
                  <label className="fld wide"><span>{fmt(f("contact.message"))}</span><textarea name="sprava" placeholder={f("contact.messagePlaceholder")} /></label>
                </div>
              </fieldset>
              <label className="ok"><input type="checkbox" name="suhlas" required /><span>{fmt(f("consent"))}</span></label>
              <button className="btn btn--red" type="submit">{f("submit")} {AR}</button>
              <p className="err" role="alert" />
            </form>
            <div className="done" tabIndex={-1}>
              <h2 className="h">{fmt(f("done.title"))}</h2>
              <p className="p">{fmt(f("done.text"))}</p>
              <div className="acts">
                <a className="btn btn--red" id="mailGo" href="#">{f("done.open")} {AR}</a>
                <button className="more" type="button" id="copy">{f("done.copy")}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
