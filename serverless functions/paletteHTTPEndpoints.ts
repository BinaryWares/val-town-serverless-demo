import { paletteInfo } from "ESM_MODULE_URL_TO_paletteInfoUtils_VAL";

const getQueryParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const queryParams = Object.fromEntries(searchParams.entries());
  return queryParams;
};

const getPalletesData = async () => {
  const pallettes = await paletteInfo.getAllPallettes();
  return Response.json({ data: pallettes });
};

const getLikesCount = async (palletteId: string) => {
  const likes = await paletteInfo.getLikesById(palletteId);
  return Response.json({ data: { likes } });
};

const setLikesCount = async (request: Request) => {
  console.log(request);
  if (request.headers.get("Content-Type") !== "application/json") {
    throw Error("Invalid Content Type");
  }
  const body = await request.json();
  const palletteId = body?.id;
  await paletteInfo.IncrementLikesById(palletteId);
  const likes = await paletteInfo.getLikesById(palletteId);
  const response = new Response();
  return Response.json({
    data: { likes },
  });
};

// exercise extreme caution if you are using this in production
const sendOptionsResponse = () => {
  const response = new Response();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
};

export const likesEndpoint = async (request: Request) => {
  const requestMethod = request.method;
  const palletteId = getQueryParams(request)?.id;
  switch (requestMethod) {
    case "GET":
      return palletteId ? await getLikesCount(palletteId) : await getPalletesData();
    case "POST":
      return await setLikesCount(request);
    case "OPTIONS":
      return sendOptionsResponse();
    default:
      throw Error("Invalid Request Method");
  }
};