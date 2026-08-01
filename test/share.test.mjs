import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// index.html は single-file / no build step を保つため、共有ロジックだけを
// マーカーで囲って切り出し、DOM 無しで評価する。
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");

const block = /\/\* share:pure \*\/([\s\S]*?)\/\* \/share:pure \*\//.exec(html);
assert.ok(block, "index.html に share:pure ブロックが見つからない");

const { shareText, shareUrl, SHARE_URL } = new Function(
  `${block[1]}; return { shareText, shareUrl, SHARE_URL };`
)();

test("やみスライム到達（4096）は誕生を見出しにする", () => {
  assert.equal(
    shareText({ score: 98765, top: 4096, name: "やみ" }),
    "やみスライムが生まれた！🌑\nスコア 98,765\n\n#にじスラ"
  );
});

test("にじいろスライム到達（2048）は誕生を見出しにする", () => {
  assert.equal(
    shareText({ score: 12340, top: 2048, name: "にじいろ" }),
    "にじいろスライムが生まれた！🌈\nスコア 12,340\n\n#にじスラ"
  );
});

test("到達前は最大スライムの名前で「まで育った」にする", () => {
  assert.equal(
    shareText({ score: 3210, top: 256, name: "ゆうやけ" }),
    "ゆうやけスライムまで育った！\nスコア 3,210\n\n#にじスラ"
  );
});

test("スコアは3桁区切りにする", () => {
  assert.match(shareText({ score: 1234567, top: 2, name: "しずく" }), /スコア 1,234,567\n/);
  assert.match(shareText({ score: 0, top: 2, name: "しずく" }), /スコア 0\n/);
});

test("4096 を超える値でも やみ の誕生として扱う", () => {
  assert.equal(
    shareText({ score: 1, top: 8192, name: "やみ" }),
    "やみスライムが生まれた！🌑\nスコア 1\n\n#にじスラ"
  );
});

test("shareUrl は X の intent URL を組み立てる", () => {
  const u = new URL(shareUrl({ score: 12340, top: 2048, name: "にじいろ" }));
  assert.equal(u.origin + u.pathname, "https://x.com/intent/post");
  assert.equal(u.searchParams.get("url"), SHARE_URL);
  assert.equal(
    u.searchParams.get("text"),
    "にじいろスライムが生まれた！🌈\nスコア 12,340\n\n#にじスラ"
  );
});

test("shareUrl はテキストをエンコードし、生の # や改行を残さない", () => {
  const raw = shareUrl({ score: 12340, top: 2048, name: "にじいろ" });
  const query = raw.slice(raw.indexOf("?") + 1);
  assert.ok(!query.includes("\n"), "改行が生のまま残っている");
  assert.ok(!query.includes("#"), "# が生のまま残っている（フラグメント扱いされる）");
});

test("SHARE_URL は公開中の本番URL", () => {
  assert.equal(SHARE_URL, "https://slime.fujiemon.dev/");
});
