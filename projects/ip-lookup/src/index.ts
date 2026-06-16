import https from "https";

const target = process.argv[2] ?? "";

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function main(): Promise<void> {
  const url = `https://ipapi.co/${encodeURIComponent(target)}/json/`;
  const data = JSON.parse(await get(url));

  if (data.error) {
    console.error(`Error: ${data.reason}`);
    process.exit(1);
  }

  console.log(`\n  IP        ${data.ip}`);
  console.log(`  Location  ${data.city}, ${data.region}, ${data.country_name}`);
  console.log(`  ISP       ${data.org}`);
  console.log(`  Timezone  ${data.timezone}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
