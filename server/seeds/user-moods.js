import usersData from "../seed-data/users.js";
import moodsData from "../seed-data/moods.js";
import upliftingMessagesData from "../seed-data/uplifting_messages.js";


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert(usersData);
  await knex("uplifting_messages").del();
  await knex("uplifting_messages").insert(upliftingMessagesData);
  
  await knex("mood").del();
  await knex("mood").insert(moodsData);
}
