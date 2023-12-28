const firebaseURI = "YOUR_FIREBASE_REALTIME_DB_URI";
const avaialblePalletes = ["pallette1", "pallette2"];

const isPalletteAvailable = (palletteId: string) => avaialblePalletes.includes(palletteId);

const getAllPalletesData = async () => {
  const response = await fetch(`${firebaseURI}.json`);
  const palletesData = await response.json();
  const flattenedData = avaialblePalletes.reduce((acc:any[], curr) => {
    acc = [
      ...acc,
      {
        ...palletesData[curr],
        colors: palletesData[curr]?.colors?.split("::") ?? [],
        id: curr,
      },
    ];
    return acc;
  }, []);
  return flattenedData;
};

const likesGetter = async (palletteId: string) => {
  if (!palletteId || !isPalletteAvailable(palletteId)) throw Error("Invalid Id");
  const palletteURI = `${firebaseURI}${palletteId}.json`;
  const response = await fetch(palletteURI);
  const palleteInfo = await response.json();
  return palleteInfo?.likes;
};

const likesSetter = async (palletteId: string) => {
  if (!palletteId || !isPalletteAvailable(palletteId)) throw Error("Invalid Id");
  const palletteURI = `${firebaseURI}${palletteId}/likes.json`;
  try {
    await fetch(palletteURI, {
      "method": "PUT",
      "body": JSON.stringify({
        ".sv": { "increment": 1 },
      }),
    });
  } catch (error) {
    throw Error(error);
  }
};

export const paletteInfo = {
  exists: isPalletteAvailable,
  getLikesById: likesGetter,
  IncrementLikesById: likesSetter,
  getAllPallettes: getAllPalletesData,
};