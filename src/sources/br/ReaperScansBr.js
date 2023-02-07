import * as cheerio from 'cheerio';
import 'selenium-webdriver';
import { isUrlAbsolute } from '../../utils/isAbsoluteUrl';
import { Status } from '../helpers/constants';

const baseUrl = 'https://reaperscans.net/';

const sourceId = 79;
const sourceName = 'ReaperScans (Br)';

const popularNovels = async page => {
  let url =
    baseUrl + '/home';

  const totalPages = 1;

  const result = await fetch(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.main-novels > div > div > div:nth-child(2) > div > div').each(function () {
    let novelUrl = loadedCheerio(this).find('.c-hCLgme > a').attr('href');
    if (novelUrl && !isUrlAbsolute(novelUrl)) {
    novelUrl = baseUrl + novelUrl;
    }
    
    const novelName = loadedCheerio(this)
      .find('h5')
      .text()
      .trim();
    const novelCover = loadedCheerio(this)
      .find('img')
      .attr('src');
    
    const novel = {
      sourceId,
      novelName,
      novelCover,
      novelUrl,
    };

    novels.push(novel);
  });

  return { totalPages, novels };
};

const parseNovelAndChapters = async novelUrl => {
  const url = novelUrl;

  const result = await fetch(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novel = {
    sourceId,
    sourceName,
    url,
    novelUrl,
  };

  novel.novelUrl = novelUrl;

  novel.novelName = loadedCheerio('.series-main > div.bg.container.relative > div > div.lg\\:col-span-9.col-span-1 > div.series-title > h1').text().trim();

  novel.novelCover = loadedCheerio('.series-main img').attr('src');

  loadedCheerio('.post-content_item').each(function () {
    const detailName = loadedCheerio(this)
      .find('.summary-heading > h5')
      .text()
      .trim();
    const detail = loadedCheerio(this).find('.summary-content').text().trim();

    switch (detailName) {
      case 'Genre(s)':
        novel.genre = detail.replace(/[\t\n]/g, ',');
        break;
      case 'Author(s)':
        novel.author = detail;
        break;
      case 'Status':
        novel.status = detail.includes('OnGoing')
          ? Status.ONGOING
          : Status.COMPLETED;
        break;
    }
  });

  novel.summary = loadedCheerio('.description-container > p').text().trim();

  let novelChapters = [];

  loadedCheerio('#simple-tabpanel-0 > div > span > div > ul > a').each(function () {
    loadedCheerio('i').remove();

    const chapterName = loadedCheerio(this).find('span').text().trim();
    const releaseDate = loadedCheerio(this).find('p').text().trim();

    let chapterUrl = loadedCheerio(this).attr('href');
    if (chapterUrl && !isUrlAbsolute(chapterUrl)) {
    chapterUrl = baseUrl + chapterUrl;
    }

    const chapter = { chapterName, releaseDate, chapterUrl };

    novelChapters.push(chapter);
  });

  novel.chapters = novelChapters.reverse();

  return novel;
};

const parseChapter = async (novelUrl, chapterUrl) => {
  const url = chapterUrl;
  
  var webdriver = require ('selenium-webdriver'),
      By = webdriver.By;
  var driver = new webdriver.Builder()
  .forBrowser('PhantomJS')
  .build();
  
  await driver.get(chapterUrl);
  
  driver.findElement(By.id('reading-content').then(function(element){
    element.getText().then(function(chapterText){
      console.log(chapterText);
      return chapterText;
       });
    }),
);
    
  const result = await fetch(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  const chapterName = loadedCheerio('#chapter-heading').text();
  //let chapterText = loadedCheerio('.reading-content').html();
  const chapter = {
    sourceId,
    novelUrl,
    chapterUrl,
    chapterName,
    chapterText,
  };

  return chapter;
};

const searchNovels = async searchTerm => {
  const url = `${baseUrl}?s=${searchTerm}&post_type=wp-manga`;

  const result = await fetch(url);
  const body = await result.text();

  let loadedCheerio = cheerio.load(body);

  let novels = [];

  loadedCheerio('.c-tabs-item__content').each(function () {
    const novelName = loadedCheerio(this)
      .find('.post-title > h3')
      .text()
      .trim();
    const novelCover = loadedCheerio(this)
      .find('div > div > a > img')
      .attr('data-src');

    let novelUrl = loadedCheerio(this).find('div > div > a').attr('href');
    novelUrl = novelUrl.replace(`${baseUrl}/`, '');

    const novel = {
      sourceId,
      novelName,
      novelCover,
      novelUrl,
    };

    novels.push(novel);
  });

  return novels;
};

const ReaperScansBrScraper = {
  popularNovels,
  parseNovelAndChapters,
  parseChapter,
  searchNovels,
};

export default ReaperScansBrScraper;
