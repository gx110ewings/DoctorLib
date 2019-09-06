import knex from "knexClient";
import getAvailabilities from "./getAvailabilities";

/**
 *  Test cases for appointment availability module.
 */
describe("getAvailabilities", () => {
  beforeEach(() => knex("events").truncate());

  describe("case 1", () => {
    it("test 1", async () => {
      const numberOfDays = 7; // can not modify due to total days in week are 7
      const availabilities = await getAvailabilities(new Date("2014-08-10"), numberOfDays);
      expect(availabilities.length).toBe(numberOfDays);
      for (let i = 0; i < numberOfDays; ++i) {
        expect(availabilities[i].slots).toEqual([]);
      }
    });
  });

  describe("case 2", () => {
    it("test 1", async () => {
      const numberOfDays = 10;
      const availabilities = await getAvailabilities(new Date("2014-08-10"), numberOfDays);
      expect(availabilities.length).toBe(0);
    });
  });

  describe("case 3", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2014-08-04 09:30"),
          ends_at: new Date("2014-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const numberOfDays = 7; // can not modify due to total days in week are 7
      const availabilities = await getAvailabilities(new Date("2014-08-10"), numberOfDays);
      expect(availabilities.length).toBe(numberOfDays);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2014-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00",
        "11:30",
        "12:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
          String(new Date("2014-08-16"))
      );
    });
  });

  describe("case 4", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const numberOfDays = 7; // can not modify due to total days in week are 7
      const availabilities = await getAvailabilities(new Date("2014-08-10"), numberOfDays);
      expect(availabilities.length).toBe(numberOfDays);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2014-08-11"))
      );
      expect(availabilities[6].slots).toEqual([]);
    });
  });

  describe("case 5", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2014-08-11 10:30"),
          ends_at: new Date("2014-08-11 11:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const numberOfDays = 7; // can not modify due to total days in week are 7
      const availabilities = await getAvailabilities(new Date("2014-08-10"), numberOfDays);
      expect(availabilities.length).toBe(numberOfDays);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2014-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2014-08-11"))
      );
      expect(availabilities[6].slots).toEqual([]);
    });
  });

  describe("case 6", () => {
    beforeEach(async () => {
      await knex("events").insert([
        {
          kind: "appointment",
          starts_at: new Date("2018-08-11 10:30"),
          ends_at: new Date("2018-08-11 12:30")
        },
        {
          kind: "opening",
          starts_at: new Date("2018-08-04 09:30"),
          ends_at: new Date("2018-08-04 12:30"),
          weekly_recurring: true
        }
      ]);
    });

    it("test 1", async () => {
      const numberOfDays = 7; // can not modify due to total days in week are 7
      const availabilities = await getAvailabilities(new Date("2018-08-10"), numberOfDays);
      expect(availabilities.length).toBe(numberOfDays);

      expect(String(availabilities[0].date)).toBe(
          String(new Date("2018-08-10"))
      );
      expect(availabilities[0].slots).toEqual([]);

      expect(String(availabilities[1].date)).toBe(
          String(new Date("2018-08-11"))
      );
      expect(availabilities[1].slots).toEqual([
        "9:30",
        "10:00"
      ]);

      expect(String(availabilities[6].date)).toBe(
          String(new Date("2018-08-16"))
      );
    });
  });
});
