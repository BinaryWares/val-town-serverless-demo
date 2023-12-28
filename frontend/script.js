const httpValUrl = 'INSERT_YOUR_HTTP_VAL_URL_HERE';
const appRoot = document.getElementById('app');

const generateColorStripsHTMLString = (color) =>
  `<div class="h-8" style="background-color:${color}"></div>`;

const generatePalleteCardHTMLString = ({ name, likes, colors, id }) => {
  return `<article
  class="bg-slate-700 p-2 rounded-lg mb-2 border-[1px] border-green-800"
  >
  <h2 class="text-xs mb-2 text-zinc-200">${name}</h2>
  <div>
    ${colors.map((color) => generateColorStripsHTMLString(color)).join('')}
  </div>
  <div class="mt-2 flex items-center align-end justify-end">
    <button
      class="hover:scale-110 bg-slate-900 px-2 rounded-xl"
      title="like"
      data-pid="${id}"
      onclick="handleLike('${id}')"
    >
      <span
        class="text-red-600 align-middle"
        aria-label="like icon"
      >
        ♥
      </span>
      <span
        class="text-xs animate-bounce align-middle text-neutral-100"
        aria-label="likes count"
      >
        ${likes}
      </span>
    </button>
  </div>
  </article>`;
};

const fetchPallettes = async () => {
  try {
    const resp = await fetch(httpValUrl);
    const { data = [] } = await resp.json();
    return data;
  } catch (err) {
    return [];
  }
};

const buildPalletteCards = async () => {
  const data = await fetchPallettes();
  let templateString = ``;
  data.forEach((pallette) => {
    const { id, name, colors, likes } = pallette;
    templateString += generatePalleteCardHTMLString({
      name,
      id,
      colors,
      likes,
    });
  });
  return templateString;
};

const setUpdatedCount = (paletteId, updatedCount) => {
  const selector = `button[title="like"][data-pid="${paletteId}"]`;
  const clickedButton = document.querySelector(selector);
  const countContainer = clickedButton?.getElementsByTagName('span')?.[1];
  if (countContainer && updatedCount) {
    countContainer.innerText = updatedCount;
  }
};

const handleLike = async (paletteId) => {
  console.log('executing fetch');
  try {
    const resp = await fetch(httpValUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: paletteId }),
    });
    const {
      data: { likes = null },
    } = await resp.json();
    console.log(likes);
    setUpdatedCount(paletteId, likes);
  } catch (err) {
    console.log(err);
    console.error('update like failed');
    return null;
  }
};

const initApp = async () => {
  const template = await buildPalletteCards();
  appRoot.innerHTML = template;
};

initApp();
