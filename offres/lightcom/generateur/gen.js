const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, Header, Footer,
  PageNumber, PageBreak, LevelFormat, VerticalAlign,
} = require("docx");

// ---------------------------------------------------------------- Constantes
const ROUGE = "C00000";
const MARINE = "1F3864";
const GRIS = "555555";
const FONT = "Arial";

const CLIENT = "LIGHTCOM";
const CLIENT_VILLE = "Ouagadougou, Burkina Faso";
const DATE_FR = "02 août 2026";

// ------------------------------------------------------------------- Assets
function findAsset(filename) {
  const paths = [
    `/mnt/skills/user/offre-commerciale-web/assets/${filename}`,
    `/root/.claude/skills/offre-commerciale-web/assets/${filename}`,
    `/tmp/offre-commerciale-web/assets/${filename}`,
  ];
  for (const p of paths) if (fs.existsSync(p)) return fs.readFileSync(p);
  return null;
}
const enteteData = findAsset("entete_megasave.png");
const cachetData = findAsset("cachet_megasave.png");
const logoData = findAsset("logo_megasave.png");

// -------------------------------------------------------------- Helpers
const P = (text, opts = {}) =>
  new Paragraph({
    alignment: opts.align || AlignmentType.JUSTIFIED,
    spacing: { after: opts.after === undefined ? 160 : opts.after, line: 300 },
    indent: opts.indent,
    border: opts.border,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: opts.size || 24,
        bold: !!opts.bold,
        italics: !!opts.italics,
        color: opts.color || "000000",
      }),
    ],
  });

const H1 = (text) =>
  new Paragraph({
    spacing: { before: 320, after: 200 },
    keepNext: true,
    keepLines: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ROUGE, space: 4 } },
    children: [new TextRun({ text, font: FONT, size: 28, bold: true, color: ROUGE })],
  });

const BULLET = (text, boldPart) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 100, line: 300 },
    children: boldPart
      ? [
          new TextRun({ text: boldPart, font: FONT, size: 24, bold: true, color: MARINE }),
          new TextRun({ text, font: FONT, size: 24 }),
        ]
      : [new TextRun({ text, font: FONT, size: 24 })],
  });

const EMPTY = (after = 200) => new Paragraph({ spacing: { after }, children: [] });

// -------------------------------------------------------------- Tableau prix
const bd = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: bd, bottom: bd, left: bd, right: bd };

const cell = (text, { bold, color, bg, width, align } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    shading: bg ? { type: ShadingType.CLEAR, fill: bg, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: align || AlignmentType.LEFT,
        spacing: { after: 0 },
        children: [
          new TextRun({ text, font: FONT, size: 22, bold: !!bold, color: color || "000000" }),
        ],
      }),
    ],
  });

const prestations = [
  ["Création de site internet professionnel", "Responsive, adapté mobile et tablette"],
  ["Nom de domaine", "1 an inclus (.com, .net, .bf ou autre au choix)"],
  ["Hébergement web sécurisé", "1 an inclus, certificat SSL gratuit"],
  ["Emails professionnels", "5 adresses @votre-domaine.com incluses"],
  ["Formation à l'utilisation", "Session de formation incluse"],
  ["Support technique", "1 AN complet (assistance et mises à jour mineures)"],
];

const tableauPrix = new Table({
  width: { size: 9026, type: WidthType.DXA },
  columnWidths: [5500, 3526],
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        cell("Prestation", { bold: true, color: "FFFFFF", bg: ROUGE, width: 5500 }),
        cell("Détail", { bold: true, color: "FFFFFF", bg: ROUGE, width: 3526 }),
      ],
    }),
    ...prestations.map((r, i) =>
      new TableRow({
        children: [
          cell(r[0], { bg: i % 2 === 0 ? "FFFFFF" : "F5F5F5", width: 5500, bold: true }),
          cell(r[1], { bg: i % 2 === 0 ? "FFFFFF" : "F5F5F5", width: 3526 }),
        ],
      })
    ),
    new TableRow({
      children: [
        cell("TOTAL", { bold: true, color: "FFFFFF", bg: MARINE, width: 5500 }),
        cell("300 000 FCFA", { bold: true, color: "FFFFFF", bg: MARINE, width: 3526 }),
      ],
    }),
  ],
});

// -------------------------------------------------------------- Couverture
const couverture = [];

if (enteteData) {
  couverture.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new ImageRun({
          data: enteteData,
          transformation: { width: 500, height: 138 },
          type: "png",
        }),
      ],
    })
  );
} else if (logoData) {
  couverture.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new ImageRun({ data: logoData, transformation: { width: 160, height: 160 }, type: "png" }),
      ],
    })
  );
} else {
  couverture.push(
    P("MEGASAVE MEDIAS", { align: AlignmentType.CENTER, bold: true, size: 44, color: ROUGE, after: 60 }),
    P("Solutions Numériques, Web & Médias", { align: AlignmentType.CENTER, italics: true, size: 24, color: MARINE })
  );
}

