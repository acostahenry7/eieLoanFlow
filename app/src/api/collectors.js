import { getSavedConnectionUrlApi } from "./server/connection";

export async function getCollectorsApi() {
  try {
    const url = `${await getSavedConnectionUrlApi()}/collectors`;
    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("ahaa", error);
  }
}

export async function updateCollectorParams(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/collectors/update`;
    const response = await fetch(url, options);
    const result = response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
