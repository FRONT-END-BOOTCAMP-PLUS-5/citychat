import { ClientPageRoot } from "next/dist/client/components/client-page";

//태그 추출 함수
export function parseTags(content: string): string[] {
  const tagPattern = /#([a-zA-Z0-9가-힣]+)/g; // # + 한글과 영문, 숫자 + shiftbar
  const tags: string[] = [];

  let match;
  while ((match = tagPattern.exec(content))) {
    tags.push(match[1]);
  }
  return tags;
}

//태그 하이라이트 함수
export function highlightTags(content: string): string {
  const tagPattern = /#([a-zA-Z0-9가-힣]+)/g; // # + 한글과 영문, 숫자 + shiftbar
  return content.replace(
    tagPattern,
    "<span style=\"background-color: #cce4ff; color: #0066cc; padding: 2px 4px; border-radius: 4px; font-weight: bold;\">#$1</span>"
  );
}