couverture.push(
  P("MEGASAVE MEDIAS – Solutions Numériques, Web & Médias", {
    align: AlignmentType.CENTER, bold: true, size: 22, color: MARINE, after: 40,
  }),
  P("Bobo 2010, Bobo-Dioulasso, Burkina Faso", {
    align: AlignmentType.CENTER, size: 20, color: GRIS, after: 40,
  }),
  P("Tél : +226 66 64 80 21  |  infos@medias.megasave.fr  |  www.medias.megasave.fr", {
    align: AlignmentType.CENTER, size: 20, color: GRIS, after: 120,
  }),
  new Paragraph({
    spacing: { after: 500 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ROUGE, space: 2 } },
    children: [],
  }),
  P("OFFRE COMMERCIALE", {
    align: AlignmentType.CENTER, bold: true, size: 56, color: ROUGE, after: 160,
  }),
  P("Création de Site Internet Professionnel", {
    align: AlignmentType.CENTER, bold: true, size: 30, color: MARINE, after: 200,
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 900 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MARINE, space: 2 } },
    children: [],
  }),
  P("Proposée à :", { align: AlignmentType.CENTER, size: 24, color: GRIS, after: 120 }),
  P(CLIENT, { align: AlignmentType.CENTER, bold: true, size: 40, color: MARINE, after: 100 }),
  P("Communication • Événementiel • Sourcing", {
    align: AlignmentType.CENTER, italics: true, size: 24, color: GRIS, after: 80,
  }),
  P(CLIENT_VILLE, { align: AlignmentType.CENTER, size: 24, color: "000000", after: 700 }),
  P(`Le ${DATE_FR}`, { align: AlignmentType.CENTER, italics: true, size: 22, color: GRIS, after: 0 }),
  new Paragraph({ children: [new PageBreak()] })
);

