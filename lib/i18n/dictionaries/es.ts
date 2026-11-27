import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { pluralize } from "@/lib/i18n/plural";

const plural = pluralize("es");

/** UI strings of the Spanish universe (`/es`): immersion, the interface speaks the language studied. */
export const es: Dictionary = {
  nav: {
    label: "Principal",
    comingSoon: "próximamente",
    items: (count) => plural(count, { one: "elemento", other: "elementos" }),
    tabs: {
      home: "Inicio",
      inbox: "Bandeja",
      review: "Repasar",
      decks: "Mazos",
      profile: "Perfil",
    },
  },
  language: {
    change: (name) => `${name}: cambiar de idioma`,
  },
  home: {
    title: (name) => `${name}: inicio`,
    streak: {
      days: (count) => plural(count, { one: "día", other: "días" }),
      label: "de racha",
      today: "hoy",
      reviewed: "repasado",
      upcoming: "próximo",
      missed: "sin repaso",
    },
    hero: {
      review: {
        eyebrow: "Repaso",
        title: (count) =>
          `${count} ${plural(count, { one: "tarjeta", other: "tarjetas" })} para repasar hoy`,
        cta: "Empezar a repasar",
      },
      inbox: {
        eyebrow: "Bandeja",
        title: (count) =>
          `${count} ${plural(count, { one: "tarjeta nueva", other: "tarjetas nuevas" })} ${plural(count, { one: "espera", other: "esperan" })}`,
        cta: "Elegir tarjetas",
      },
      soon: "pronto",
      caughtUp: {
        title: "¡Todo al día!",
        text: "No hay repasos pendientes ni tarjetas nuevas. ¡Vuelve mañana!",
      },
    },
    decks: {
      title: "Mazos",
      empty: "Todavía no hay mazos en este idioma.",
      cards: (count) => `${count} ${plural(count, { one: "tarjeta", other: "tarjetas" })}`,
    },
  },
  inbox: {
    title: "Bandeja",
    views: {
      label: "Listas",
      new: "Nuevas",
      skipped: "Descartadas",
    },
    intro: {
      new: "Marca las tarjetas que quieres aprender ahora. Las demás se quedan aquí para otro día.",
      skipped:
        "Las tarjetas descartadas no vuelven solas. Apréndelas al final o devuélvelas a la bandeja.",
    },
    decks: {
      label: "Filtrar por mazo",
      all: "Todos los mazos",
    },
    pagination: {
      label: "Páginas",
      previous: "Anterior",
      next: "Siguiente",
      page: (page, pageCount) => `Página ${page} de ${pageCount}`,
    },
    empty: {
      new: "No hay tarjetas nuevas: todo está ordenado.",
      skipped: "Ninguna tarjeta descartada.",
    },
    list: {
      label: "Tarjetas",
      selectAll: "Seleccionar todo",
      selected: "seleccionadas",
      decisions: {
        learn: "Aprender la lista",
        skip: "Descartar",
        restore: "Devolver a la bandeja",
      },
      done: {
        learn: {
          one: "tarjeta añadida a tu aprendizaje",
          other: "tarjetas añadidas a tu aprendizaje",
        },
        skip: { one: "tarjeta descartada", other: "tarjetas descartadas" },
        restore: { one: "tarjeta devuelta a la bandeja", other: "tarjetas devueltas a la bandeja" },
      },
      error: "Algo ha fallado. Inténtalo de nuevo.",
    },
  },
};
