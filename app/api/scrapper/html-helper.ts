import * as cheerio from 'cheerio';

export function extractTextFromHtml(htmlContent: string): string {
  const $ = cheerio.load(htmlContent);

  $('script, style').remove();

  let text = $('body').text();

  text = text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n')  // Replace multiple newlines with single newline
    .trim();  // Remove leading and trailing whitespace

  return text;
}