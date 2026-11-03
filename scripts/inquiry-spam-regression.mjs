import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = readFileSync(new URL("../app/routes/api.inquiry.ts", import.meta.url), "utf8")
  .replace(/^import .*;\n/gm, "");
const js = stripTypeScriptTypes(source);
let writes = 0;
let notifications = 0;
globalThis.__notifyInquiryTest = async () => {
  notifications++;
  return { delivered: ["resend", "webhook"], attempted: [], failed: [] };
};
const { action } = await import("data:text/javascript," + encodeURIComponent(
  "const deliverInquiryNotifications = globalThis.__notifyInquiryTest;\n" + js
));
const context = { cloudflare: { env: { DB: {
  prepare() { writes++; return { bind() { return { async run() { return { meta: { last_row_id: 1 } }; } }; } }; }
} } } };
async function submit(fields) {
  return action({
    request: new Request("https://example.com/api/inquiry", {
      method: "POST",
      body: new URLSearchParams({ source: "vacation-quote", fullName: "Test Traveler", email: "traveler@example.com", ...fields }),
    }),
    context,
  });
}
const spam = [
  "Play on the house today! A new gaming project bonus account http://advodocs.ru/go-na.php?eg7bkx",
  "100-spin slot rule free $3000 welcome credit http://kodomoji.com/go-na.php?rp76ty",
  "Still doubling your bet? http://darejeans.com/go-na.php?3vtwa3",
  "Entertainment platform $3000 http://darejeans.com/go-na.php?wtooue",
  "$3000 fresh slot project http://advodocs.ru/go-na.php?c7ijed",
  "New gaming project http://rdccii.com/go-na.php?syr9vg",
  "No deposit needed https://drkaze.ru/go-na.php?g3arlg",
  "Free spins welcome bonus https://different.example/offer",
  "FREE SPINS welcome bonus https://different.example/offer",
  "https://different.example/ＧＯ-ＮＡ.php?x",
  "https://different.example/go-\u200Bna.php?x",
];
for (const value of spam) {
  for (const field of ["destinationInterest", "notes", "extra"]) {
    const response = await submit({ [field]: value });
    assert.equal(response.status, 400);
  }
}
assert.equal(writes, 0, "Spam must never reach the database");
assert.equal(notifications, 0, "Spam must never trigger notifications");
for (const fields of [
  { destinationInterest: "Moon Palace Cancun", notes: "Budget $3000, flexible dates" },
  { destinationInterest: "https://www.palaceresorts.com/", notes: "Interested in resort credit" },
  { destinationInterest: "Las Vegas", notes: "Casino resort and slots, budget $3000" },
  { source: "about-quick-note", fullName: "", notes: "Please help with a family vacation." },
]) {
  assert.equal((await submit(fields)).status, 200);
}
assert.equal(writes, 4);
assert.equal(notifications, 4);
delete globalThis.__notifyInquiryTest;
console.log("Passed: 33 spam submissions blocked before side effects; 4 legitimate inquiries accepted.");