// -------------------------------------------------------------- Sections
const corps = [
  // ---- 1
  H1("1. Introduction"),
  P("Madame, Monsieur,"),
  P(
    "MEGASAVE MEDIAS est une agence digitale basée à Bobo-Dioulasso, Burkina Faso, spécialisée dans la création de sites internet professionnels, la communication digitale et les solutions numériques adaptées aux entreprises d'Afrique de l'Ouest."
  ),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 300 },
    children: [
      new TextRun({
        text: "Nous avons le plaisir de vous soumettre la présente offre commerciale pour la création de votre site internet professionnel. Notre objectif est de vous offrir une présence en ligne percutante, moderne et efficace, qui reflète l'image, le savoir-faire et les ambitions de ",
        font: FONT, size: 24,
      }),
      new TextRun({ text: CLIENT, font: FONT, size: 24, bold: true, color: MARINE }),
      new TextRun({
        text: ", acteur de la communication, de l'événementiel et du sourcing à Ouagadougou.",
        font: FONT, size: 24,
      }),
    ],
  }),
  P(
    "Une agence de communication et d'événementiel est jugée, avant tout, sur son image. Votre site internet est votre première réalisation visible : c'est la preuve concrète, accessible à tous vos prospects, que vous maîtrisez les codes de la communication moderne. C'est aussi la vitrine de vos productions, de vos événements et de votre réseau de sourcing."
  ),
  P(
    "Fort de plusieurs années d'expérience dans l'accompagnement numérique des entreprises de la sous-région, MEGASAVE MEDIAS met à votre disposition son expertise, ses outils de pointe et son équipe dédiée pour faire de votre site web un véritable levier de croissance."
  ),

  // ---- 2
  H1("2. Pourquoi votre entreprise a besoin d'un site internet ?"),
  BULLET(" — votre vitrine est accessible à tout moment, même quand vous dormez", "Visibilité 24h/24, 7j/7"),
  BULLET(" — un site soigné renforce la confiance de vos clients et partenaires", "Crédibilité et image professionnelle"),
  BULLET(" — internet n'a pas de frontières", "Toucher de nouveaux clients au-delà de votre zone locale"),
  BULLET(" avec photos, descriptions et tarifs détaillés", "Présenter vos produits et services"),
  BULLET(" — formulaire en ligne, lien WhatsApp, numéro de téléphone cliquable", "Faciliter le contact"),
  BULLET("", "Réduire vos coûts de communication et de marketing traditionnel"),
  BULLET("", "Rester compétitif face à vos concurrents déjà présents en ligne"),
  BULLET(" grâce à une vitrine professionnelle en ligne", "Attirer de sérieux partenaires nationaux et internationaux"),

  // ---- 3
  H1("3. Les avantages spécifiques pour votre activité"),
  P(
    "Quel que soit votre domaine d'activité, un site internet bien conçu vous apporte des bénéfices concrets et mesurables. Pour une agence intervenant dans la communication, l'événementiel et le sourcing comme LIGHTCOM, les retombées sont particulièrement directes :"
  ),
  BULLET(
    " : galeries photos et vidéos de vos événements, campagnes d'affichage, productions audiovisuelles, aménagements de stands. Un prospect qui voit ce que vous avez déjà réalisé est un prospect à moitié convaincu.",
    "Un portfolio en ligne de vos réalisations"
  ),
  BULLET(
    " : présentez clairement vos pôles d'activité — communication globale, régie publicitaire, organisation d'événements, sourcing et approvisionnement — pour que chaque client identifie immédiatement la prestation qui le concerne.",
    "Un catalogue structuré de vos services"
  ),
  BULLET(
    " : un formulaire dédié permet de recevoir des demandes de devis détaillées (type d'événement, budget, dates, volumes à sourcer) 24h/24, sans passer par de longs échanges téléphoniques.",
    "Des demandes de devis qualifiées automatiquement"
  ),
  BULLET(
    " : les ONG, institutions, banques, opérateurs télécoms et grandes entreprises consultent systématiquement le site d'un prestataire avant de lancer un appel d'offres ou de retenir une agence. Sans site, votre dossier part avec un handicap.",
    "L'accès aux appels d'offres et aux marchés institutionnels"
  ),
  BULLET(
    " : pour votre activité de sourcing, un site professionnel en français et en anglais rassure les fournisseurs étrangers (Chine, Europe, Maghreb) et vous positionne comme un intermédiaire structuré et fiable, pas comme un simple revendeur.",
    "La crédibilité auprès des fournisseurs internationaux"
  ),
  BULLET(
    " : chaque événement organisé, chaque campagne livrée devient un contenu publiable qui alimente votre référencement Google et prouve en continu votre activité.",
    "Une actualité et un blog pour valoriser vos événements"
  ),
  BULLET(
    " : un site relié à vos pages Facebook, Instagram, LinkedIn et TikTok centralise votre audience et transforme vos abonnés en clients — c'est exactement ce que vous vendez à vos propres clients, il est essentiel de l'appliquer à vous-même.",
    "La cohérence avec vos réseaux sociaux"
  ),

  // ---- 4
  H1("4. Les risques de l'absence d'un site internet"),
  P(
    "Une entreprise sans site internet s'expose à des risques réels et perd des avantages concurrentiels majeurs :"
  ),
  BULLET("Vos concurrents en ligne captent vos clients potentiels avant vous"),
  BULLET("Les prospects ne trouvent aucune information sur vous lors de leurs recherches Google"),
  BULLET("Vous perdez des opportunités d'affaires faute de crédibilité professionnelle"),
  BULLET("Impossibilité de recevoir des demandes de devis ou des commandes à distance"),
  BULLET("Vos partenaires potentiels remettent en cause votre sérieux sans présence digitale"),
  BULLET("Vous manquez des marchés nationaux et internationaux inaccessibles sans vitrine en ligne"),
  BULLET("Difficultés à fidéliser vos clients sans canal de communication direct et professionnel"),
  BULLET("Votre image reste limitée à votre zone de chalandise locale, sans possibilité d'expansion"),

  // ---- 5
  H1("5. Notre offre de prix"),
  P("Nous vous proposons un forfait unique, tout inclus, sans frais cachés :"),
  EMPTY(120),
  tableauPrix,
  EMPTY(200),
  P("⭐ Forfait unique : 300 000 FCFA — tout inclus, sans surprise.", {
    align: AlignmentType.CENTER, bold: true, size: 26, color: ROUGE, after: 200,
  }),

  // ---- 6
  H1("6. Ce que vous gagnez avec MEGASAVE MEDIAS"),
  P("En choisissant MEGASAVE MEDIAS, vous bénéficiez de :"),
  BULLET(" à votre image — valable 1 an", "Un nom de domaine personnalisé"),
  BULLET(", moderne et 100% responsive (mobile, tablette, ordinateur)", "Un site web professionnel"),
  BULLET(" disponible 24h/24, avec certificat SSL", "Un hébergement sécurisé"),
  BULLET(" (ex. : contact@lightcom.com)", "5 adresses email professionnelles"),
  BULLET(" à la prise en main de votre site", "Une formation complète"),
  BULLET(" pendant 1 AN complet (assistance et mises à jour mineures incluses)", "Un support technique"),
  BULLET(", référencée et visible dans votre région", "Une présence immédiate sur Google"),
  BULLET(" pour faciliter la localisation de votre entreprise", "Un positionnement sur Google Maps"),
  BULLET(" pour votre entreprise", "La création gratuite d'un logo professionnel"),

  // ---- 7
  H1("7. Conditions et prochaines étapes"),
  P("Pour démarrer votre projet, voici les modalités pratiques :"),
  BULLET(" : 10 à 15 jours ouvrables à compter du versement de l'acompte", "Délai de réalisation"),
  BULLET(" à la commande, solde de 50% à la livraison du site", "Acompte de 50%"),
  BULLET(" : 30 jours à compter de la date d'émission", "Validité de la présente offre"),
  BULLET(" : par téléphone, email ou WhatsApp pour confirmer votre commande", "Prise de contact"),
  EMPTY(160),
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: "📞 ", font: FONT, size: 24 }),
      new TextRun({ text: "Téléphone / WhatsApp", font: FONT, size: 24, bold: true, color: MARINE }),
      new TextRun({ text: " : +226 66 64 80 21", font: FONT, size: 24 }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: "📧 ", font: FONT, size: 24 }),
      new TextRun({ text: "Email", font: FONT, size: 24, bold: true, color: MARINE }),
      new TextRun({ text: " : infos@medias.megasave.fr", font: FONT, size: 24 }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({ text: "🌐 ", font: FONT, size: 24 }),
      new TextRun({ text: "Site web", font: FONT, size: 24, bold: true, color: MARINE }),
      new TextRun({ text: " : www.medias.megasave.fr", font: FONT, size: 24 }),
    ],
  }),

  // ---- 8
  new Paragraph({ children: [new PageBreak()] }),
  H1("8. Conclusion"),
  P(
    "Nous sommes convaincus que cette offre représente une opportunité unique pour votre entreprise de se démarquer de la concurrence et de s'imposer dans l'espace digital. MEGASAVE MEDIAS s'engage à vous livrer un site internet professionnel, esthétique et performant, dans les meilleurs délais."
  ),
  P(
    "Nous restons à votre disposition pour toute question, démonstration ou ajustement de la présente proposition. Il nous fera grand plaisir de vous accompagner dans cette belle aventure numérique."
  ),
  P(
    "Dans l'attente de votre retour favorable, veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées."
  ),
  EMPTY(300),
  P("Le Directeur Commercial", { align: AlignmentType.LEFT, italics: true, size: 24, after: 60 }),
  P("MEGASAVE MEDIAS", { align: AlignmentType.LEFT, bold: true, size: 24, color: MARINE, after: 120 }),
];

