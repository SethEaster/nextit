import * as cheerio from 'cheerio';
import DOMPurify from 'dompurify';

export const processTextBodyHtml = (body: string, disableLinks?: boolean) => {
  if (!body) return '';

  const $ = cheerio.load(body, null, false);

  if (disableLinks) {
    $('a').each((i, el) => {
      $(el).replaceWith($('<span>').text($(el).text()));
    });
  } else {
    $('a').attr('target', '_blank');
  }

  return DOMPurify.sanitize($.html(), { ADD_ATTR: ['target'] });
};
