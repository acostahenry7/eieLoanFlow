import { getSavedConnectionUrlApi } from "./server/connection";

export async function createVisitApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/visit`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getVisitsApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/visits`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
