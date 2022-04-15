import { getSavedConnectionUrlApi } from "./server/connection";

export async function getCustomerImgApi(id) {
  console.log("here", id);

  try {
    const url = `${await getSavedConnectionUrlApi()}/customer/img/${id}`;
    const response = await fetch(url);
    console.log(response);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function imageUploadHandler(image, data) {
  console.log(data);
  const options = {
    method: "POST",
    body: createFormData(image, data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/api/upload`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function updateCustomerImg(data) {
  data = {
    ...data,
    imageUrl: `${await getSavedConnectionUrlApi()}/assets/profile/${
      data.fileName
    }`,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const url = `${await getSavedConnectionUrlApi()}/customer/img`;
    const response = await fetch(url, options);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log();
  }
}

const createFormData = (image, body) => {
  const data = new FormData();

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  data.append("userImg", {
    name: `${Date.now()}`,
    uri: image.currentUri,
    type: "image/jpeg",
  });

  console.log("DATA FROM CREATE", data);
  return data;
};
