import moment from "moment";
import knex from "knexClient";

/**
 * Return availability
 *
 * @param date
 * @param numberOfDays
 *
 * @return {Promise<[]>}
 */
export default async function getAvailabilities(date, numberOfDays = 7) {
  // Return empty array if numbers of days exceed seven
  if (numberOfDays > 7) {
    return [];
  }
  const availabilities = new Map();
  for (let i = 0; i < numberOfDays; ++i) {
    let tmpDate = moment(date).add(i, "days");
    availabilities.set(tmpDate.format("d"), {
      date: tmpDate.toDate(),
      slots: []
    });
  }

  const events = await knex
      .select("kind", "starts_at", "ends_at", "weekly_recurring")
      .from("events")
      .orderBy("kind", "desc")
      .where(function () {
        this.where("weekly_recurring", true).orWhere("ends_at", ">", +date);
      });

  for (const event of events) {
    for (
        let date = moment(event.starts_at);
        date.isBefore(event.ends_at);
        date.add(30, "minutes"
        )
    ) {
      let day = availabilities.get(date.format("d"));
      if (event.kind === "opening" && date.isAfter(day.date) === false) {
        day.slots.push(date.format("H:mm"));
      } else if (event.kind === "appointment") {
        day.slots = day.slots.filter(
            slot => slot.indexOf(date.format("H:mm")) === -1
        );
      }
    }
  }

  return Array.from(availabilities.values())
}
