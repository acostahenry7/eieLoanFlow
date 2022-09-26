import { getSavedConnectionUrlApi } from "./server/connection";

export async function getClientByloan(data) {
  console.log(data);
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/payment`;
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRegisterStatusApi(userId) {
  try {
    const url = `${await getSavedConnectionUrlApi()}/register/${userId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function createRegisterApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/register/create`;
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function createPaymentaApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/payment/create`;
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function createVisitCommentaryApi(data) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/visit/commentary`;
    const response = await fetch(url, options);
    console.log(response);
    const result = await response.json();

    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

//Payment route

export async function getPayementRoutes(employeeId) {
  try {
    const url = `${await getSavedConnectionUrlApi()}/paymentroute/${employeeId}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function createPaymentRouterDetail(customers, employee) {
  const data = {
    employee,
    customers,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/payment/routerdetail/create`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

//ZPL

export async function setReceiptZPL(zpl, id) {
  let data = {
    appZPL: zpl,
    receiptId: id,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/receipt/zpl`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
