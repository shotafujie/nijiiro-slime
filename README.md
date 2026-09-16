# にじいろスライム

同じスライムをくっつけて色を育てる、ぷにぷに合体パズル。
2048 で「にじいろスライム」、4096 で「やみスライム」が生まれます。

▶ https://slime.fujiemon.dev/

## PV
<video src="media/pv.mp4" controls width="360"></video>

## あそびかた
矢印キー / WASD、またはスワイプでスライムを動かします。
同じ数字のスライムがぶつかると合体して、色が一段派手になります。

## シェア
にじいろスライム（2048）・やみスライム（4096）が生まれたとき、
そしてゲームオーバー時に、スコア付きで X にポストできます。

## 開発
```
node --test test/share.test.mjs
```
`index.html` は single-file / no build step を保つため、共有テキストの生成ロジックだけを
`/* share:pure */` … `/* /share:pure */` で囲み、テストから DOM 無しで切り出して評価しています。

## クレジット
ルールは Gabriele Cirulli 氏の [2048](https://github.com/gabrielecirulli/2048)（MIT License）に
着想を得ていますが、コードはすべて独自実装です。2048 自体も 1024! / Threes! の系譜にあります。

フォント: [Mochiy Pop One](https://fonts.google.com/specimen/Mochiy+Pop+One) /
[Zen Maru Gothic](https://fonts.google.com/specimen/Zen+Maru+Gothic)（SIL Open Font License 1.1）

## ライセンス
MIT License
