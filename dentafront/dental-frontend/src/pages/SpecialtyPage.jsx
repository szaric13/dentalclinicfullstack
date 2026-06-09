import { useParams, Link } from 'react-router-dom';

const SPECIALTY_DATA = {
    'Fiksna stomatološka protetika': {
        title: 'Fiksna stomatološka protetika',
        description: `Fiksna stomatološka protetika je oduvek bila fokus naše ordinacije. Naši doktori uvek streme ka radu koji ide u korak sa tehnologijom, što se ogleda u upotrebljenim materijalima i tehnikama rada. Kako celokupna stomatologija migrira ka bezmetalnim materijalima, trudimo se da ponudimo veliki izbor različitih nadoknada koje pacijentu donose najbolju estetiku uz minimalno invazivne metode rada.

Pacijentima nudimo da učestvuju zajedno sa tehničarima i doktorima u planiranju svog budućeg osmeha pomoću digitalnog dizajna i probe modela u ustima pre samog početka rada. Uz pomoć intraoralnog skenera uzimanje otisaka je brzo i komforno, a celokupni proces neuporedivo efikasniji i precizniji.`,
    },
    'Ortodoncija': {
        title: 'Ortodoncija',
        description: `Ortodoncija je grana stomatologije koja se bavi zdravim zubima, pogrešno pozicioniranim u ustima. Izvanrednim rezultatima terapije svedoče stotine pacijenata koji su ulepšali svoj osmeh noseći fiksne ortodontske aparate u našoj ordinaciji.

Sem estetskih benefita, ortodoncija pruža važnu potporu i pripremu za protetsku i implantoprotetsku rehabilitaciju.`,
    },
    'Restaurativa i endodoncija': {
        title: 'Restaurativa i endodoncija',
        description: `Restaurativna grana je temelj moderne stomatologije i kao takva zaslužuje posebnu pažnju i kvalitet u izradi. Lečenje zuba se u našoj ordinaciji radi mašinskim putem što predstavlja svetski standard u endodonciji.

Vodimo se idejom minimalno invazivne stomatologije što nas dovodi do zaključka da je imperativ sačuvati i produžiti trajanje zuba ukoliko postoji ta mogućnost. Zahtevne restaurativne procedure se rade uz pomoć uveličanja i koferdam membrane kako bi se postigao najviši mogući kvalitet.`,
    },
    'Hirurgija i implantologija': {
        title: 'Hirurgija i implantologija',
        description: `Implantologija je disciplina koja je u funkciji protetskoj rehabilitaciji. Kao veliku prednost naše ordinacije ističemo veoma detaljno planiranje i izvedbu kompleksnih radova na implantima.

Koncepti poput "All-on-four" i "All-on-six" omogućavaju pacijentu da rehabilituje kompletnu vilicu fiksnim radom na četiri ili šest implantata. Ukoliko Vam je dosadila Vaša mobilna proteza koja se pomera, spada i konstantno zadaje probleme, vreme je da razmislite o dentalnim implantatima.`,
    },
    'Dečija stomatologija i preventiva': {
        title: 'Dečija stomatologija i preventiva',
        description: `Kod najmlađih pacijenata se trudimo da ostvarimo pozitivan prvi utisak kod stomatologa. Shvatamo važnost formiranja pravih navika u održavanju oralne higijene od malih nogu.

Koristeći pravi pristup, u mogućnosti smo da obezbedimo tretman kod dece koja imaju početni strah od stomatologa. Pružamo podršku i edukaciju roditeljima kako bi se preventivne mere u oralnom zdravlju primenjivale i van ordinacije.`,
    },
    'Estetska medicina': {
        title: 'Estetska medicina',
        description: `Estetska medicina je grana medicine koja se fokusira na poboljšanje i očuvanje estetskog izgleda i harmonije lica i tela. Ona koristi različite nehirurške tretmane i procedure kako bi se rešili problemi poput bora, gubitka volumena, nepravilnosti na koži, upalih podočnjaka, opuštene kože lica i tela, viška masnog tkiva i slično.

Ovi tretmani često uključuju injekcije botoksa, dermalne implante za biorevitalizaciju lica, vrata i ruku, hemijske pilinge, tretmane aparatima koji iniciraju produkciju kolagena i elastina.

Kod nas u posebno opremljenoj ordinaciji na spratu objekta 'Denta' se praktikuju procedure:
- aplikacija botoksa
- hijaluronski fileri
- PRP tretmani
- aplikacija mezokoktela
- hemijski pilinzi
- uklanjanje pigmentnih fleka i papiloma
- nehirurški zahvati uklanjanja viška kože
- 'plazma shower' tretmani

Diskrecija i poverenje su obavezni na obostrano zadovoljstvo.`,
    },
};

export default function SpecialtyPage() {
    const { specialty } = useParams();
    const data = SPECIALTY_DATA[specialty];

    if (!data) {
        return (
            <div className="container" style={{ marginTop: 50 }}>
                <h2>Specijalizacija nije pronađena</h2>
                <Link to="/services">← Nazad na usluge</Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{ background: '#1a5276', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 36 }}>{data.title}</h1>
            </div>
            <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
                <div className="card" style={{ padding: 30 }}>
                    <p style={{ fontSize: 16, lineHeight: 1.9, color: '#444', whiteSpace: 'pre-line' }}>
                        {data.description}
                    </p>
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: 25, display: 'inline-block' }}>
                        Zakažite termin
                    </Link>
                </div>
            </div>
        </div>
    );
}