if (cachetData) {
  corps.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 100 },
      children: [
        new ImageRun({ data: cachetData, transformation: { width: 150, height: 100 }, type: "png" }),
      ],
    })
  );
} else {
  corps.push(P("[Cachet et signature]", { italics: true, color: GRIS, size: 22 }));
}

// -------------------------------------------------------------- Header/Footer
const makeFooter = () =>
  new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: ROUGE, space: 4 } },
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 20 },
        children: [
          new TextRun({
            text: "Bobo 2010, Bobo-Dioulasso, Burkina Faso  |  Tél : +226 66 64 80 21  |  infos@medias.megasave.fr  |  www.medias.megasave.fr",
            size: 16, font: FONT, color: GRIS,
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", size: 16, font: FONT, color: "888888" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, font: FONT, color: "888888" }),
          new TextRun({ text: " / ", size: 16, font: FONT, color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: FONT, color: "888888" }),
        ],
      }),
    ],
  });

const defaultHeader = new Header({
  children: [
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ROUGE, space: 4 } },
      tabStops: [{ type: "right", position: 9026 }],
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "MEGASAVE MEDIAS", font: FONT, size: 18, bold: true, color: MARINE }),
        new TextRun({ text: "\t", font: FONT, size: 18 }),
        new TextRun({
          text: `${CLIENT} – Offre Commerciale`,
          font: FONT, size: 18, italics: true, color: "888888",
        }),
      ],
    }),
  ],
});

// -------------------------------------------------------------- Document
const doc = new Document({
  creator: "MEGASAVE MEDIAS",
  title: `Offre commerciale – ${CLIENT}`,
  description: "Offre commerciale pour la création d'un site internet professionnel",
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "❯",
            alignment: AlignmentType.LEFT,
            style: {
              run: { color: ROUGE, bold: true, size: 22, font: FONT },
              paragraph: { indent: { left: 600, hanging: 360 } },
            },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 24 } },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
        titlePage: true,
      },
      headers: { default: defaultHeader, first: new Header({ children: [new Paragraph("")] }) },
      footers: { default: makeFooter(), first: makeFooter() },
      children: [...couverture, ...corps],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2], buf);
  console.log("OK ->", process.argv[2]);
});
