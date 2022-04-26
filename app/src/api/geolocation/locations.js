export async function generateCoordsByAddress(location) {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=10149+${location
      .split(" ")
      .join(
        "%20"
      )}+Parkway,+Mountain+View,+RD&key=AIzaSyCV2wvw5V8c1hjTjaKyuCXppDjs81uk-n4`;
    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}
