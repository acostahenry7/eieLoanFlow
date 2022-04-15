import { getSavedConnectionUrlApi } from "./server/connection";

export async function getDaypaymentsRepApi(employeeId) {
  try {
    const url = `${await getSavedConnectionUrlApi()}/reports/daypayments/${employeeId}`;
    const response = await fetch(url);
    const result = response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
