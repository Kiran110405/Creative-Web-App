const calendar = new SimpleCalendarJs("#calendar", {
  // Portuguese example
  weekdays: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  showWeekdayChars: 3, // Show only first 3 characters: "Dom", "Seg", etc.
  labels: {
    month: "Mês",
    week: "Semana",
    day: "Dia",
    events: "eventos",
    event: "evento",
    before: "Antes das",
    after: "Depois das",
  },
});

// French example
const frenchCalendar = new SimpleCalendarJs("#calendar", {
  weekdays: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  showWeekdayChars: 2, // Show first 2 characters: "Di", "Lu", etc.
  labels: {
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    events: "événements",
    event: "événement",
    before: "Avant",
    after: "Après",
  },
});
