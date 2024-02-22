import axios from "axios";
import cheerio from "cheerio";

let meta = {};

export async function scrapping(url) {
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);
  $("meta").each((index, el) => {
    if ($(el).attr("property") && $(el).attr("property").includes("og:")) {
      const key = $(el).attr("property").replace("og:", "");
      const value = $(el).attr("content");
      meta[key] = value;
    }
  });
  return meta;
}
