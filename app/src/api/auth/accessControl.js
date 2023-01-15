import { getSavedConnectionUrlApi } from "../server/connection";

export async function listLockedUsersApi() {
  try {
    let response = await fetch(
      `${await getSavedConnectionUrlApi()}/auth/lockedUsers`
    );
    let result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
}

export async function unlockUserApi(username) {
  try {
    let response = await fetch(
      `${await getSavedConnectionUrlApi()}/auth/unlockUser/${username}`
    );
    let result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
}

export async function listDevicesApi() {
  try {
    let response = await fetch(
      `${await getSavedConnectionUrlApi()}/auth/devices`
    );
    let result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
}

export async function changeDeviceStatusApi(data) {
  console.log(data);
  try {
    let response = await fetch(
      `${await getSavedConnectionUrlApi()}/auth/deviceStatus`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    let result = response.json();
    return result;
  } catch (error) {}
}
