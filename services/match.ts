import type { Article, ProfileKeyword, Alias, DriverKeyword } from '@prisma/client';

const WORD_BOUNDARY = '(?<![A-Za-zÆØÅæøå0-9])';

export function buildProfileMatcher(keywords: ProfileKeyword[]) {
  const includes = keywords.filter((k) => k.type === 'include');
  const excludes = keywords.filter((k) => k.type === 'exclude');
  const regexes = keywords.filter((k) => k.type === 'regex');

  return (text: string) => {
    const haystack = text.toLowerCase();

    if (excludes.some((k) => haystack.includes(k.pattern.toLowerCase()))) {
      return false;
    }

    if (regexes.length > 0) {
      const matched = regexes.some((k) => new RegExp(k.pattern, 'i').test(text));
      if (matched) {
        return true;
      }
    }

    if (includes.length === 0) {
      return false;
    }

    return includes.some((k) => haystack.includes(k.pattern.toLowerCase()));
  };
}

export function matchSpokespeople<T extends Alias>(text: string, aliases: T[]) {
  const matches = new Set<string>();
  for (const alias of aliases) {
    const escaped = alias.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${WORD_BOUNDARY}${escaped}${WORD_BOUNDARY}`, 'i');
    if (regex.test(text)) {
      matches.add(alias.spokespersonId);
    }
  }
  return [...matches];
}

export function matchDrivers<T extends DriverKeyword>(text: string, keywords: T[]) {
  const haystack = text.toLowerCase();
  const matches = new Set<string>();
  for (const keyword of keywords) {
    if (haystack.includes(keyword.value.toLowerCase())) {
      matches.add(keyword.driverId);
    }
  }
  return [...matches];
}

export function buildArticleText(article: Pick<Article, 'title' | 'summary' | 'content'>) {
  return [article.title, article.summary ?? '', article.content ?? ''].join('\n');
}
